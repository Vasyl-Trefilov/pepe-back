const dotenv = require("dotenv");
const { Telegraf } = require("telegraf");
const { v4: uuidv4 } = require("uuid");
dotenv.config();
// const bot = new Telegraf(process.env.BOT_TOKEN);
const bot = new Telegraf("7414641138:AAE97Pk05VhT2qD-uGZ4ZsdKWQTS6GSkGkk");
const WEBAPP_URL = process.env.WEBAPP_URL;

const cheerio = require("cheerio"); // Импортируем cheerio для парсинга HTML
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { db } = require("./firebaseConfig");
const {
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  collection,
  addDoc,
  writeBatch,
} = require("firebase/firestore");

const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");

const apiId = 26232115;
const apiHash = "ca1913add4b5275cac3c1e28fd59278c";
const session = new StringSession(
  "1AgAOMTQ5LjE1NC4xNjcuNDEBuyPdOSTE+2tz+6EiVY8KlFd1ba2XoHwwDduwbN+qWx4QLDKv1sx8zUwAZMmw4FIY28eLrCGly09aQsWOP75pIPdy/x3yNLsZ5NnwuKapTabElYcQuuMc1Q/zjzJkMvk8dsRRuSfic42jUSz3Mdi2MzGPq/H5/TihQrAy6//YhTn5fxdigM53uiTHvdm/j2pXf6uCY2QVhJc0ZYRw7FjyTdVVv2ePMw5Y2oDFzRWz8V5mXPFIAIH0w4M/IRiZvwYP14PjhJYfnOGStQH/UNYhg+4j+mtgjcbKIGQwfwtGp1PeXywqBpdL6e2Rvm/LDAskOKOfvg5lAmxB+bHsNY17bLM="
);

const client = new TelegramClient(session, apiId, apiHash, {});

(async function run() {
  await client.connect();
  console.log("Подключено к Telegram!");

  async function checkIfGift(msg, normalNumberId) {
    try {
      const action = msg.message.action;
      processGiftDetails(action, normalNumberId);
    } catch (err) {
      console.error("Ошибка при получении сообщения:", err);
    }
  }
  async function processGiftDetails(action, normalNumberId) {
    const gift = action.originalArgs.gift;
    const giftSlug = gift.slug;
    const userRef = doc(firestore, "users", String(normalNumberId));
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const inventoryRef = doc(
        firestore,
        "users",
        String(normalNumberId),
        "inventory",
        giftSlug
      );
      await setDoc(inventoryRef, {
        giftLink: `https://t.me/nft/${giftSlug}`, // Ссылка на подарок
        addedAt: new Date(), // Время добавления подарка
      });
    } else {
    }
  }

  client.addEventHandler(async (update) => {
    if (!update.message?.action) {
    } else {
      await checkIfGift(update, 2074206759);
    }
  });
})();
bot.start((ctx) => {
  ctx.reply(
    `👋 Привет, ${ctx.from.first_name}!\nЭтот бот позволяет управлять Телеграм по.\n\nИспользуй /webapp, чтобы открыть биржу.`
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
    const data = await start(gifts);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});
async function loadPLimit() {
  const { default: pLimit } = await import("p-limit");
  return pLimit;
}

async function start(items) {
  const pLimit = await loadPLimit();
  const limit = pLimit(50); // Ограничение на 10 запросов одновременно

  console.log("pLimit загружен успешно!");

  // Передаём limit в getData()
  const data = await getData(limit, items);
  return data;
}
async function singleStart(item) {
  const pLimit = await loadPLimit();
  const limit = pLimit(5); // Ограничение на 10 запросов одновременно

  console.log("pLimit загружен успешно!");

  // Передаём limit в getData()
  const data = await getSingleData(limit, item);
  return data;
}

async function getSingleData(limit, giftObj) {
  if (!limit) {
    throw new Error("limit не передан в getSingleData()");
  }

  try {
    const resGift = await fetchSingleGiftData(giftObj);
    console.log(resGift);

    return resGift;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function fetchSingleGiftData(item) {
  const url = item.slug;
  try {
    console.log(`parsing ${item.slug}`);

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

    $("stop").each((_, stop) => {
      const color = $(stop).attr("stop-color");
      if (color) stopColors.push(color);
    });

    $("source").each((_, source) => {
      const srcset = $(source).attr("srcset");
      if (srcset) sources.push(srcset);
    });

    return {
      id: item.telegramId,
      slug: item.slug,
      price: item.price,
      listerRating: item.sellerRating || 0,
      sellerUsername: item.sellerUsername || "Unknown",
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
];

async function fetchGiftData(item) {
  const url = item.slug;
  try {
    console.log(`parsing ${item.slug}`);

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
    console.log(item.sellerRating);

    return {
      id: item.id,
      listerRating: item.sellerRating,
      sellerUsername: item.sellerUsername,
      slug: item.slug,
      price: item.price,
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

async function getData(limit, urls) {
  if (!limit) {
    throw new Error("limit не передан в getData()");
  }

  try {
    const requests = urls.map((item) => {
      return limit(() => fetchGiftData(item));
    });
    const resGifts = (await Promise.all(requests)).filter(Boolean);
    return resGifts;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// СОЗДАНИЕ ЮЗЕРА ИЛИ ИЗМЕНЕНИЕ
app.post("/users/:userId", async (req, res) => {
  try {
    // Ссылаемся на коллекцию пользователей
    const userRef = db.collection("users").doc(req.params.userId);
    const userDoc = await userRef.get(); // Используем admin.firestore() вместо getDoc

    if (!userDoc.exists) {
      // Если пользователя нет, создаём нового пользователя и пустой инвентарь
      await userRef.set({
        username: req.body.username,
        balanceTon: 0,
        balanceRub: 0,
        balanceUsdt: 0,
      });

      // Создаём пустой инвентарь для этого пользователя
      const inventoryRef = db
        .collection("users")
        .doc(req.params.userId)
        .collection("inventory")
        .doc("empty");
      await inventoryRef.set({});

      res.status(200).send("Пользователь создан с пустым инвентарём.");
    } else {
      // Если пользователь уже существует, обновляем или возвращаем существующие данные
      res.status(200).send("Пользователь уже существует.");
    }
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    res.status(500).send("Ошибка сервера.");
  }
});

// ПОКУПКА
app.post(
  "/users/:buyerId/buy/:sellerId/inventory/:giftId",
  async (req, res) => {
    const { buyerId, sellerId, giftId } = req.params;
    const { price } = req.body; // Цена подарка

    try {
      const buyerRef = db.collection("users").doc(buyerId);
      const sellerRef = db.collection("users").doc(sellerId);
      const giftRef = db
        .collection("users")
        .doc(sellerId)
        .collection("inventory")
        .doc(giftId);

      // Получаем информацию о покупателе, продавце и подарке
      const buyerSnap = await buyerRef.get();
      const sellerSnap = await sellerRef.get();
      const giftSnap = await giftRef.get();

      if (!buyerSnap.exists) {
        return res.status(404).send("Покупатель не найден");
      }
      if (!sellerSnap.exists) {
        return res.status(404).send("Продавец не найден");
      }
      if (!giftSnap.exists) {
        return res.status(404).send("Подарок не найден");
      }

      const buyerData = buyerSnap.data();
      const sellerData = sellerSnap.data();

      // Проверяем, достаточно ли средств у покупателя
      if (buyerData.balanceTon < price) {
        return res.status(400).send("Недостаточно средств для покупки подарка");
      }

      // Начинаем транзакцию: покупка подарка
      const batch = db.batch();

      // Обновляем баланс покупателя
      batch.update(buyerRef, {
        balanceTon: buyerData.balanceTon - price,
      });

      // Добавляем подарок в инвентарь покупателя
      const buyerInventoryRef = db
        .collection("users")
        .doc(buyerId)
        .collection("inventory")
        .doc(giftId);

      batch.set(buyerInventoryRef, giftSnap.data());

      // Удаляем подарок из инвентаря продавца
      batch.delete(giftRef);

      // Выполняем транзакцию
      await batch.commit();

      res.json({
        message: "Подарок успешно передан. Баланс покупателя обновлен.",
      });
    } catch (error) {
      console.error("Ошибка при выполнении транзакции покупки:", error);
      res.status(500).send("Ошибка сервера.");
    }
  }
);

//ПОЛУЧИТЬ ОДИН ПОДАРОК
app.get("/gifts/:giftId", async (req, res) => {
  try {
    const snapshot = await db.collectionGroup("inventory").get();

    const match = snapshot.docs.find((doc) => doc.id === req.params.giftId);

    if (match) {
      console.log(match.data());

      const data = await singleStart(match.data());

      console.log(data);

      res.status(200).json({ data });
    } else {
      res.status(404).send("Подарок не найден");
    }
  } catch (error) {
    console.error("Ошибка при поиске подарка:", error);
    res.status(500).send("Ошибка сервера");
  }
});

app.get("/debug/all-gifts", async (req, res) => {
  try {
    const snapshot = await db.collectionGroup("inventory").get();

    if (snapshot.empty) {
      return res.status(200).json({ message: "Нет подарков в базе" });
    }

    const gifts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(gifts);
  } catch (error) {
    console.error("Ошибка при получении всех подарков:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ПОЛУЧИТЬ ЮЗЕРА
app.get("/users/:userId", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.userId);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      res.json(userSnap.data());
    } else {
      res.status(404).send("Пользователь не найден");
    }
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res.status(500).send("Ошибка сервера");
  }
});

// 🎁 Добавить подарок в инвентарь
app.post("/users/:userId/inventory", async (req, res) => {
  try {
    const invCollectionRef = collection(
      firestore,
      "users",
      req.params.userId,
      "inventory"
    );

    // Генерация уникального ID для подарка
    const giftId = uuidv4();

    // Сохраняем документ с уникальным ID
    const docRef = await setDoc(doc(invCollectionRef, giftId), {
      slug: req.body.slug,
      ownedAt: new Date(),
      listed: false, // Пока подарок не выставлен
      listingId: null,
      telegramId: req.params.userId, // Ссылаемся на владельца
    });

    res.status(200).json({
      message: "Gift added to inventory",
      giftId: giftId, // Отправляем сгенерированный уникальный ID обратно клиенту
    });
  } catch (error) {
    console.error("Ошибка при добавлении подарка:", error);
    res.status(500).send("Ошибка сервера");
  }
});

// ВЕСЬ ИНВЕНТАРЬ
app.get("/users/:userId/inventory", async (req, res) => {
  try {
    const invCollectionRef = db
      .collection("users")
      .doc(req.params.userId)
      .collection("inventory");

    // Получаем все документы в инвентаре пользователя
    const snapshot = await invCollectionRef.get();

    const inventory = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("inv:", inventory);

    // Если необходимо сделать обработку или преобразование данных (например, через start), делаем это
    const data = await start(inventory);
    console.log("Data", data);

    res.status(200).json(data);
  } catch (error) {
    console.error("Ошибка при получении инвентаря:", error);
    res.status(500).send("Ошибка сервера");
  }
});
// ПОЛУЧИТЬ ОДИН ПОДАРОК
app.get("/users/:userId/inventory/:giftId", async (req, res) => {
  try {
    // Ссылаемся на коллекцию inventory для конкретного пользователя
    const docRef = db
      .collection("users")
      .doc(req.params.userId)
      .collection("inventory")
      .doc(req.params.giftId);

    const docSnap = await docRef.get();

    if (docSnap.exists) {
      console.log("SNAAAP: ", docSnap.data());

      const gifts = [docSnap.data()];
      gifts[0].id = req.params.giftId;

      console.log("gifts: ", gifts);

      const data = await start(gifts);

      console.log("Dada", data);

      res.status(200).json({
        message: "Gift found",
        gift: data,
      });
    } else {
      res.status(404).json({
        message: "Gift not found",
      });
    }
  } catch (error) {
    console.error("Ошибка при получении подарка:", error);
    res.status(500).send("Ошибка при получении подарка");
  }
});

app.get("/test", (req, res) => {
  res.json({ message: "test passed" });
});

// ПОЛУЧИТЬ ВСЕ LISTED
app.get("/marketplace/listed-gifts", async (req, res) => {
  try {
    const snapshot = await db
      .collectionGroup("inventory")
      .where("listed", "==", true)
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const giftsWithSellerData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const giftData = doc.data();
        const sellerId = giftData.telegramId;

        // Получаем данные о продавце
        const sellerRef = db.collection("users").doc(sellerId);
        const sellerSnap = await sellerRef.get();

        const sellerData = sellerSnap.exists ? sellerSnap.data() : {};

        return {
          id: doc.id,
          ...giftData,
          sellerRating: sellerData.rating || null,
          sellerUsername: sellerData.username || "Unknown",
        };
      })
    );
    const data = await start(giftsWithSellerData);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching listed gifts:", error);
    res.status(500).send("Error fetching listed gifts");
  }
});

// ВЫСТАВЛЕНИЕ ПОДАРКОВ НА БИРЖУ
app.patch("/users/:userId/inventory/:giftId/list", async (req, res) => {
  try {
    const invDocRef = doc(
      firestore,
      "users",
      req.params.userId,
      "inventory",
      req.params.giftId
    );

    const listingId = `${req.params.userId}_${req.params.giftId}`;

    // Обновляем информацию о подарке в инвентаре
    await updateDoc(invDocRef, {
      listed: true,
      listingId,
    });

    // Добавляем информацию о листинге в коллекцию listings
    const listingRef = doc(firestore, "listings", listingId);
    await setDoc(listingRef, {
      slug: req.body.slug,
      sellerId: req.params.userId,
      giftId: req.params.giftId,
      listedAt: serverTimestamp(),
      price: req.body.price || 0,
    });

    res.status(200).send("Gift listed for sale");
  } catch (error) {
    console.error("Ошибка при листинге:", error);
    res.status(500).send("Ошибка сервера");
  }
});

// СНЯТЬ С ПРОДАЖИ
app.patch("/users/:userId/inventory/:giftId/unlist", async (req, res) => {
  try {
    const invDocRef = db
      .collection("users")
      .doc(req.params.userId)
      .collection("inventory")
      .doc(req.params.giftId);

    // Обновляем статус "listed" на false и очищаем listingId
    await invDocRef.update({
      listed: false,
      listingId: null,
    });

    const listingId = `${req.params.userId}_${req.params.giftId}`;
    await db.collection("listings").doc(listingId).delete();

    res.status(200).send("Gift unlisted and removed from marketplace");
  } catch (error) {
    console.error("Ошибка при снятии лота:", error);
    res.status(500).send("Ошибка сервера");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
