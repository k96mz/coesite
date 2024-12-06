const sTileName = {
  "un-z5": "small-scale",
  "osm-z456": "small-scale",
  naturalEarth: "0-0-0naturalEarth",
};

const tz = {
  "un-z5": 5,
  "osm-z456": 6,
  // naturalEarth: 6,
};

const defaultZ = 6;
const t = "naturalEarth";

console.log(tz);

if (!tz[t]) tz[t] = defaultZ;

console.log(tz[t]);
