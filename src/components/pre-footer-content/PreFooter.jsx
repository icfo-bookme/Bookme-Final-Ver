import BlogSectionMVAlaska from "./sundarban/BlogSectionMVAlaska"
import BlogSectionMVBunohash from "./sundarban/BlogSectionMVBunohash"
import BlogSectionMVTheCoastalCruise from "./sundarban/BlogSectionMVTheCoastalCruise"
import BlogSectionMVTheCrown from "./sundarban/BlogSectionMVTheCrown"
import BlogSectionMVTheExplorer from "./sundarban/BlogSectionMVTheExplorer"
import BlogSectionMVTheGlory from "./sundarban/BlogSectionMVTheGlory"
import BlogSectionMVTheWave from "./sundarban/BlogSectionMVTheWave"
import BlogSectionSeaPearlCruise1 from "./sundarban/BlogSectionSeaPearlCruise1"
import BlogSectionSunWay2 from "./sundarban/BlogSectionSunWay2"
import BlogSectionSymphonyOfTheWave from "./sundarban/BlogSectionSymphonyOfTheWave"


export const PreFooter = ({ id }) => {
  return (
    <div>
      {id == 499 && <BlogSectionSunWay2 />}
      {id == 493 && <BlogSectionSymphonyOfTheWave />}
      {id == 257 && <BlogSectionMVAlaska />}
      {id == 494 && <BlogSectionMVTheCoastalCruise />}
      {id == 264 && <BlogSectionMVTheCrown />}
      {id == 261 && <BlogSectionMVTheGlory />}
      {id == 496 && <BlogSectionSeaPearlCruise1 />}
      {id == 260 && <BlogSectionMVTheExplorer />}
      {id == 263 && <BlogSectionMVTheWave />}
      {id == 500 && <BlogSectionMVBunohash />}
    </div>
  )
}
