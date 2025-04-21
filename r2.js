const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { default: fetch } = require("node-fetch");
const pako = require("pako");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const AWS = require("aws-sdk");

const r2 = new AWS.S3({
  endpoint: "https://289eb330c8063e3301e4b36b50ab7c7a.r2.cloudflarestorage.com",
  accessKeyId: "90fda9f30427200bdd432977d9f31fde",
  secretAccessKey:
    "378bd662a455dff0259fe6de029590ed40df33b51ac8c7ba94e4cde66f7db519",
  signatureVersion: "v4",
  region: "auto",
});
const BUCKET_NAME = "onyxcdn";
const TARGET_SIZE = 400;
const TARGET_DURATION = 3;
const TARGET_FPS = 30;
const RENDER_SCALE = 1;

async function unpackTGS(arrayBuffer) {
  const uncompressed = pako.inflate(new Uint8Array(arrayBuffer), {
    to: "string",
  });
  return JSON.parse(uncompressed);
}

async function loadTGSFromURL(tgsUrl) {
  const response = await fetch(tgsUrl);
  if (!response.ok) throw new Error(`Ошибка загрузки TGS: ${response.status}`);
  return unpackTGS(await response.arrayBuffer());
}

async function renderToWebm(lottieJson, options) {
  const { firstColor, secondColor, patternUrl, patternColorFilter } = options;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: TARGET_SIZE * RENDER_SCALE,
    height: TARGET_SIZE * RENDER_SCALE,
    deviceScaleFactor: 1,
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      background: transparent;
      overflow: hidden;
    }
    #gift-card-container {
      width: ${TARGET_SIZE * RENDER_SCALE}px;
      height: ${TARGET_SIZE * RENDER_SCALE}px;
      position: relative;
      overflow: hidden;
    }
    #lottie-animation {
      position: absolute;
      width: 60%;
      height: 60%;
      top: 20%;
      left: 20%;
      z-index: 1;
    }
    svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
</head>
<body>
<div id="gift-card-container">
  <svg width="${TARGET_SIZE * RENDER_SCALE}px" height="${
    TARGET_SIZE * RENDER_SCALE
  }px" viewBox="0 0 ${TARGET_SIZE * RENDER_SCALE} ${
    TARGET_SIZE * RENDER_SCALE
  }" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <radialGradient id="giftGradient" cx="50%" cy="50%" fx="50%" fy="50%" r="69.65%" gradientTransform="translate(0.5, 0.5), scale(0.6667, 1), rotate(90), translate(-0.5, -0.5)">
        <stop stop-color="${firstColor}" offset="0%"></stop>
        <stop stop-color="${secondColor}" offset="100%"></stop>
      </radialGradient>
      <filter id="patternColorFilter">
        <feFlood id="giftGradienPatternColor" flood-color="${patternColorFilter}"></feFlood>
        <feComposite in2="SourceGraphic" operator="in"></feComposite>
      </filter>
     <g id="fullPattern">
        <g opacity="0.212890625" transform="translate(140.5761, 13.79)">
          <use xlink:href="#giftPattern" transform="scale(0.3)"></use>
        </g>
        <g opacity="0.212890625" transform="translate(249.465, 13.79)">
          <use xlink:href="#giftPattern" transform="scale(0.3)"></use>
        </g>
        <g opacity="0.223865327" transform="translate(291.8539, 102.7918)">
          <use xlink:href="#giftPattern" transform="scale(0.3)"></use>
        </g>
        <g opacity="0.223865327" transform="translate(98.1872, 102.7918)">
          <use xlink:href="#giftPattern" transform="scale(0.3)"></use>
        </g>
        <g opacity="0.221633185" transform="translate(276.2551, 176.2043)">
          <use xlink:href="#giftPattern" transform="scale(0.277)"></use>
        </g>
        <g opacity="0.123046875" transform="translate(196.144, 188.6412)">
          <use xlink:href="#giftPattern" transform="scale(0.277)"></use>
        </g>
        <g opacity="0.221633185" transform="translate(116.0329, 176.2043)">
          <use xlink:href="#giftPattern" transform="scale(0.277)"></use>
        </g>
        <g opacity="0.189569382" transform="translate(355.0988, 79.3286)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
        <g opacity="0.260904948" transform="translate(292.0988, 52.1228)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
        <g opacity="0.146437872" transform="translate(334.0988, 17.5326)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
        <g opacity="0.153087798" transform="translate(198.7654, -5.7866)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
        <g opacity="0.145321801" transform="translate(63.4321, 17.5326)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
        <g opacity="0.260904948" transform="translate(105.4321, 52.1228)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
        <g opacity="0.165899368" transform="translate(42.4321, 79.3286)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
        <g opacity="0.165899368" transform="translate(72.7654, 155.8935)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
        <g opacity="0.10500372" transform="translate(49.4321, 205.6413)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
        <g opacity="0.10500372" transform="translate(344.2099, 205.6413)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
        <g opacity="0.152669271" transform="translate(337.2099, 155.8935)">
          <use xlink:href="#giftPattern" transform="scale(0.2247)"></use>
        </g>
      </g>
      <image id="giftPattern" x="0" y="0" width="160" height="160" xlink:href="${patternUrl}"></image>
    </defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <rect x="0" y="0" width="${TARGET_SIZE * RENDER_SCALE}" height="${
    TARGET_SIZE * RENDER_SCALE
  }" fill="url(#giftGradient)"></rect>
      <use transform="scale(1.5)" x="-80" y="10" xlink:href="#fullPattern" filter="url(#patternColorFilter)"></use>
</g>
  </svg>

  <!-- Контейнер для Lottie-анимации -->
  <div id="lottie-animation"></div>
</div>
  <script>
    const anim = lottie.loadAnimation({
      container: document.getElementById("lottie-animation"),
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: ${JSON.stringify(lottieJson)}
    });

    window.animationReady = false;
    anim.addEventListener("DOMLoaded", () => {
      window.animationReady = true;
    });
  </script>
</body>
</html>`;

  await page.setViewport({
    width: TARGET_SIZE * RENDER_SCALE,
    height: TARGET_SIZE * RENDER_SCALE,
    deviceScaleFactor: 1,
  });

  await page.setContent(html, { waitUntil: "networkidle0" });
  fs.writeFileSync("debug.html", await page.content(), "utf-8");

  await page.waitForFunction("window.animationReady === true");

  const frameCount = TARGET_FPS * TARGET_DURATION;
  const tempDir = `./temp_${uuidv4()}`;
  fs.mkdirSync(tempDir);

  for (let i = 0; i < frameCount; i++) {
    await page.evaluate(
      (frame, total) => {
        const anim = lottie.getRegisteredAnimations()[0];
        const progress = frame / (total - 1);
        anim.goToAndStop(progress * anim.totalFrames, true);
      },
      i,
      frameCount
    );

    await page.screenshot({
      path: `${tempDir}/frame_${i.toString().padStart(4, "0")}.png`,
      clip: {
        x: 0,
        y: 0,
        width: TARGET_SIZE * RENDER_SCALE,
        height: TARGET_SIZE * RENDER_SCALE,
      },
      omitBackground: false,
    });
  }

  await browser.close();

  const outputPath = `./output_${uuidv4()}.webm`;

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(`${tempDir}/frame_%04d.png`)
      .inputFPS(TARGET_FPS)
      .videoFilters([
        `scale=${TARGET_SIZE}:${TARGET_SIZE}:flags=lanczos`,
        "format=rgba",
        "premultiply=inplace=1",
      ])
      .outputOptions([
        "-c:v libvpx-vp9",
        "-pix_fmt yuva420p",
        "-auto-alt-ref 0",
        "-crf 10",
        "-b:v 2000k",
        "-deadline good",
        "-row-mt 1",
      ])
      .on("end", resolve)
      .on("error", reject)
      .save(outputPath);
  });

  fs.rmSync(tempDir, { recursive: true });

  // Загружаем в R2
  const fileBuffer = fs.readFileSync(outputPath);
  const fileKey = `${options.filename}.webm`;
  try {
    await r2
      .putObject({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: "video/webm",
        ACL: "public-read",
      })
      .promise();

    fs.unlinkSync(outputPath);
    console.log("It`s okey");
  } catch (err) {
    console.log(err);
  }

  return `https://${BUCKET_NAME}.289eb330c8063e3301e4b36b50ab7c7a.r2.cloudflarestorage.com/${fileKey}`;
}

async function loadPLimit() {
  const { default: pLimit } = await import("p-limit");
  return pLimit;
}
async function singleStart(url) {
  const pLimit = await loadPLimit();
  const limit = pLimit(5); // Ограничение на 10 запросов одновременно

  // Передаём limit в getData()
  const data = await getSingleData(limit, url);
  return data;
}

async function getSingleData(limit, url) {
  if (!limit) {
    throw new Error("limit не передан в getSingleData()");
  }

  try {
    const resGift = await fetchSingleGiftData(url);

    return resGift;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function fetchSingleGiftData(url) {
  try {
    console.log(`parsing ${url}`);

    const response = await axios.get(url);
    if (response.status !== 200) {
      console.error(`Error fetching ${url}: Status ${response.status}`);
      return null;
    }

    const $ = cheerio.load(response.data);

    let imageHref = "",
      stopColors = [],
      sources = [];

    const imageElement = $("image");
    if (imageElement.length) {
      imageHref = imageElement.attr("href") || imageElement.attr("src") || "";
    }
    const patternColorFilter = $("#giftGradienPatternColor");
    const color = patternColorFilter.attr("flood-color");
    console.log("PATTERN COLOR:", color);

    $("stop").each((_, stop) => {
      const color = $(stop).attr("stop-color");
      if (color) stopColors.push(color);
    });

    $("source").each((_, source) => {
      const srcset = $(source).attr("srcset");
      if (srcset) sources.push(srcset);
    });

    $("tr").each((_, row) => {
      const th = $(row).find("th").text().trim();
      const td = $(row).find("td").clone();
      const mark = td.find("mark").text().trim();
      td.find("mark").remove();
      const value = td.text().trim();

      if (th === "Backdrop") {
        backdropValue = value;
        backdropRarity = mark;
      } else if (th === "Model") {
        modelValue = value;
        modelRarity = mark;
      } else if (th === "Symbol") {
        symbolValue = value;
        symbolRarity = mark;
      }
    });
    console.log(sources[0]);

    return {
      firstColor: stopColors[0] || "#000000",
      secondColor: stopColors[1] || "#FFFFFF",
      patternColorFilter: color,
      animationUrl: sources[0] || "",
      preImage: sources[1] || "",
      patternUrl: imageHref,
    };
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
    return null;
  }
}

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const extractNameFromUrl = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1]; // Возьмёт последний сегмент
};
app.post("/generate", async (req, res) => {
  const { url } = req.body;

  try {
    const data = await singleStart(url);
    const lottieJson = await loadTGSFromURL(data.animationUrl);
    const name = extractNameFromUrl(url);
    const fileUrl = await renderToWebm(lottieJson, {
      firstColor: data.firstColor,
      secondColor: data.secondColor,
      patternUrl: data.patternUrl,
      patternColorFilter: data.color,
      filename: name,
    });

    res.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("❌ Ошибка генерации:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========== 4. START ==========
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const gifts = [
  // "https://t.me/nft/PlushPepe-384",
  // "https://t.me/nft/CandyCane-13442",
  // "https://t.me/nft/DurovsCap-2862",
  // "https://t.me/nft/PreciousPeach-929",
  // "https://t.me/nft/DiamondRing-28483",
  // "https://t.me/nft/LovePotion-16396",
  // "https://t.me/nft/ToyBear-6300",
  // "https://t.me/nft/LootBag-9507",
  // "https://t.me/nft/JingleBells-8421",
  // "https://t.me/nft/LunarSnake-8709",
  // "https://t.me/nft/LolPop-206660",
  // "https://t.me/nft/GingerCookie-58353",
  "https://t.me/nft/CookieHeart-62004",
  // "https://t.me/nft/CrystalBall-15888",
  // "https://t.me/nft/HypnoLollipop-9814",
  // "https://t.me/nft/GingerCookie-73463",
  // "https://t.me/nft/TamaGadget-10581",
];
const extractNameFromUrl1 = (url) => {
  // Извлекаем часть после последнего слэша и возвращаем как имя
  const match = url.split("/").pop();
  return match || "";
};

async function generateGifts() {
  for (let index = 0; index < gifts.length; index++) {
    try {
      const url = gifts[index]; // текущий URL
      const data = await singleStart(url); // Получаем данные из singleStart
      const lottieJson = await loadTGSFromURL(data.animationUrl); // Загружаем Lottie JSON
      const name = extractNameFromUrl1(url); // Извлекаем имя из URL
      const fileUrl = await renderToWebm(lottieJson, {
        firstColor: data.firstColor,
        secondColor: data.secondColor,
        patternColorFilter: data.patternColorFilter,
        patternUrl: data.patternUrl,
        filename: name,
      });
      console.log(`Видео для ${name} доступно по ссылке: ${fileUrl}`);
    } catch (err) {
      console.error("❌ Ошибка генерации:", err);
    }
  }
}

// Запускаем генерацию
generateGifts();
