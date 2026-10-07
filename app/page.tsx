import { RatingCard } from "./rating-card";
export default function Home() {
  return (
    <div className="page-shell">
      <main><RatingCard /></main>
      <footer>
        <p>Practice demo. Your rating stays on this page.</p>
        <p>Challenge by <a href="https://www.frontendmentor.io/challenges/interactive-rating-component-koxpeBUmI">Frontend Mentor</a>. Built by <a href="https://royeradames.com">Royer Adames</a>.</p>
      </footer>
    </div>
  );
}
