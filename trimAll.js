export const trimAll = (obj) => {
  if (Array.isArray(obj)) {
    obj.forEach(i => trimAll(i));
  } else {
    const keys = Object.keys(obj);
    for (const key of keys) {
      if (typeof obj[key] == "string") {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] == "object") {
        trimAll(obj[key]);
      }
    }
  }
};
