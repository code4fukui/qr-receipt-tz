import { fetchReceipt } from "./fetchReceipt.js";
import { parseReceipt } from "./parseReceipt.js";

export const getReceipt = async (vcode_hhmmss) => {
  const html = await fetchReceipt(vcode_hhmmss);
  const json = parseReceipt(html);
  return json;
};

