import { expect, test, type Page } from "@playwright/test";

const siteName = "Interactive Rating";
const siteUrl = "https://interactive-rating.royeradames.com/";

async function smallText(page: Page) {
  return page.evaluate(() => {
    const out: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || !node.textContent?.trim() || parent.closest("script,style,noscript,.sr-only")) continue;
      if (parent.getClientRects().length === 0) continue;
      if (parseFloat(getComputedStyle(parent).fontSize) < 16) out.push(node.textContent.trim());
    }
    return out;
  });
}

async function submit(page: Page, rating: number) {
  await page.getByRole("radio", { name: `${rating} out of 5`, exact: true }).check();
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Thank you!" })).toBeVisible();
}

test("declares one site name in og:site_name and WebSite JSON-LD, with canonical, Open Graph image and icons", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", siteName);
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl });
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/interactive-rating\.royeradames\.com\/?$/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Interactive Rating/);
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
});

test("desktop rating frame matches the Figma card, type and spacing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/");
  const card = page.locator(".rating-card");
  const box = (await card.boundingBox())!;
  expect(box.width).toBe(412);
  expect(box.height).toBeGreaterThanOrEqual(412);
  expect(box.height).toBeLessThanOrEqual(436);
  expect(Math.abs(box.x + box.width / 2 - 720)).toBeLessThanOrEqual(1);
  expect(Math.abs(box.y + box.height / 2 - 400)).toBeLessThanOrEqual(14);
  await expect(card).toHaveCSS("border-radius", "30px");
  await expect(card).toHaveCSS("padding-left", "31px");
  await expect(card).toHaveCSS("padding-top", "35px");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveCSS("font-size", "28px");
  await expect(heading).toHaveCSS("line-height", "35px");
  const copy = card.locator("p").first();
  await expect(copy).toHaveCSS("font-size", "16px");
  await expect(copy).toHaveCSS("color", "rgb(150, 159, 173)");
  expect((await copy.boundingBox())!.y - ((await heading.boundingBox())!.y + 35)).toBeCloseTo(16, 0);
  const options = page.locator(".rating-option");
  const first = (await options.nth(0).boundingBox())!;
  const second = (await options.nth(1).boundingBox())!;
  expect(first.width).toBe(51);
  expect(second.x - (first.x + first.width)).toBeCloseTo(24, 0);
  const submitButton = page.getByRole("button", { name: "Submit", exact: true });
  const submitBox = (await submitButton.boundingBox())!;
  expect(submitBox.height).toBe(45);
  expect(submitBox.y - (first.y + first.height)).toBeCloseTo(32, 0);
  await expect(submitButton).toHaveCSS("background-color", "rgb(252, 118, 20)");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(19, 21, 24)");
});

test("selected rating is white and hover is orange, as in the Figma Selected and Active states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/");
  await page.getByRole("radio", { name: "4 out of 5", exact: true }).check();
  await page.mouse.move(0, 0);
  const selected = page.locator(".rating-option").nth(3).locator("span").first();
  await expect(selected).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(selected).toHaveCSS("color", "rgb(38, 46, 56)");
  await page.locator(".rating-option").nth(4).hover();
  const hovered = page.locator(".rating-option").nth(4).locator("span").first();
  await expect(hovered).toHaveCSS("background-color", "rgb(252, 118, 20)");
  await page.getByRole("button", { name: "Submit", exact: true }).hover();
  await expect(page.getByRole("button", { name: "Submit", exact: true })).toHaveCSS("background-color", "rgb(255, 255, 255)");
});

test("desktop thank-you frame matches the Figma pill, heading and copy", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/");
  await submit(page, 4);
  const card = page.locator(".rating-card");
  expect((await card.boundingBox())!.width).toBe(412);
  await expect(card).toHaveCSS("text-align", "center");
  const pill = page.getByText("You selected 4 out of 5");
  await expect(pill).toHaveCSS("color", "rgb(252, 118, 20)");
  await expect(pill).toHaveCSS("background-color", "rgb(38, 46, 56)");
  const image = (await card.locator("img").boundingBox())!;
  expect([image.width, image.height]).toEqual([162, 108]);
  expect((await pill.boundingBox())!.y - (image.y + image.height)).toBeCloseTo(32, 0);
  await expect(page.getByRole("heading", { name: "Thank you!" })).toHaveCSS("font-size", "28px");
});

test("mobile frames follow the 375 px design", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  const card = page.locator(".rating-card");
  const box = (await card.boundingBox())!;
  expect(box.width).toBe(327);
  expect(box.x).toBe(24);
  await expect(card).toHaveCSS("padding-left", "24px");
  await expect(card).toHaveCSS("border-radius", "15px");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("font-size", "24px");
  expect((await page.locator(".star-well").boundingBox())!.width).toBe(40);
  await submit(page, 2);
  expect((await card.locator("img").boundingBox())!.width).toBe(144);
  await expect(page.getByRole("heading", { name: "Thank you!" })).toHaveCSS("font-size", "24px");
});

for (const state of ["rating", "thank-you"] as const) {
  test(`width sweep 320 to 1600 px in 10 px steps (${state}): no page scroll, gutters, 16 px floor`, async ({ page }) => {
    await page.goto("/");
    if (state === "thank-you") await submit(page, 3);
    const failures: string[] = [];
    for (let width = 320; width <= 1600; width += 10) {
      await page.setViewportSize({ width, height: 800 });
      if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) failures.push(`${width}: page scroll`);
      const box = (await page.locator(".rating-card").boundingBox())!;
      if (box.x < 16 || box.x + box.width > width - 16) failures.push(`${width}: gutter ${box.x}`);
      const small = await smallText(page);
      if (small.length) failures.push(`${width}: small text ${small.join(" | ")}`);
    }
    expect(failures).toEqual([]);
  });
}
