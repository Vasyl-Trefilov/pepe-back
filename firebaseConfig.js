const admin = require("firebase-admin");

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.ADMIN_DB);
} catch (error) {
  console.error("Ошибка при парсинге переменной окружения:", error);
}

// Если сервисный аккаунт не инициализирован, заверши выполнение
if (!serviceAccount) {
  console.error("Сервисный аккаунт не инициализирован!");
  process.exit(1); // Завершаем процесс, если нет аккаунта
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
