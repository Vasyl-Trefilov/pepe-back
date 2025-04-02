import dotenv from "dotenv";
import { Telegraf } from "telegraf";
dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const WEBAPP_URL = process.env.WEBAPP_URL;

//node.js
import express from "express";
import cors from "cors";
import { doc, getDoc, setDoc, getDocs, updateDoc } from "firebase/firestore";
import { firestore } from "./firebaseConfig.js";

bot.start((ctx) => {
  ctx.reply(
    `👋 Привет, ${ctx.from.first_name}!\nЭтот бот позволяет управлять NFT.\n\nИспользуй /webapp, чтобы открыть биржу.`
  );
});

bot.command("webapp", (ctx) => {
  const userId = ctx.from.id.toString();
  const encodedUserId = Buffer.from(userId).toString("base64");

  console.log("User ID:", userId);
  console.log("Encoded ID:", encodedUserId);

  ctx.reply("🚀 Открывай биржу NFT!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🔗 Открыть Web App",
            web_app: { url: `${WEBAPP_URL}?startapp=${encodedUserId}` },
          },
        ],
      ],
    },
  });
});

bot.on("text", (ctx) => {
  ctx.reply("Неизвестная команда. Используй /webapp, чтобы открыть биржу NFT.");
});

bot.launch();
console.log("✅ Бот запущен!");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

const app = express();
app.use(express.json());
app.use(cors());


app.post("/getGift", async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const gifts = [
  "https://t.me/nft/PlushPepe-384",
  "https://t.me/nft/CandyCane-13442",
  "https://t.me/nft/DurovsCap-2862",
  "https://t.me/nft/PreciousPeach-929",
  "https://t.me/nft/DiamondRing-28483",
  "https://t.me/nft/LovePotion-16396",
  "https://t.me/nft/ToyBear-6300",
  "https://t.me/nft/LootBag-9507",
  "https://t.me/nft/JingleBells-8421",
  "https://t.me/nft/LunarSnake-8709",
  "https://t.me/nft/LolPop-206660",
  "https://t.me/nft/GingerCookie-58353",
  "https://t.me/nft/CookieHeart-62004",
  "https://t.me/nft/CrystalBall-15888",
  "https://t.me/nft/HypnoLollipop-9814",
  "https://t.me/nft/GingerCookie-73463",
  "https://t.me/nft/TamaGadget-10581",
];

const resGifts = [];

async function getData() {
  try {
    const resGifts = [];

    for (const url of gifts) {
      console.log(`Fetching: ${url}`);

      const response = await axios.get(url);
      if (response.status !== 200) {
        console.error(`Error fetching ${url}: Status ${response.status}`);
        continue;
      }

      const $ = cheerio.load(response.data);

      let imageHref = "",
        stopColors = [],
        sources = [];

      // Парсим картинку (если есть)
      const imageElement = $("image");
      if (imageElement.length) {
        imageHref = imageElement.attr("href") || imageElement.attr("src") || "";
      }

      // Парсим stop-color (если есть)
      $("stop").each((_, stop) => {
        const color = $(stop).attr("stop-color");
        if (color) stopColors.push(color);
      });

      // Парсим source (если есть)
      $("source").each((_, source) => {
        const srcset = $(source).attr("srcset");
        if (srcset) sources.push(srcset);
      });

      // Добавляем данные в массив
      resGifts.push({
        firstColor: stopColors[0] || "#000000", // Фолбэк цвет
        secondColor: stopColors[1] || "#FFFFFF",
        animationUrl: sources[0] || "",
        patternUrl: imageHref,
      });
    }

    return resGifts;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

app.post("/login", async (req, res) => {
  try {
    const { userId, username, firstName, lastName, photoUrl } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userRef = doc(firestore, "users", String(userId));

    const docSnapshot = await getDoc(userRef);
    console.log(
      "Firestore document snapshot:",
      docSnapshot.exists() ? docSnapshot.data() : "Not found"
    );

    let userData;
    if (docSnapshot.exists()) {
      userData = docSnapshot.data();
    } else {
      userData = {
        telegramId: String(userId),
        username: String(username || "Unknown"),
        first_name: String(firstName || "Unknown"),
        last_name: String(lastName || "Unknown"),
        photo_url: String(photoUrl || ""),
        inventory: [],
        balance: 0,
        createdAt: new Date(),
      };

      console.log("Saving new user to Firestore:", userData);
      await setDoc(userRef, userData);
    }

    console.log("Returning user data:", userData);
    res.status(200).json(userData);
  } catch (error) {
    console.error("🔥 Error handling user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/getAllPepe", async (req, res) => {
  try {
    const nftRef = doc(firestore, "nfts");
    const nftSnap = await getDocs(nftRef);
  } catch (error) {
    console.log(error);
    res.json(error).status(500);
  }
});

app.post("/userNft", async (req, res) => {
  const userId = req.body();
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const nftIds = userData.inventory || [];

      const nftPromises = nftIds.map(async (nftId) => {
        const nftRef = doc(firestore, "nfts", nftId);
        const nftSnap = await getDoc(nftRef);
        return nftSnap.exists() ? nftSnap.data() : null;
      });

      const nfts = await Promise.all(nftPromises);
      res.json(nfts.filter((nft) => nft !== null));
    } else {
      console.log("user is not exist");

      res.json({ error: "user is not exist" }).status(200);
    }
  } catch (error) {
    console.log(error);
    res.json(error).status(500);
  }
});

app.post("/updateBalance", async (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || amount === undefined) {
    return res.status(400).json({ error: "UserId and amount are required" });
  }
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentBalance = parseInt(userData.balance, 10) || 0;
      const newBalance = currentBalance + parseInt(amount, 10);

      await updateDoc(userRef, { balance: newBalance });

      console.log(`✅ Баланс обновлен: ${newBalance} TON`);
      res.status(200).json({ success: true, newBalance });
    } else {
      console.log("❌ Пользователь не найден");
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Ошибка обновления баланса:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/test", (req, res) => {
  res.json({ message: "test passed" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
