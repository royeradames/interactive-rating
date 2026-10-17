"use client";
/* eslint-disable @next/next/no-img-element -- next/image added client JavaScript here without optimizing anything (SVGs, data URLs or unoptimized files). */
import { useEffect, useRef, useState } from "react";
const ratings = [1, 2, 3, 4, 5] as const;
type Rating = (typeof ratings)[number];
type RatingState =
  | { kind: "choosing"; rating: Rating | null }
  | { kind: "invalid" }
  | { kind: "submitted"; rating: Rating };

export function RatingCard() {
  const [state, setState] = useState<RatingState>({ kind: "choosing", rating: null });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRatingRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (state.kind === "submitted") headingRef.current?.focus();
  }, [state.kind]);

  if (state.kind === "submitted") {
    return (
      <section className="rating-card thank-you" aria-labelledby="rating-title">
        <img src="/images/illustration-thank-you.svg" width={162} height={108} alt="" loading="lazy" decoding="async" />
        <p className="selection-receipt">You selected {state.rating} out of 5</p>
        <h1 id="rating-title" ref={headingRef} tabIndex={-1}>Thank you!</h1>
        <p>We appreciate you taking the time to give a rating. If you ever need more support, don’t hesitate to get in touch!</p>
        <button className="reset-button" type="button" onClick={() => {
          setState({ kind: "choosing", rating: null });
          requestAnimationFrame(() => firstRatingRef.current?.focus());
        }}>Try another rating</button>
      </section>
    );
  }

  const invalid = state.kind === "invalid";
  const selected = state.kind === "choosing" ? state.rating : null;
  return (
    <section className="rating-card" aria-labelledby="rating-title">
      <div className="star-well" aria-hidden="true"><img src="/images/icon-star.svg" width={17} height={16} alt="" loading="lazy" decoding="async" /></div>
      <h1 id="rating-title">How did we do?</h1>
      <p>Please let us know how we did with your support request. All feedback is appreciated to help us improve our offering!</p>
      <div>
        <noscript><p className="form-error">Enable JavaScript to try this local rating demo. No rating is sent.</p></noscript>
        <fieldset aria-describedby={invalid ? "rating-error" : undefined} aria-invalid={invalid}>
          <legend className="sr-only">Choose a rating out of five</legend>
          <div className="rating-options">
            {ratings.map((rating) => (
              <label className="rating-option" key={rating}>
                <input ref={rating === 1 ? firstRatingRef : undefined} type="radio" name="rating" value={rating} checked={selected === rating} onChange={() => setState({ kind: "choosing", rating })} />
                <span aria-hidden="true">{rating}</span><span className="sr-only">{rating} out of 5</span>
              </label>
            ))}
          </div>
        </fieldset>
        {invalid && <p id="rating-error" className="form-error" role="alert">Choose a rating from 1 to 5 before submitting.</p>}
        <button className="submit-button" type="button" onClick={() => {
          if (selected === null) {
            setState({ kind: "invalid" });
            firstRatingRef.current?.focus();
            return;
          }
          setState({ kind: "submitted", rating: selected });
        }}>Submit</button>
      </div>
    </section>
  );
}
