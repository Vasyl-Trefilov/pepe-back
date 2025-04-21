const dotenv = require("dotenv");
const { Telegraf } = require("telegraf");
const { v4: uuidv4 } = require("uuid");

const moment = require("moment");

dotenv.config();
// const bot = new Telegraf(process.env.BOT_TOKEN);
const bot = new Telegraf("7414641138:AAE97Pk05VhT2qD-uGZ4ZsdKWQTS6GSkGkk"); // НЕ ЗАБЫТЬ ПОМЕНЯТЬ
const WEBAPP_URL = process.env.WEBAPP_URL;

const cheerio = require("cheerio"); // Импортируем cheerio для парсинга HTML
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { db, admin } = require("./firebaseConfig");
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
// bot.start((ctx) => {
//   ctx.reply(
//     `👋 Привет, ${ctx.from.first_name}!\nЭтот бот позволяет управлять Телеграм по.\n\nИспользуй /webapp, чтобы открыть биржу.`
//   );
// });

// bot.command("webapp", (ctx) => {
//   const userId = ctx.from.username.toString();
//   const encodedUserId = Buffer.from(userId).toString("base64");

//   console.log("User ID:", userId);

//   ctx.reply("🚀 Открывай биржу NFT!", {
//     reply_markup: {
//       inline_keyboard: [
//         [
//           {
//             text: "🔗 Открыть Web App",
//             web_app: { url: `${WEBAPP_URL}?startapp=${encodedUserId}` },
//           },
//         ],
//       ],
//     },
//   });
// });

// bot.on("text", (ctx) => {
//   ctx.reply("Неизвестная команда. Используй /webapp, чтобы открыть биржу NFT.");
// });

// bot.launch();
// console.log("✅ Бот запущен!");

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));

const app = express();
app.use(express.json());
app.use(cors());

app.post("/login", async (req, res) => {
  const { telegramId } = req.body;

  try {
    const userRef = db.collection("users").doc(telegramId.toString()); // гарантируем строковый ID
    const doc = await userRef.get();

    if (!doc.exists) {
      const newUser = {
        telegramId,
        username: `user_${Math.floor(Math.random() * 1000000)}`,
        balanceRub: 0,
        balanceTon: 0,
        balanceUsdt: 0,
        rating: 0,
        joinedAt: new Date(),
      };

      await userRef.set(newUser);
      console.log("Создан новый пользователь:", newUser);
      res.status(201).json({ id: telegramId, ...newUser });
    } else {
      const user = doc.data();
      console.log("Найден пользователь:", user);
      res.status(200).json(user);
    }
  } catch (error) {
    console.error("Ошибка при получении/создании user:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

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

  // Передаём limit в getData()
  const data = await getData(limit, items);
  return data;
}
async function singleStart(item) {
  const pLimit = await loadPLimit();
  const limit = pLimit(5); // Ограничение на 10 запросов одновременно

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
    let backdropValue = "",
      backdropRarity = "",
      modelValue = "",
      modelRarity = "",
      symbolValue = "",
      symbolRarity = "";

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

    return {
      id: item.telegramId,
      slug: item.slug,
      value: item.value,
      price: item.price,
      listed: item.listed,
      listerRating: item.sellerRating || 0,
      sellerUsername: item.sellerUsername || "Unknown",
      firstColor: stopColors[0] || "#000000",
      secondColor: stopColors[1] || "#FFFFFF",
      animationUrl: sources[0] || "",
      preImage: sources[1] || "",
      patternUrl: imageHref,
      backdropValue,
      backdropRarity,
      modelValue,
      modelRarity,
      symbolValue,
      symbolRarity,
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
    console.log(item);

    return {
      id: item.id ? item.id : undefined,
      giftId: item.giftId,
      listerRating: item.sellerRating,
      sellerUsername: item.sellerUsername,
      value: item.id,
      listed: item.listed,
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
    //soldAt
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
      const giftData = giftSnap.data();
      if (!giftData.listed) {
        return res.status(400).send("Этот подарок уже продан");
      }
      // Проверяем, достаточно ли средств у покупателя
      if (buyerData.balanceRub < price) {
        return res.status(400).send("Недостаточно средств для покупки подарка");
      }

      // Начинаем транзакцию: покупка подарка
      const batch = db.batch();

      // Обновляем баланс покупателя
      batch.update(buyerRef, {
        balanceRub: buyerData.balanceRub - price,
      });
      // Обновляем баланс продавца
      batch.update(sellerRef, {
        balanceRub: sellerData.balanceRub + price * 0.97,
      });

      // Добавляем подарок в инвентарь покупателя
      const buyerInventoryRef = db
        .collection("users")
        .doc(buyerId)
        .collection("inventory")
        .doc(giftId);

      batch.set(buyerInventoryRef, {
        ...giftSnap.data(),
        listed: false,
        telegramId: buyerData.telegramId,
        listingId: null,
      });

      // // Обновляем статус listed на false
      batch.update(giftRef, {
        listed: false,
      });

      // Выполняем транзакцию
      await batch.commit();

      // Удаляем подарок из инвентаря продавца после успешной транзакции
      await giftRef.delete();

      // Удаляем из listings (если был добавлен listingId в документ)
      if (giftData.listingId) {
        await db.collection("listings").doc(giftData.listingId).delete();
      }

      // Добавляем в историю продаж
      await db.collection("sales-history").add({
        telegramId: giftSnap.data().telegramId,
        slug: giftSnap.data().slug,
        price,
        soldAt: admin.firestore.Timestamp.now(),
        sellerId,
        buyerId,
      });
      await db
        .collection("users")
        .doc(buyerId)
        .collection("purchase-history")
        .add({
          giftId,
          slug: giftData.slug,
          price,
          value: giftData.value || "Rub",
          sellerId,
          purchasedAt: admin.firestore.Timestamp.now(),
        });
      await db
        .collection("users")
        .doc(sellerId)
        .collection("sales-history")
        .add({
          giftId,
          slug: giftData.slug,
          price,
          value: giftData.value || "Rub",
          buyerId,
          soldAt: admin.firestore.Timestamp.now(),
        });
      console.log("Selled..");

      res.json({
        message: "Подарок успешно передан. Баланс покупателя обновлен.",
      });
    } catch (error) {
      console.error("Ошибка при выполнении транзакции покупки:", error);
      res.status(500).send("Ошибка сервера.");
    }
  }
);

// СТАТИСТИКА ПОДАРКОВ (ОЧЕНЬ ДОРОГО!!!!!!!)
app.get("/stats", async (req, res) => {
  const { slug, period } = req.query;

  if (!slug || !period) {
    return res.status(400).json({ error: "Недостаточно данных" });
  }

  // Проверка корректности периода
  if (!["day", "week", "month", "all"].includes(period)) {
    return res
      .status(400)
      .json({ error: "Некорректный период: day, week, month, all" });
  }

  const now = admin.firestore.Timestamp.now();
  const nowDate = now.toDate();

  let fromTimestamp = null;
  let intervalDuration = null; // Интервал, по которому будем делить данные
  let dateGroupingFn = null; // Функция для группировки дат

  switch (period) {
    case "day":
      fromTimestamp = admin.firestore.Timestamp.fromDate(
        new Date(nowDate.getTime() - 1 * 24 * 60 * 60 * 1000)
      );
      intervalDuration = 20 * 60 * 1000; // 20 минут
      dateGroupingFn = (date) => {
        // Группируем по 20 минутам
        const roundedTime =
          Math.floor(date.getTime() / intervalDuration) * intervalDuration;
        const groupedDate = new Date(roundedTime);

        return groupedDate.toISOString(); // Используем ISO строку для точности
      };

      break;
    case "week":
      fromTimestamp = admin.firestore.Timestamp.fromDate(
        new Date(nowDate.getTime() - 7 * 24 * 60 * 60 * 1000)
      );
      intervalDuration = 24 * 60 * 60 * 1000; // 1 день
      dateGroupingFn = (date) => {
        return new Date(date.setHours(0, 0, 0, 0));
      };
      break;
    case "month":
      fromTimestamp = admin.firestore.Timestamp.fromDate(
        new Date(nowDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      );
      intervalDuration = 24 * 60 * 60 * 1000; // 1 день
      dateGroupingFn = (date) => {
        return new Date(date.setHours(0, 0, 0, 0));
      };
      break;
    case "all":
      fromTimestamp = null; // без фильтра
      intervalDuration = 30 * 24 * 60 * 60 * 1000; // КАК ЕМУ ПРОСТО (как габену на доту)
      dateGroupingFn = (date) => {
        // Группируем по дням
        return new Date(date.setHours(0, 0, 0, 0));
      };
      break;
  }

  try {
    let query = db.collection("sales-history").where("slug", "==", slug);

    if (fromTimestamp) {
      query = query.where("soldAt", ">=", fromTimestamp);
    }

    const snapshot = await query.get();
    const sales = snapshot.docs.map((doc) => doc.data());

    const groupedData = {};

    sales.forEach((sale) => {
      const groupDate = dateGroupingFn(sale.soldAt.toDate());

      const price = sale.price;

      // Убедимся, что groupDate - это объект Date
      let groupDateObject;
      if (!(groupDate instanceof Date)) {
        groupDateObject = new Date(groupDate);
      } else {
        groupDateObject = groupDate;
      }

      // Преобразуем в ISO строку для корректного группирования
      const groupDateString = groupDateObject.toISOString();

      if (!groupedData[groupDateString]) {
        groupedData[groupDateString] = { totalPrice: 0, salesCount: 0 };
      }

      groupedData[groupDateString].totalPrice += price;
      groupedData[groupDateString].salesCount += 1;
    });

    // Группируем данные по интервалам
    const resultData = Object.keys(groupedData).map((key) => {
      const { totalPrice, salesCount } = groupedData[key];
      const averagePrice = salesCount > 0 ? totalPrice / salesCount : 0;
      const formattedDate = moment(key).format(
        "MMMM D, YYYY [at] h:mm:ss A [UTC]Z"
      );

      return {
        date: formattedDate,
        averagePrice,
        salesCount,
      };
    });

    res.json({
      slug,
      period,
      data: resultData,
    });
  } catch (error) {
    console.error("Ошибка при сборе статистики:", error);
    res.status(500).send("Ошибка сервера.");
  }
});

//ПОЛУЧИТЬ ОДИН ПОДАРОК
app.get("/gifts/:giftId", async (req, res) => {
  try {
    const snapshot = await db.collectionGroup("inventory").get();

    const match = snapshot.docs.find((doc) => doc.id === req.params.giftId);

    if (match) {
      const data = await singleStart(match.data());
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
    const userId = req.params.userId;
    const slug = req.body.slug;

    if (!slug) {
      return res.status(400).json({ error: "Missing 'slug' in request body" });
    }

    const giftId = uuidv4();

    const inventoryRef = db
      .collection("users")
      .doc(userId)
      .collection("inventory")
      .doc(giftId);

    await inventoryRef.set({
      slug,
      ownedAt: new Date(),
      listed: false,
      listingId: null,
      telegramId: userId,
      price: 350,
      value: "Rub",
    });

    res.status(200).json({
      message: "Gift added to inventory",
      giftId,
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

    // Если необходимо сделать обработку или преобразование данных (например, через start), делаем это
    const data = await start(inventory);
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
      const gifts = [docSnap.data()];
      gifts[0].id = req.params.giftId;

      const data = await start(gifts);

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

// ПОЛУЧИТЬ ВСЕ ПОДАРКИ
app.get("/marketplace/listed-gifts", async (req, res) => {
  try {
    const { value, limit = 20, lastDocId } = req.query;

    console.log(
      `📦 Searching listings${value} (limit=${limit}, startAfter=${lastDocId})`
    );

    // Проверка на корректный value
    if (!value) {
      return res.status(400).json({ error: "Missing 'value' parameter" });
    }

    let query = db
      .collection(`listings${value}`)
      .orderBy("listedAt", "desc")
      .limit(parseInt(limit));

    const shouldPaginate =
      lastDocId && lastDocId !== "null" && lastDocId !== "";

    if (shouldPaginate) {
      console.log("➡ Paginating with lastDocId:", lastDocId);

      const lastDocRef = await db
        .collection(`listings${value}`)
        .doc(lastDocId)
        .get();

      if (lastDocRef.exists) {
        query = query.startAfter(lastDocRef);
        console.log("✅ Applied startAfter using doc:", lastDocId);
      } else {
        console.warn("⚠ lastDocRef not found, skipping pagination");
      }
    } else {
      console.log("🟢 Fetching first batch (no pagination)");
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      console.log("🚫 No documents found");
      return res.status(200).json({ gifts: [], lastDocId: null });
    }

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];

    const giftsWithSellerData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const listing = doc.data();
        const sellerId = listing.sellerId;

        let sellerUsername = "Unknown";
        let sellerRating = null;

        if (sellerId) {
          const sellerSnap = await db
            .collection("users")
            .doc(sellerId.toString())
            .get();

          if (sellerSnap.exists) {
            const sellerData = sellerSnap.data();
            sellerUsername = sellerData.username || "Unknown";
            sellerRating = sellerData.rating || null;
          }
        }

        return {
          id: doc.id,
          ...listing,
          sellerRating,
          sellerUsername,
        };
      })
    );

    const data = await start(giftsWithSellerData);

    res.status(200).json({
      gifts: data,
      lastDocId: lastVisible.id,
    });
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    res.status(500).send("Error fetching listings");
  }
});

// ВЫСТАВЛЕНИЕ ПОДАРКОВ НА БИРЖУ
app.post("/users/:userId/list/:giftId", async (req, res) => {
  const { userId, giftId } = req.params;
  const { price, value } = req.body;

  try {
    const giftRef = db
      .collection("users")
      .doc(userId)
      .collection("inventory")
      .doc(giftId);
    const giftSnap = await giftRef.get();

    if (!giftSnap.exists) {
      return res.status(404).send("Gift not found");
    }

    const giftData = giftSnap.data();

    if (giftData.listed) {
      return res.status(400).send("Gift is already listed");
    }

    // Создаём listing
    const listingRef = db.collection(`listings${value}`).doc();
    const listingId = listingRef.id;

    await Promise.all([
      // Добавляем в listings
      listingRef.set({
        giftId,
        sellerId: userId,
        slug: giftData.slug,
        price,
        listedAt: admin.firestore.Timestamp.now(),
        value: value,
      }),

      // Обновляем в инвентаре
      giftRef.update({
        listed: true,
        listingId: listingId,
        price: price,
        value: value,
      }),
    ]);
    console.log();

    res.status(200).send({ message: "Gift listed for sale", listingId });
  } catch (error) {
    console.error("Error listing gift:", error);
    res.status(500).send("Server error");
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

// ПОПОЛНЕНИЕ БАЛЛАНСА

app.post("/users/:userId/updateBalance", async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  console.log(userId, amount);

  const userString = userId.toString();
  try {
    const userRef = admin.firestore().collection("users").doc(userString);

    // Получаем пользователя по ID
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Получаем текущий баланс
    const currentBalance = userDoc.data().balanceTon || 0;

    // Обновляем баланс
    await userRef.update({
      balanceTon: currentBalance + amount,
    });

    return res.status(200).json({ success: "Balance updated successfully!" });
  } catch (error) {
    console.log("Request error: ", error);
    res.status(500).json("sosi yaica!");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// const generateRandomPrice = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };

// const generateRandomRequest = async () => {
//   //   const buyerId = "2074206759";
//   //   const sellerId = "1093289596";
//   const buyerId = "1093289596";
//   const sellerId = "2074206759";
//   const giftId = "62fdc914-68e2-486d-84ad-e4eded77e7cc"; // Пример ID подарка
//   const url = "http://localhost:8000"; // Базовый URL твоего API

//   // Генерация случайной даты в нужном формате
//   const randomDate = moment()
//     .subtract(Math.floor(Math.random() * 90), "days")
//     .toDate();

//   const randomPrice = generateRandomPrice(100, 1000); // Генерация случайной цены

//   // Формирование URL для запроса
//   const requestUrl = `${url}/users/${buyerId}/buy/${sellerId}/inventory/${giftId}`;

//   try {
//     const response = await axios.post(requestUrl, {
//       price: randomPrice,
//       soldAt: randomDate, // Включаем сгенерированную дату
//     });

//     console.log("Запрос успешен:", response.data);
//   } catch (error) {
//     console.error("Ошибка при запросе:", error);
//   }
// };

// const generateMultipleRequests = () => {
//   for (let i = 0; i < 10; i++) {
//     generateRandomRequest();
//   }
// };

// generateMultipleRequests();

// const addRandomGiftToFirebase = async () => {
//   const randomSlug = gifts[Math.floor(Math.random() * gifts.length)]; // Выбираем случайный slug

//   const giftData = {
//     giftId: uuidv4(), // Генерация случайного UUID для giftId
//     listedAt: admin.firestore.Timestamp.fromDate(new Date()), // Используем текущую дату
//     price: Math.floor(Math.random() * 500) + 1, // Рандомная цена от 1 до 500
//     sellerId: Math.floor(Math.random() * 10000000000), // Рандомный sellerId (например, 10-значное число)
//     slug: randomSlug, // Случайно выбранный slug
//     value: "Rub", // Пример валюты
//   };

//   try {
//     const docRef = await db.collection("listingsRub").add(giftData);
//     console.log("Gift added with ID: ", docRef.id);
//   } catch (error) {
//     console.error("Error adding gift: ", error);
//   }
// };

// // Добавление нескольких случайных подарков
// const addMultipleRandomGifts = async (numberOfGifts) => {
//   for (let i = 0; i < numberOfGifts; i++) {
//     await addRandomGiftToFirebase();
//   }
// };

// // Пример добавления 10 случайных подарков
// addMultipleRandomGifts(500);
