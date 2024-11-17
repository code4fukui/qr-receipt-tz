import { getReceipt } from "./getReceipt.js";

const vcode_hhmmss = Deno.args[0];
if (!vcode_hhmmss) {
  console.log("cli.js vcode_hhmmss");
  Deno.exit(1);
}
const json = await getReceipt(vcode_hhmmss);
console.log(JSON.stringify(json, null, 2));
