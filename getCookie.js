export const getCookie = (res, name) => {
  const cookies = res.headers.getSetCookie();
  for (const v of cookies) {
    //console.log(v, name); 
    if (v.startsWith(name + "=")) {
      const n = v.indexOf(";", name.length + 1);
      if (n < 0) return "";
      return name + "=" + v.substring(name.length + 1, n);
    }
  }
  return null;
};
