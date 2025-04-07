const admin = require("firebase-admin");

// Парсим переменную окружения, которая содержит JSON строку
const serviceAccount = JSON.parse(process.env.ADMIN_DB);

// Инициализируем Firebase Admin SDK с сервисным аккаунтом
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Пробуем получить коллекции из Firestore
admin
  .firestore()
  .listCollections()
  .then((collections) => {
    console.log(
      "Подключение успешно! Коллекции:",
      collections.map((c) => c.id)
    );
  })
  .catch((error) => {
    console.error("Ошибка подключения:", error);
  });

// Экспортируем db и admin для использования в других частях приложения
const db = admin.firestore();
module.exports = { db, admin };
