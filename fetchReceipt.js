import { getCookie } from "./getCookie.js";

export const fetchReceipt = async (receiptVerificationCode) => {
  const n = receiptVerificationCode.indexOf("_");
  if (n < 0) throw new Error("needs _hhmmss");

  const vcode = receiptVerificationCode.substring(0, n);
  const s = receiptVerificationCode.substring(n + 1);
  const hms = s.substring(0, 2) + ":" + s.substring(2, 4) + ":" + s.substring(4, 6);
  //const hms = "21:20:46";

  const baseurl = "https://verify.tra.go.tz/";
  const url = baseurl + vcode;
  const res = await fetch(url);
  //console.log(res.headers);

  const options = { headers: { "Cookie": getCookie(res, "ASP.NET_SessionId") } };
  //console.log(options);
  const res2 = await fetch(baseurl + "Verify/Verified?Secret=" + hms, options)
  const html = await res2.text();
  return html;
};
