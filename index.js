const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const fs = require("fs");

const PORT = 8000;
const app = express();

let colors = [];

const url = "https://www.w3.org/TR/SVG11/types.html#ColorKeywords";

axios(url).then((res) => {
  const html = res.data;
  const $ = cheerio.load(html);
  const $tr = $("tr");
  $("tr").each(function () {
    // Find all the td's with class .prop-value
    const $pv = $(this).find(".prop-value");

    // Find all the td's with class .color-keyword-value
    const $ckv = $(this).find(".color-keyword-value");

    // Avoid empty cells and individual cells containing all the data
    if ($pv.text().length > 1 && $pv.text().length < 100) {
      // Manually add rebeccapurple after purple
      if ($pv.text() === "purple") {
        colors.push({
          name: $pv.text(),
          rgb: $ckv.text(),
        });
        colors.push({
          name: "rebeccapurple",
          rgb: "rbg(102, 51, 153)",
        });
      } else {
        colors.push({
          name: $pv.text(),
          rgb: $ckv.text(),
        });
      }
    }
  });

  // Write the result to a json file
  fs.writeFileSync("./colors.json", JSON.stringify(colors));
  console.log(`Wrote ${colors.length} colors to file.`);
  server.close();
});

const server = app.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
