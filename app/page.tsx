import { Hero } from "./components/Hero";
import { CategoryGrid } from "./components/CategoryGrid";
import { RegionGrid } from "./components/RegionGrid";
import { Stats } from "./components/Stats";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <CategoryGrid />
      <RegionGrid />
    </>
  );
}
