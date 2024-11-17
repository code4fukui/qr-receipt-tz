import { fetchReceipt } from "../fetchReceipt.js";

// https://verify.tra.go.tz/96D5B7166009_212046
const vcode = "96D5B7166009_212046";
const html = await fetchReceipt(vcode);
console.log(html);
await Deno.writeTextFile("res.html", html);
