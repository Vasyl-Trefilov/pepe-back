// const dotenv = require("dotenv");
const { Telegraf } = require("telegraf");
const { v4: uuidv4 } = require("uuid");

const moment = require("moment");

// dotenv.config();
// const bot = new Telegraf(process.env.BOT_TOKEN);
const bot = new Telegraf("7414641138:AAE97Pk05VhT2qD-uGZ4ZsdKWQTS6GSkGkk"); // НЕ ЗАБЫТЬ ПОМЕНЯТЬ
// const WEBAPP_URL = process.env.WEBAPP_URL;

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
const { FieldValue } = require("firebase-admin/firestore");
const {
  TelegramClient,
  TlObject,
  Serializer,
  Deserializer,
} = require("telegram");
const { BinaryWriter } = require("telegram/extensions");
const { StringSession } = require("telegram/sessions");
const { Api } = require("./telegram/tl/api");
// const apiId = 26232115;
// const apiHash = "ca1913add4b5275cac3c1e28fd59278c";
// // const session = new StringSession(
// //   "1AgAOMTQ5LjE1NC4xNjcuNDEBuwUqM1Z1ZrkgUzMArjRlJwORkwKGhEyXAiRCeZCwHPAki7eP/nOhV8HnWhHBuve9p7iY8j16yMXqqjgwhTzTUxLP0X73VmKYCm+diphvLuuhatmZC55SPEkr8fMpn9yRJBWkakxeFgNWQQBqKDA5McXRcg2RG+OpAlZH1QuLf6uQkw20JXJY/dSmeI0rkFjlpvND8rmvj9Iba3rusBy7mAesfTKxE+Aue+uOOqNqKkAiNS3gQt45fhfbd8L0jGeC36Ztm4oMpk6dHI0yc3iBZO//gMh8TE3NB9k3//FAdI8YsFdnVxevRLpW1P0ZinS/puUTiqjo4LR6kS+Dxc8rkvE="
// // ); // пустая строка
// const input = require("input"); // npm i input
// const stringSession = new StringSession(""); // fill this later with the value from session.save()

// (async () => {
//   console.log("Loading interactive example...");
//   const client = new TelegramClient(stringSession, apiId, apiHash, {
//     connectionRetries: 5,
//   });
//   await client.start({
//     phoneNumber: async () => await input.text("Please enter your number: "),
//     password: async () => await input.text("Please enter your password: "),
//     phoneCode: async () =>
//       await input.text("Please enter the code you received: "),
//     onError: (err) => console.log(err),
//   });
//   console.log("You should now be connected.");
//   console.log(client.session.save()); // Save this string to avoid logging in again
//   await client.sendMessage("me", { message: "Hello!" });
// })();
const apiId = 26232115;
const apiHash = "ca1913add4b5275cac3c1e28fd59278c";
const session = new StringSession(
  "1AgAOMTQ5LjE1NC4xNjcuNDEBu2F/zFVn4SWtXmlrnorszEaXlQXUqY6zB1aZNU+euVsNRqZK2NHJMcuv3WWCrwAls6asbU9g9nNU+xsq3IlSg3KKSIDFX/1qEDHHT6unBlk5hsymonWcdj2XEVgh0n+KW2ZirrECbAm+xrTwVXWgeoHz1N7vkMePIH8bHT2AfZsnEo6OPfAEM7FTFj2HvC/g11i9QT0XzK+BooI9xqaI+2LhhP7hOdf6OBHyAOz6l6wWDc7LNbWvkt0sgIHqs7rbNV7NhpzRNMiYMb6JrOyxX73ekg9tiVdJcpJGhWcYz2ydDjLT25aZBCEJ0qmrBDKT/K7Rdqix5ne6g1rkFhmsBo8="
);

const client = new TelegramClient(session, apiId, apiHash, {});

(async function run() {
  console.log("Connecting...");
  await client.connect();

  console.log("Connected");

  // console.log("Class value:", Api.payments.GetResaleStarGifts);
  // console.log("Type:", typeof Api.payments.GetResaleStarGifts);

  // const request = await client.invoke(
  //   new Api.payments.GetResaleStarGifts({
  //     gift_id: "1234567890",
  //     offset: "",
  //     limit: 20,
  //     sort_by_price: true,
  //     // attributes_hash: "12345678901234567890",
  //     // attributes: [new Api.StarGiftAttributeId({ ... })],
  //   })
  // );

  // console.log(request);

  // try {
  //   const result = await client.call(request);
  //   console.log("Got result:", result);
  // } catch (err) {
  //   console.error("Error calling method:", err);
  // }
  // const result = await client.invoke(new Api.payments.GetUserStarGifts());
  // console.log("🎁 Найдено подарков:", result.gifts.length);
  // const recipient = await client.getEntity("TrefilovVasyl"); // или userId

  // const stargift = new Api.InputSavedStarGiftUser({
  //   msgId: 1282, // твой известный msgId
  // });

  // await client.invoke(
  //   new Api.payments.TransferStarGift({
  //     stargift,
  //     toId: recipient,
  //   })
  // );

  // console.log(stargift);

  // await client.invoke(
  //   new Api.payments.TransferStarGift({
  //     stargift,
  //     toId: recipient,
  //   })
  // );

  console.log("✅ Подарок отправлен!");

  // const slug = "CandyCane-13445";
  // const recipient = 2074206759; // может быть username или ID

  // // 1. Получить уникальный подарок по slug
  // const uniqueGift = await client.invoke(
  //   new Api.payments.GetUniqueStarGift({ slug })
  // );
  // console.log(uniqueGift);
  // const user = await client.getEntity("TrefilovVasyl"); // можно также userID
  // const inputPeer = user; // уже InputPeer

  // const stargift = new Api.InputSavedStarGiftUser({
  //   msgId: uniqueGift.msgId,
  // });

  // await client.invoke(
  //   new Api.payments.TransferStarGift({
  //     stargift,
  //     toId: inputPeer,
  //   })
  // );
  // console.log("🎁 Подарок отправлен!");

  console.log("Подключено к Telegram!");
  // async function checkIfGift(msg, normalNumberId) {
  //   try {
  //     const action = msg.message.action;
  //     processGiftDetails(action, normalNumberId);
  //   } catch (err) {
  //     console.error("Ошибка при получении сообщения:", err);
  //   }
  // }
  // async function processGiftDetails(action, normalNumberId) {
  //   const gift = action.originalArgs.gift;
  //   const giftSlug = gift.slug;
  //   const userRef = doc(firestore, "users", String(normalNumberId));
  //   const userSnap = await getDoc(userRef);

  //   if (userSnap.exists()) {
  //     const inventoryRef = doc(
  //       firestore,
  //       "users",
  //       String(normalNumberId),
  //       "inventory",
  //       giftSlug
  //     );
  //     await setDoc(inventoryRef, {
  //       giftLink: `https://t.me/nft/${giftSlug}`, // Ссылка на подарок
  //       addedAt: new Date(), // Время добавления подарка
  //     });
  //   } else {
  //   }
  // }

  // client.addEventHandler(async (update) => {
  //   if (!update.message?.action) {
  //   } else {
  //     await checkIfGift(update, 2074206759);
  //   }
  // });
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
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cors());
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "Token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Invalid token", err.message);
      return res.status(403).json({
        message: "Invalid token",
        error: err.message,
      });
    }

    console.log("✅ Token verified for user:", decoded.id);
    req.user = { id: decoded.id.toString() }; // Ensure string type
    next();
  });
}
// Add this test endpoint
app.get("/verify-test", verifyToken, (req, res) => {
  res.json({ user: req.user });
});
app.post("/login", async (req, res) => {
  const { telegramId } = req.body;

  try {
    const userRef = db.collection("users").doc(telegramId.toString());
    const doc = await userRef.get();

    let userData;

    if (!doc.exists) {
      userData = {
        telegramId,
        username: `user_${Math.floor(Math.random() * 1000000)}`,
        balanceRub: 0,
        balanceTon: 0,
        balanceUsdt: 0,
        rating: 0,
        joinedAt: new Date(),
      };

      await userRef.set(userData);
      console.log("Создан новый пользователь:", userData);
    } else {
      userData = doc.data();
      console.log("Найден пользователь:", userData);
    }

    // ✅ Генерируем токен
    const token = jwt.sign(
      { id: telegramId }, // payload
      JWT_SECRET,
      { expiresIn: "7d" } // срок действия
    );

    res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error("Ошибка при логине:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});
app.get("/test", (req, res) => {
  console.log("ananas");

  res.json({ message: "test passed" });
});
app.get("/users/inventory-test", async (req, res) => {
  res.json({ message: "Unprotected version works" });
});

//ПОЛУЧИТЬ ОДИН ПОДАРОК
app.get("/gifts/:giftId", async (req, res) => {
  console.log("ananasGift");

  try {
    console.log("ananas");
    const docRef = db.collection("listingsRub").doc(req.params.giftId);
    const doc = await docRef.get();
    console.log(doc.data());

    if (doc.exists) {
      const giftData = doc.data();
      const parsedGiftData = await singleMarketStart(giftData.slug);
      console.log(parsedGiftData);
      const data = {
        ...parsedGiftData,
        ...giftData,
      };
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

// ПОЛУЧИТЬ ВСЕ ПОДАРКИ ИЗ ИНВЕНТАРЯ С ПАГИНАЦИЕЙ И ФИЛЬТРАМИ
app.get("/users/inventory", verifyToken, async (req, res) => {
  console.log("🔥 /users/inventory HIT - User ID:", req.user.id);

  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID missing" });
    }

    // Validate user exists
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Process query parameters
    const {
      limit = 20,
      lastDocId,
      minPrice,
      maxPrice,
      model,
      symbol,
      backdrop,
      gift,
      sortState,
    } = req.query;

    const baseQuery = userRef.collection(`inventory`);

    const filters = {
      symbol: normalizeFilterParam(symbol),
      backdrop: normalizeFilterParam(backdrop),
      // model и gift взаимоисключающие
      ...(model
        ? { model: normalizeFilterParam(model) }
        : { gift: normalizeFilterParam(gift) }),
    };

    let queries;
    try {
      queries = buildQueries(baseQuery, filters);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // Доп. фильтры по цене
    const applyPriceFilter = (query) => {
      if (minPrice && maxPrice) {
        return query
          .where("price", ">=", Number(minPrice))
          .where("price", "<=", Number(maxPrice));
      } else if (minPrice) {
        return query.where("price", ">=", Number(minPrice));
      } else if (maxPrice) {
        return query.where("price", "<=", Number(maxPrice));
      }
      return query;
    };

    // Применяем сортировку
    let parsedSortState = {};
    if (sortState) {
      try {
        parsedSortState = JSON.parse(sortState);
      } catch (e) {
        console.warn("Invalid sortState JSON:", sortState);
      }
    }

    // Запускаем все запросы
    const results = await Promise.all(
      queries.map(async (q) => {
        let query = q;

        // Применить ценовой фильтр
        query = applyPriceFilter(query);

        // Сортировка
        Object.entries(parsedSortState).forEach(([key, direction]) => {
          const field = sortMap[key];
          if (field && (direction === "asc" || direction === "desc")) {
            query = query.orderBy(field, direction);
          }
        });

        // startAfter
        if (lastDocId && lastDocId !== "null" && lastDocId !== "") {
          const lastDocRef = await userRef
            .collection(`inventory`)
            .doc(lastDocId)
            .get();
          if (lastDocRef.exists) {
            query = query.startAfter(lastDocRef);
          }
        }

        return await query.get();
      })
    );

    const allDocs = results.flatMap((snap) => snap.docs);

    if (allDocs.length === 0) {
      return res.status(200).json({ gifts: [], lastDocId: null });
    }

    const lastVisible = allDocs[allDocs.length - 1];

    const giftsWithSellerData = await Promise.all(
      allDocs.map(async (doc) => {
        const listing = doc.data();
        const sellerId = listing.sellerId;

        let sellerUsername = "Unknown";
        let sellerRating = null;

        if (sellerId) {
          try {
            const sellerSnap = await db
              .collection("users")
              .doc(sellerId.toString())
              .get();

            if (sellerSnap.exists) {
              const sellerData = sellerSnap.data();
              sellerUsername = sellerData.username || "Unknown";
              sellerRating = sellerData.rating || null;
            }
          } catch (err) {
            console.warn(`Failed to fetch seller ${sellerId}:`, err.message);
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

    res.status(200).json({
      gifts: giftsWithSellerData,
      lastDocId: lastVisible.id,
    });
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    res.status(500).send("Error fetching listings");
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
async function singleMarketStart(item) {
  const pLimit = await loadPLimit();
  const limit = pLimit(5); // Ограничение на 10 запросов одновременно

  // Передаём limit в getData()
  const data = await getSingleMarketData(limit, item);
  return data;
}

async function getSingleMarketData(limit, giftObj) {
  if (!limit) {
    throw new Error("limit не передан в getSingleData()");
  }

  try {
    const resGift = await fetchSingleMarketData(giftObj);

    return resGift;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function fetchSingleMarketData(item) {
  const url = item;
  try {
    console.log(`parsing ${item}`);

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
      backdropRarity,
      modelRarity,
      symbolRarity,
    };
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
    return null;
  }
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
  const url = item;
  try {
    console.log(`parsing ${item}`);

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
app.post("/buy/:giftId", verifyToken, async (req, res) => {
  const { giftId } = req.params;
  const buyerId = req.user.id;

  try {
    // 1. Fetch gift metadata (outside transaction)
    const giftRef = db.collection("listingsRub").doc(giftId);
    const giftSnap = await giftRef.get();
    if (!giftSnap.exists) {
      return res.status(404).send("Подарок не найден");
    }
    const giftData = giftSnap.data();

    // 2. Run transaction on DocumentReferences only
    const { sellerId } = await db.runTransaction(async (tx) => {
      const buyerRef = db.collection("users").doc(buyerId);
      const sellerRef = db.collection("users").doc(giftData.sellerId);

      const [buyerSnap, sellerSnap, freshGiftSnap] = await Promise.all([
        tx.get(buyerRef),
        tx.get(sellerRef),
        tx.get(giftRef),
      ]);

      if (!buyerSnap.exists) throw new Error("Покупатель не найден");
      if (!sellerSnap.exists) throw new Error("Продавец не найден");

      const freshGift = freshGiftSnap.data();
      if (!freshGift.listed) throw new Error("Подарок уже продан");
      if (buyerSnap.data().balanceRub < freshGift.price) {
        throw new Error("Недостаточно средств");
      }

      // Update balances
      tx.update(buyerRef, {
        balanceRub: buyerSnap.data().balanceRub - freshGift.price,
      });
      tx.update(sellerRef, {
        balanceRub: sellerSnap.data().balanceRub + freshGift.price * 0.97,
      });

      // Move inventory
      tx.delete(
        db
          .collection("users")
          .doc(freshGift.sellerId)
          .collection("inventory")
          .doc(giftId)
      );
      tx.set(
        db.collection("users").doc(buyerId).collection("inventory").doc(giftId),
        {
          ...freshGift,
          listed: false,
          listingId: null,
          telegramId: buyerSnap.data().telegramId,
        }
      );

      // Mark gift as sold
      tx.update(giftRef, { listed: false });

      return { sellerId: freshGift.sellerId };
    });

    // 3. Record history (outside transaction)
    const now = admin.firestore.Timestamp.now();
    await Promise.all([
      db.collection("sales-history").add({
        telegramId: giftData.telegramId,
        slug: giftData.slug,
        price: giftData.price,
        soldAt: now,
        sellerId,
        buyerId,
      }),
      db
        .collection("users")
        .doc(buyerId)
        .collection("purchase-history")
        .add({
          giftId,
          slug: giftData.slug,
          price: giftData.price,
          value: giftData.value || "Rub",
          sellerId,
          purchasedAt: now,
        }),
      db
        .collection("users")
        .doc(sellerId)
        .collection("sales-history")
        .add({
          giftId,
          slug: giftData.slug,
          price: giftData.price,
          value: giftData.value || "Rub",
          buyerId,
          soldAt: now,
        }),
    ]);

    return res.json({ message: "Подарок успешно куплен" });
  } catch (err) {
    console.error("Ошибка при покупке:", err);
    return res.status(500).send(err.message || "Ошибка сервера");
  }
});

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
    await generateGifts(slug);
    const data = await singleStart(slug);
    const giftName = extractTittleFromUrl(extractNameFromUrl(slug));

    const slugNumber = parseInt(slug.split("-").pop(), 10);

    await inventoryRef.set({
      slug,
      ownedAt: new Date(),
      listed: false,
      listingId: null,
      telegramId: userId,
      price: 350,
      value: "Rub",
      model: data.modelValue,
      symbol: data.symbolValue,
      backdrop: data.backdropValue,
      gift: giftName,
      slugNumber: slugNumber,
    });
    generateGifts(slug);
    await updateFilterList(
      extractTittleFromUrl(extractNameFromUrl(slug)),
      extractNameFromUrl(slug),
      {
        modelValue: data.modelValue,
        modelRarity: data.modelRarity,
      },
      {
        backdropValue: data.backdropValue,
        backdropRarity: data.backdropRarity,
        firstColor: data.firstColor,
        secondColor: data.secondColor,
      },
      {
        symbolValue: data.symbolValue,
        symbolRarity: data.symbolRarity,
        symbolUrl: data.patternUrl,
      }
    );

    res.status(200).json({
      message: "Gift added to inventory",
      giftId,
    });
  } catch (error) {
    console.error("Ошибка при добавлении подарка:", error);
    res.status(500).send("Ошибка сервера");
  }
});

// ПОЛУЧИТЬ ОДИН ПОДАРОК
app.get("/users/:userId/inventory/:giftId", async (req, res) => {
  console.log("ananas");

  try {
    // Ссылаемся на коллекцию inventory для конкретного пользователя
    const docRef = db
      .collection("users")
      .doc(req.params.userId)
      .collection("inventory")
      .doc(req.params.giftId);

    const docSnap = await docRef.get();
    console.log(docSnap.data());

    if (docSnap.exists) {
      res.status(200).json({
        message: "Gift found",
        gift: docSnap.data(),
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

function normalizeFilterParam(param) {
  if (!param) return [];
  if (Array.isArray(param)) return param;
  if (typeof param === "string") return param.split(",").map((s) => s.trim());
  return [];
}
const sortMap = {
  price: "price",
  number: "slugNumber",
  publishedAt: "listedAt",
};
const MAX_IN_VALUES = 10;

const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const applyFilter = (query, field, values) => {
  if (values.length === 1) {
    return [query.where(field, "==", values[0])];
  }

  return chunkArray(values, MAX_IN_VALUES).map((chunk) =>
    query.where(field, "in", chunk)
  );
};

const buildQueries = (baseQuery, filters) => {
  let queries = [baseQuery];

  for (const [field, values] of Object.entries(filters)) {
    if (!values || values.length === 0) continue;

    const newQueries = [];

    for (const query of queries) {
      const partials = applyFilter(query, field, values);
      newQueries.push(...partials);
    }

    queries = newQueries;

    // Ограничение: не делаем >30 запросов
    if (queries.length > 30) {
      throw new Error("Too many combinations. Try to reduce filter size.");
    }
  }

  return queries;
};

// ПОЛУЧИТЬ ВСЕ ПОДАРКИ
app.get("/marketplace/listed-gifts", async (req, res) => {
  try {
    const {
      value,
      limit = 20,
      lastDocId,
      minPrice,
      maxPrice,
      model,
      symbol,
      backdrop,
      gift,
      sortState,
    } = req.query;
    console.log(
      value,
      limit,
      lastDocId,
      minPrice,
      maxPrice,
      model,
      symbol,
      "gift:",
      backdrop,
      gift,
      sortState
    );

    if (!value) {
      return res.status(400).json({ error: "Missing 'value' parameter" });
    }

    const baseQuery = db.collection(`listings${value}`);

    const filters = {
      symbol: normalizeFilterParam(symbol),
      backdrop: normalizeFilterParam(backdrop),
      // model и gift взаимоисключающие
      ...(model
        ? { model: normalizeFilterParam(model) }
        : { gift: normalizeFilterParam(gift) }),
    };

    let queries;
    try {
      queries = buildQueries(baseQuery, filters);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // Доп. фильтры по цене
    const applyPriceFilter = (query) => {
      if (minPrice && maxPrice) {
        return query
          .where("price", ">=", Number(minPrice))
          .where("price", "<=", Number(maxPrice));
      } else if (minPrice) {
        return query.where("price", ">=", Number(minPrice));
      } else if (maxPrice) {
        return query.where("price", "<=", Number(maxPrice));
      }
      return query;
    };

    // Применяем сортировку
    let parsedSortState = {};
    if (sortState) {
      try {
        parsedSortState = JSON.parse(sortState);
      } catch (e) {
        console.warn("Invalid sortState JSON:", sortState);
      }
    }

    // Запускаем все запросы
    const results = await Promise.all(
      queries.map(async (q) => {
        let query = q;

        // Применить ценовой фильтр
        query = applyPriceFilter(query);

        // Сортировка
        Object.entries(parsedSortState).forEach(([key, direction]) => {
          const field = sortMap[key];
          if (field && (direction === "asc" || direction === "desc")) {
            query = query.orderBy(field, direction);
          }
        });

        // startAfter
        if (lastDocId && lastDocId !== "null" && lastDocId !== "") {
          const lastDocRef = await db
            .collection(`listings${value}`)
            .doc(lastDocId)
            .get();
          if (lastDocRef.exists) {
            query = query.startAfter(lastDocRef);
          }
        }

        return await query.get();
      })
    );

    const allDocs = results.flatMap((snap) => snap.docs);

    if (allDocs.length === 0) {
      return res.status(200).json({ gifts: [], lastDocId: null });
    }

    const lastVisible = allDocs[allDocs.length - 1];

    const giftsWithSellerData = await Promise.all(
      allDocs.map(async (doc) => {
        const listing = doc.data();
        const sellerId = listing.sellerId;

        let sellerUsername = "Unknown";
        let sellerRating = null;

        if (sellerId) {
          try {
            const sellerSnap = await db
              .collection("users")
              .doc(sellerId.toString())
              .get();

            if (sellerSnap.exists) {
              const sellerData = sellerSnap.data();
              sellerUsername = sellerData.username || "Unknown";
              sellerRating = sellerData.rating || null;
            }
          } catch (err) {
            console.warn(`Failed to fetch seller ${sellerId}:`, err.message);
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

    res.status(200).json({
      gifts: giftsWithSellerData,
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
    const giftName = extractTittleFromUrl(extractNameFromUrl(giftData.slug));
    // Создаём listing
    const listingRef = db.collection(`listings${value}`).doc();
    const listingId = listingRef.id;
    console.log(giftData);

    await Promise.all([
      // Добавляем в listings
      listingRef.set({
        giftId,
        sellerId: userId,
        slug: giftData.slug,
        price,
        gift: giftName,
        model: giftData.model,
        symbol: giftData.symbol,
        backdrop: giftData.backdrop,
        slugNumber: giftData.slugNumber,
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
// FILTER
async function updateFilterList(tittle, giftKey, model, backdrop, symbol) {
  console.log(tittle, giftKey);

  const filtersRef = db.collection("filterList").doc("master");
  const doc = await filtersRef.get();
  const currentData = doc.exists ? doc.data() : {};

  const updatePayload = { ...currentData };
  let hasChanges = false;

  // Update model (если есть)
  if (model && giftKey) {
    const newModel = {
      value: model.modelValue,
      rarity: model.modelRarity,
      image: `https://cdn.onyx-marketplace.com/${giftKey}-preview.png`,
    };

    if (!updatePayload.models) updatePayload.models = {};
    if (!updatePayload.models[tittle]) updatePayload.models[tittle] = [];

    const alreadyExists = updatePayload.models[tittle].some(
      (m) => m.value === newModel.value
    );

    if (!alreadyExists) {
      updatePayload.models[tittle].push(newModel);
      hasChanges = true; // изменения были
    }
  }

  // Update backdrop (если есть)
  if (backdrop) {
    const newBackdrop = {
      value: backdrop.backdropValue,
      rarity: backdrop.backdropRarity,
      colors: {
        first: backdrop.firstColor,
        second: backdrop.secondColor,
      },
    };

    if (!updatePayload.backdrops) updatePayload.backdrops = [];

    const exists = updatePayload.backdrops.some(
      (b) => b.value === newBackdrop.value
    );

    if (!exists) {
      updatePayload.backdrops.push(newBackdrop);
      hasChanges = true; // изменения были
    }
  }

  // Update symbol (если есть)
  if (symbol) {
    let newSymbol;
    const imageKey = `symbols/${symbol.symbolValue}.png`;
    try {
      // Загружаем изображение из интернета
      const response = await axios.get(symbol.symbolUrl, {
        responseType: "arraybuffer",
      });
      const imageBuffer = Buffer.from(response.data);

      // Загружаем картинку в R2
      await r2
        .putObject({
          Bucket: BUCKET_NAME,
          Key: imageKey,
          Body: imageBuffer,
          ContentType: "image/png",
          ACL: "public-read", // делает файл доступным по ссылке
        })
        .promise();

      console.log("Image uploaded successfully.");

      newSymbol = {
        value: symbol.symbolValue,
        rarity: symbol.symbolRarity,
        image: `https://cdn.onyx-marketplace.com/symbols/${symbol.symbolValue}.png`,
      };

      // Можно вернуть или использовать newSymbol
    } catch (err) {
      console.error("Error uploading image or downloading:", err);
    }
    if (!updatePayload.symbols) updatePayload.symbols = [];

    const exists = updatePayload.symbols.some(
      (s) => s.value === newSymbol.value
    );

    if (!exists) {
      updatePayload.symbols.push(newSymbol);
      hasChanges = true; // изменения были
    }
  }

  // Если изменения были, сохраняем
  if (hasChanges) {
    console.log("🔥 Обновляем данные в Firestore...");
    await filtersRef.set(updatePayload);
  } else {
    console.log("⚡ Нет изменений, Firestore не обновляется");
  }
}

//R2 WORK
const AWS = require("aws-sdk");
const fs = require("fs");
const pako = require("pako");
const puppeteer = require("puppeteer");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const crypto = require("crypto");
const r2 = new AWS.S3({
  endpoint: "https://289eb330c8063e3301e4b36b50ab7c7a.r2.cloudflarestorage.com",
  accessKeyId: "90fda9f30427200bdd432977d9f31fde",
  secretAccessKey:
    "378bd662a455dff0259fe6de029590ed40df33b51ac8c7ba94e4cde66f7db519",
  signatureVersion: "v4",
  region: "auto",
});
const BUCKET_NAME = "onyxcdn";
const PARTS = ["models", "backdrops", "symbols"]; // ключи, которые будем выносить
function getHash(obj) {
  return crypto.createHash("md5").update(JSON.stringify(obj)).digest("hex");
}

async function exportAndUploadFilters() {
  try {
    console.log("📥 Получаем фильтры из Firestore...");
    const doc = await db.collection("filterList").doc("master").get();

    if (!doc.exists) {
      throw new Error("Документ filterList/master не найден!");
    }

    const filters = doc.data();

    for (const key of PARTS) {
      const data = filters[key];
      if (!data) {
        console.warn(`⚠️ Нет ключа ${key} в фильтрах, пропускаем`);
        continue;
      }

      const json = JSON.stringify(data, null, 2);
      const hash = getHash(data);
      const filename = `${key}.json`;
      const filePath = path.resolve(__dirname, filename);

      // Проверяем, есть ли локальный файл и совпадает ли хэш
      let existingHash = null;
      if (fs.existsSync(filePath)) {
        const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
        existingHash = getHash(existing);
      }

      if (existingHash === hash) {
        console.log(`🔁 ${key}.json не изменился, пропускаем загрузку`);
        continue;
      }

      console.log(`📁 Сохраняем ${filename}...`);
      fs.writeFileSync(filePath, json, "utf8");

      console.log(`☁️ Загружаем ${filename} в R2...`);
      await r2
        .putObject({
          Bucket: BUCKET_NAME,
          Key: filename,
          Body: fs.readFileSync(filePath),
          ContentType: "application/json",
          ACL: "public-read",
        })
        .promise();

      console.log(
        `✅ Загружено: ${filename} → https://cdn.onyx-marketplace.com/${filename}`
      );
    }
  } catch (err) {
    console.error("❌ Ошибка:", err);
  }
}

exportAndUploadFilters();
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

  const baseFileName = uuidv4();

  // Захват скриншотов для всех кадров
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

    // Сохраняем скриншот для каждого кадра
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

  // Путь для видео
  const videoPath = `./${baseFileName}.webm`;

  // Создание видео из скриншотов с помощью ffmpeg
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
      .save(videoPath);
  });
  // Загружаем картинку в R2
  // Сохраняем второй кадр как preview
  const previewImagePath = `${tempDir}/frame_0001.png`; // кадр 1 (второй)
  const previewImageBuffer = fs.readFileSync(previewImagePath);
  const previewPath = `./${baseFileName}.png`;
  fs.writeFileSync(previewPath, previewImageBuffer);
  const imageBuffer = fs.readFileSync(previewPath); // <-- читаем отдельно

  const imageKey = `${options.filename}.png`;
  // Удаляем временную директорию с кадрами
  fs.rmSync(tempDir, { recursive: true });

  try {
    // Загружаем картинку в R2
    await r2
      .putObject({
        Bucket: BUCKET_NAME,
        Key: imageKey,
        Body: imageBuffer,
        ContentType: "image/png",
        ACL: "public-read",
      })
      .promise();

    console.log("Image uploaded successfully.");
  } catch (err) {
    console.log("Error uploading image:", err);
  }

  // Загружаем видео в R2
  const videoBuffer = fs.readFileSync(videoPath);
  const videoKey = `${options.filename}.webm`;

  try {
    // Загружаем видео в R2
    await r2
      .putObject({
        Bucket: BUCKET_NAME,
        Key: videoKey,
        Body: videoBuffer,
        ContentType: "video/webm",
        ACL: "public-read",
      })
      .promise();

    // Удаляем локальный файл видео после загрузки
    fs.unlinkSync(videoPath);
    console.log("Video uploaded successfully.");
  } catch (err) {
    console.log("Error uploading video:", err);
  }

  // Возвращаем URL для видео
  return {
    videoUrl: `https://${BUCKET_NAME}.289eb330c8063e3301e4b36b50ab7c7a.r2.cloudflarestorage.com/${videoKey}`,
    imageUrl: `https://${BUCKET_NAME}.289eb330c8063e3301e4b36b50ab7c7a.r2.cloudflarestorage.com/${imageKey}`,
  };
}

async function renderAnimToWebm(lottieJson, options) {
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
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
</head>
<body>
<div id="gift-card-container">
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
    anim.goToAndStop(1, true); 
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
  fs.writeFileSync("animDebug.html", await page.content(), "utf-8");

  await page.waitForFunction("window.animationReady === true");

  const baseFileName = uuidv4();

  // Захватываем скриншот первого кадра (если нужно, для картинки)
  await page.screenshot({
    path: `./${baseFileName}.png`, // Используем baseFileName для картинок
    clip: {
      x: 0,
      y: 0,
      width: TARGET_SIZE * RENDER_SCALE,
      height: TARGET_SIZE * RENDER_SCALE,
    },
    omitBackground: true,
  });

  await browser.close();
  const imageBuffer = fs.readFileSync(`./${baseFileName}.png`);
  const imageKey = `${options.filename}-preview.png`;

  try {
    // Загружаем картинку в R2
    await r2
      .putObject({
        Bucket: BUCKET_NAME,
        Key: imageKey,
        Body: imageBuffer,
        ContentType: "image/png",
        ACL: "public-read",
      })
      .promise();

    console.log("Image uploaded successfully.");
  } catch (err) {
    console.log("Error uploading image:", err);
  }

  return `https://${BUCKET_NAME}.289eb330c8063e3301e4b36b50ab7c7a.r2.cloudflarestorage.com/${imageKey}`;
}

const extractNameFromUrl = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1]; // Возьмёт последний сегмент
};
const extractTittleFromUrl = (url) => {
  const parts = url.split("-");
  return parts[parts.length - 2]; // Возьмёт последний сегмент
};
async function generateGifts(url) {
  try {
    const data = await singleStart(url);
    const lottieJson = await loadTGSFromURL(data.animationUrl);
    const name = extractNameFromUrl(url);
    const fileUrl = await renderToWebm(lottieJson, {
      firstColor: data.firstColor,
      secondColor: data.secondColor,
      patternColorFilter: data.patternColorFilter,
      patternUrl: data.patternUrl,
      filename: name,
    });
    // ТУТ нужна проверка
    const animUrlExists = await checkIfFileExists(
      `https://cdn.onyx-marketplace.com/animations/${name}-preview.png`
    );

    if (animUrlExists) {
      console.log(
        `Видео и анимация для ${name} уже существуют. Пропускаем создание.`
      );
      return;
    }
    const animUrl = await renderAnimToWebm(lottieJson, {
      filename: name,
    });
    console.log(
      `Видео для ${name} доступно по ссылке: ${fileUrl}, а анимация по ${animUrl}`
    );
  } catch (err) {
    console.error("❌ Ошибка генерации:", err);
  }
}
async function checkIfFileExists(fileUrl) {
  try {
    const response = await fetch(fileUrl, { method: "HEAD" });
    return response.ok; // если ответ статус 200, значит файл существует
  } catch (error) {
    console.error("Ошибка при проверке файла:", error);
    return false; // если возникла ошибка, предполагаем, что файл не существует
  }
}
// generateGifts("https://t.me/nft/TamaGadget-10581");
const PORT = 8000;
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
