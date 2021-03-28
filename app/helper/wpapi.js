import WPAPI from "wpapi";
import tsdJson from "./tsd-json.json";
import { STRINGS }  from '../assets/constants.js';

const wp = new WPAPI({
  endpoint: `${STRINGS.WP_URL}/wp-json`,
  routes: tsdJson.routes,
});
const wpTsdJson = wp.namespace("tsd/json/v1");

export async function getHomeAsync() {
  return wpTsdJson
    ['home-mobile']();
}

export async function getHomeMoreAsync(
  extraPageNumber
) {
  return wpTsdJson
    .home()
    .more()
    .extraPageNumber(extraPageNumber);
}

export async function getCategoryAsync(
  categorySlugs,
  pageNumber,
) {
  // Rewrite @94305
  let slugs = [...categorySlugs];
  for (let i in slugs) {
    if (slugs[i] === "@94305" || slugs[i] === "data-vizzes") {
      slugs[i] = "94305";
    }
  }

  return wpTsdJson
    .category()
    .categorySlugs(slugs.map(encodeURIComponent).join("/"))
    .pageNumber(pageNumber);
}

export async function getPostByIdAsync(id) {
  return wpTsdJson.postsId().postId(id);
}