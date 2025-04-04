const dotenv = require("dotenv");
const { Telegraf } = require("telegraf");
dotenv.config();
// const bot = new Telegraf(process.env.BOT_TOKEN);
const bot = new Telegraf("7414641138:AAE97Pk05VhT2qD-uGZ4ZsdKWQTS6GSkGkk");
const WEBAPP_URL = process.env.WEBAPP_URL;

const cheerio = require("cheerio"); // Импортируем cheerio для парсинга HTML
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// const {
//   doc,
//   getDoc,
//   setDoc,
//   getDocs,
//   updateDoc,
// } = require("firebase/firestore");
// const { firestore } = require("./firebaseConfig.js");

const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");

// Твои api_id и api_hash
const apiId = 26232115;
const apiHash = "ca1913add4b5275cac3c1e28fd59278c";
const session = new StringSession(
  "1AgAOMTQ5LjE1NC4xNjcuNDEBu7TheBijmG7eCWasNshGGPgbicg/6PGCD4dpPzHcEv5biKiGtaUiQW84gOzbIic8v3LTK5juWf9dnfArOisuSfnEvC+T/qzDEyETpICDDeHZagQRStmZmRKLAur0/YGYtmMseGLduypJ93iDsrJDcu0bRWzZeW6EqfwOWXJCPSDmOVs4phSvrVuH70QwOgwLvZBmQQi1ABReU3iibqhE5KUl4ubzcWC0/yQ/JtYkK0rTFoFL9E1izDGi4kXhAFJqh1jCtS0hMgmpUJkFRhvQgIKl/Ya0R7LHnQZtC9mWuLbcphyYQeB7ND70QUqThyY8pUnM9x5Xc2qotCgjUmVzQIo="
);

const client = new TelegramClient(session, apiId, apiHash, {});

async function getUserDisplayName(client, userId) {
  try {
    const user = await client.getEntity(userId);
    if (user.username) return `@${user.username}`;
    if (user.firstName || user.lastName)
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    return `id${user.id}`;
  } catch (err) {
    console.error("Ошибка при получении пользователя:", err);
    return `id${userId}`;
  }
}

async function handleGiftRequest(msg, sender) {
  try {
    console.log("Запрос на подарки от пользователя", sender.id);

    const result = await client.invoke(
      new Api.payments.GetSavedStarGifts({
        peer: new Api.PeerUser({ userId: sender.id }),
        limit: 100,
        offset: "",
      })
    );

    if (result && result.gifts && result.gifts.length > 0) {
      console.log("Найдено подарков:", result.gifts.length);

      for (const gift of result.gifts) {
        // Проверка на корректность данных
        if (!gift || !gift.gift) continue;

        let senderName = "Аноним";
        if (gift.fromId?.userId?.value && !gift.nameHidden) {
          senderName = await getUserDisplayName(
            client,
            gift.fromId.userId.value
          );
        }

        const giftTitle = gift.gift.title || "Без названия";
        const stars =
          gift.gift.stars?.value || gift.gift.convertStars?.value || 0;
        const date = new Date(gift.date * 1000).toLocaleString("ru-RU");
        const message = gift.message?.text || "";

        // Логируем данные подарка
        console.log(`Подарок: ${giftTitle}`);
        console.log(`От: ${senderName}`);
        console.log(`Звёзд: ${stars}`);
        console.log(`Дата: ${date}`);
        console.log(`Сообщение: ${message}`);

        const chatId = sender.id;

        // Отправляем сообщение
        await client.sendMessage(chatId, {
          message: `
🎁 Подарок: ${giftTitle}
👤 От: ${senderName}
💫 Звёзд: ${stars}
${message ? `💬 Сообщение: ${message}` : ""}
📅 Дата: ${date}
          `,
        });
      }
    } else {
      console.log("У пользователя нет подарков.");
      await client.sendMessage(sender.id, {
        message: "У вас нет подарков!",
      });
    }
  } catch (err) {
    console.error("Ошибка при получении подарков:", err);
    await client.sendMessage(sender.id, {
      message:
        "Произошла ошибка при получении ваших подарков. Попробуйте позже.",
    });
  }
}

(async function run() {
  await client.connect();
  console.log("Подключено к Telegram!");

  client.addEventHandler(async (event) => {
    const msg = event.message;

    if (msg.message) {
      const sender = await msg.getSender();

      if (msg.message === "Мои подарки") {
        await handleGiftRequest(msg, sender);
      } else {
        console.log("Получено неизвестное сообщение:", msg.message);
      }
    } else {
      console.log("Сообщение не содержит текста или пустое.");
    }
  }, new NewMessage({ incoming: true }));
})();
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
    const data = await start();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
async function loadPLimit() {
  const { default: pLimit } = await import("p-limit");
  return pLimit;
}

async function start() {
  const pLimit = await loadPLimit();
  const limit = pLimit(50); // Ограничение на 10 запросов одновременно

  console.log("pLimit загружен успешно!");

  // Передаём limit в getData()
  const data = await getData(limit);
  return data;
}

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

async function fetchGiftData(url) {
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      console.error(`Error fetching ${url}: Status ${response.status}`);
      return null;
    }

    const $ = cheerio.load(response.data);

    let imageHref = "",
      stopColors = [],
      sources = [];

    // Парсим картинку
    const imageElement = $("image");
    if (imageElement.length) {
      imageHref = imageElement.attr("href") || imageElement.attr("src") || "";
    }

    // Парсим stop-color
    $("stop").each((_, stop) => {
      const color = $(stop).attr("stop-color");
      if (color) stopColors.push(color);
    });

    // Парсим source
    $("source").each((_, source) => {
      const srcset = $(source).attr("srcset");
      if (srcset) sources.push(srcset);
    });

    return {
      firstColor: stopColors[0] || "#000000",
      secondColor: stopColors[1] || "#FFFFFF",
      animationUrl: sources[0] || "",
      preImage: sources[1] || "",
      patternUrl: imageHref,
    };
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
    return null;
  }
}

async function getData(limit) {
  if (!limit) {
    throw new Error("limit не передан в getData()");
  }

  try {
    const requests = gifts.map((url) => limit(() => fetchGiftData(url))); // Используем переданный limit
    const resGifts = (await Promise.all(requests)).filter(Boolean);
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
