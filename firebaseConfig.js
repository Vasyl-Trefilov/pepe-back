const admin = require("firebase-admin");
const serviceAccount = require("./pepeplush-firebase-adminsdk-fbsvc-c3aeeb519c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { db, admin };
