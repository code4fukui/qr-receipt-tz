import { parseReceipt } from "../parseReceipt.js";

const html = await Deno.readTextFile("res.html");
const obj = parseReceipt(html);
console.log(obj);
