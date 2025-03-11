import dotenv from "dotenv";
import { Telegraf } from "telegraf";
dotenv.config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const WEBAPP_URL = process.env.WEBAPP_URL;

//node.js
import express, { query } from "express";
import cors from "cors";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
    console.log("Incoming request body:", req.body);

    const { userId, username, firstName, lastName, photoUrl } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("Checking Firestore connection...");
    console.log("Firestore instance:", firestore);

    const userRef = doc(firestore, "users", String(userId));
    console.log("User ref created:", userRef.path);

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

app.get("/test", (req, res) => {
  res.json({ message: "test passed" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
