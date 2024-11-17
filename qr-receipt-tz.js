import { fetchWeb } from "https://code4fukui.github.io/wsutil/fetchWeb.js";
import { getReceipt } from "./getReceipt.js";

export default fetchWeb(async (param, req, path, conninfo) => {
  //console.log("param", param);
  return await getReceipt(param);
});
