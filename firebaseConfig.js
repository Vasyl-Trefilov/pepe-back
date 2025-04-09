require("dotenv").config();
const admin = require("firebase-admin");
console.log(
  "Loaded private key starts with:",
  process.env.FIREBASE_PRIVATE_KEY.slice(0, 30)
);
console.log("Ends with:", process.env.FIREBASE_PRIVATE_KEY.slice(-30));

const serviceAccount = {
  type: "service_account", // не нужен в .env
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
};
try {
  const parsedKey = JSON.parse(`"${process.env.FIREBASE_PRIVATE_KEY}"`);
  console.log("✅ Ключ парсится нормально");
} catch (err) {
  console.error("❌ Проблема с парсингом ключа:", err);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log("Firebase Admin SDK инициализировано!");
admin
  .auth()
  .listUsers(1)
  .then((res) => {
    console.log("✅ Firebase авторизация работает");
  })
  .catch((err) => {
    console.error("❌ Ошибка авторизации Firebase:", err.message);
  });

const db = admin.firestore();
module.exports = { db, admin };
