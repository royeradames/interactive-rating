import { expect, test } from "@playwright/test";

test("validates, supports native arrow selection and restores focus after reset", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Choose a rating from 1 to 5" })).toHaveText("Choose a rating from 1 to 5 before submitting.");
  const first = page.getByRole("radio", { name: "1 out of 5", exact: true });
  await expect(first).toBeFocused();
  await first.press("Space");
  await first.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "2 out of 5", exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Thank you!" })).toBeFocused();
  await expect(page.getByText("You selected 2 out of 5")).toBeVisible();
  await page.getByRole("button", { name: "Try another rating" }).click();
  await expect(first).toBeFocused();
  await expect(page.locator('input:checked')).toHaveCount(0);
  expect(errors).toEqual([]);
});

for (const rating of [1, 2, 3, 4, 5]) {
  test(`submits exactly ${rating} and keeps the value local`, async ({ page }) => {
    const writes: string[] = [];
    page.on("request", request => { if (request.method() !== "GET") writes.push(request.url()); });
    await page.goto("/");
    await page.getByRole("radio", { name: `${rating} out of 5`, exact: true }).check();
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    await expect(page.getByText(`You selected ${rating} out of 5`)).toBeVisible();
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
    expect(writes).toEqual([]);
  });
}

test("preserves usable layout across the supplied and family widths", async ({ page }) => {
  for (const width of [375, 400, 640, 768, 1024, 1280, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "How did we do?" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator(".rating-card > p, footer p").evaluateAll(elements => elements.every(element => parseFloat(getComputedStyle(element).fontSize) >= 16))).toBe(true);
    for (const radio of await page.getByRole("radio").all()) {
      const box = await radio.boundingBox();
      // Design circles are 42 px on mobile and 51 px on desktop; 40 px is the narrowest at 320 px, well above the 24 px WCAG 2.5.8 floor.
      expect(box?.width).toBeGreaterThanOrEqual(40);
      expect(box?.height).toBeGreaterThanOrEqual(40);
    }
  }
});


test.describe("without scripts", () => {
  test.use({ javaScriptEnabled: false });
  test("does not submit a native request containing the rating", async ({ page }) => {
    await page.goto("/");
    const requests: string[] = [];
    page.on("request", request => requests.push(request.url()));
    await expect(page.locator("noscript p")).toBeVisible();
    await page.getByRole("radio", { name: "5 out of 5", exact: true }).check();
    await page.getByRole("button", { name: "Submit", exact: true }).click();
    expect(new URL(page.url()).pathname).toBe("/");
    expect(requests.some(url => new URL(url).searchParams.has("rating"))).toBe(false);
  });
});
