import { fetchOrLoad, HTMLParser, CSV, nextTag, prevTag, table2json, dl2json, table2csv, sleep } from "https://code4fukui.github.io/scrapeutil/scrapeutil.js";
import { trimAll } from "./trimAll.js";

export const parseReceipt = (html) => {
  const dom = HTMLParser.parse(html);

  const obj = {};
  const divs = dom.querySelectorAll(".invoice-header, .invoice-col");
  for (const div of divs) {
    const h4s = div.querySelectorAll("h4");
    if (h4s.length > 0) {
      if (h4s.length == 1) {
        obj["RECEIPT ISSUER"] = h4s[0].text.trim();
      } else {
        obj[h4s[0].text] = h4s[1].text;
        if (h4s.length > 2) {
          console.log("unknown h4s", h4s);
        }
      }
    } else {
      const ss = div.text.split("\n");
      for (const s0 of ss) {
        const s = s0.trim();
        if (s == "") continue;
        const n = s.indexOf(":");
        if (n < 0) {
          if (s.startsWith("P.O BOX ")) {
            obj["P.O BOX"] = s.substring(8).trim();
          } else {
            console.log("not including :", s);
          }
        } else {
          const name = s.substring(0, n).trim();
          const val = s.substring(n + 1).trim();
          obj[name] = val;
        }
      }
    }
  }
  //console.log(obj);

  const tbls = dom.querySelectorAll("div.table table");

  const json = table2json(tbls[0]);
  //console.log(table2json(tbl));
  trimAll(json);
  obj["ITEMS"] = json;

  const json1 = table2csv(tbls[1]);
  for (const item of json1) {
    const name = item[0].endsWith(":") ? item[0].substring(0, item[0].length - 1) : item[0];
    obj[name] = item[1].trim();
  }
  //console.log(json1);
  return obj;
};
