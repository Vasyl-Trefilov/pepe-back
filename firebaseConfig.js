const admin = require("firebase-admin");
const serviceAccount = process.env.ADMIN_DB;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { db, admin };
