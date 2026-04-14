import { Hero } from "./components/Hero";
import { CategoryGrid } from "./components/CategoryGrid";
import { RegionGrid } from "./components/RegionGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <RegionGrid />
    </>
  );
}
