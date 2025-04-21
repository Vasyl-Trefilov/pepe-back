const fs = require("fs");
const { default: fetch } = require("node-fetch");
const pako = require("pako");

async function unpackTGS(arrayBuffer) {
  const uncompressed = pako.inflate(new Uint8Array(arrayBuffer), {
    to: "string",
  });
  return JSON.parse(uncompressed);
}

async function generateHTML(tgsUrl, options) {
  const res = await fetch(tgsUrl);
  const buffer = await res.arrayBuffer();
  const lottieJson = await unpackTGS(buffer);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: #fff; overflow: hidden; }
    #gift-card-container {
      width: 850px;
      height: 850px;
      position: relative;
      border-radius: 80px;
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
      width: 850px;
      height: 850px;
      z-index: 0;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
</head>
<body>
  <div id="gift-card-container">
    <svg viewBox="0 0 425 425">
      <defs>
        <radialGradient id="giftGradient" cx="50%" cy="50%" r="69.65%">
          <stop stop-color="${options.firstColor}" offset="0%" />
          <stop stop-color="${options.secondColor}" offset="100%" />
        </radialGradient>
        <filter id="patternColorFilter">
          <feFlood flood-color="#2828bc" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <image id="giftPattern" width="160" height="160" href="${
          options.patternUrl
        }" />
      </defs>
      <rect width="100%" height="100%" fill="url(#giftGradient)" />
      <use xlink:href="#giftPattern" filter="url(#patternColorFilter)" />
    </svg>

    <div id="lottie-animation"></div>
  </div>

  <script>
    const anim = lottie.loadAnimation({
      container: document.getElementById('lottie-animation'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: ${JSON.stringify(lottieJson)}
    });
  </script>
</body>
</html>
`;

  fs.writeFileSync("preview.html", html);
  console.log("✅ Готово! Открой preview.html в браузере");
}

generateHTML(
  "https://cdn4.cdn-telegram.org/file/sticker.tgs?token=gyQgfASz0p-1g5_ag9-E9D8AW70UHHPJDgYpsHtPsZWhRCxUohDYIRSDjJiE9mWg_h2UdrNtPvduOk5rgsNersY8Bi88m8ef4Eo8KM00-HlvqV02kkP9nPrLSW9gbIhA_cUefdUJ-dVZwQ4gRkx6xG1Mf7ARwwINqNxqt6g6jyQGyXqHSeFYrX108w9h8XFPKHADExMJHQFJqJZxU947v3ASRjpHbLBnuy_uotPNFww0tD1usxqNSvisTfevDrnTVqMxpr7Ch4zdjjO9H7tI7HdpNNFF_m2036TFOLfaDb_k7tLc1NZUiU-XKCxVUhxWPzt6koYjiq7RzLWtEUYSGw", // ← заменишь сюда
  {
    firstColor: "#FF0000",
    secondColor: "#00FF00",
    patternUrl:
      "https://cdn4.cdn-telegram.org/file/Agr0xtVEuscuEt5akv8V_eLrWPPv6Vst10S0CaDBcQCt6RwfyEXUlbZrPSs3rMHpXRLLlcni6IikeVB7Cb1Vh4Lbdh3ugxTvprLl60Tp-cFB4-Cl4XmAGGGNfzektCPZO_j4XrTKiYcfpqISGyMyjky3kQL9se1dvj7KCmtGH-EzmuKXUQkxAPR0sb0Jz91a2lcSqv7bZryUIGKcD2CGFLMo0FiOhWGVoC7UdPPdezrRSHWM5rVyPec2JsD-s0t_mJsK2HRp2cuX60VA-RSZpPXqymNfZJUxgs1Ib98NaUPf85xJTJYIzca2DOjS543mB_8YVRF9r0loE4Odob1ybA",
  }
);
