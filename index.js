import dotenv from "dotenv";
import { Telegraf } from "telegraf";
dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const WEBAPP_URL = process.env.WEBAPP_URL;

//node.js
import express from "express";
import cors from "cors";
import { doc, getDoc, setDoc, getDocs } from "firebase/firestore";
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
  if (!userId) {
    return res.status(400).json({ error: "UserId is required" });
  }
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentBalance = parseInt(userData.balance, 10) || 0; // Преобразование в целое число
      const newBalance = currentBalance + parseInt(amount, 10); // Преобразование amount в целое число

      await updateDoc(userRef, { balance: newBalance });

      console.log(`✅ Баланс обновлен: ${newBalance} TON`);
      res.json({ success: true, newBalance }).status(200);
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
