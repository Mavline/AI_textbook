require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

console.log('Текущая директория:', process.cwd());
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY);

// Проверка наличия необходимых переменных окружения
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('Отсутствуют необходимые переменные окружения. Проверьте файл .env');
  process.exit(1);
}

// Обработка приватного ключа
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

// Инициализация Firebase
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey
    })
  });
} catch (error) {
  console.error('Ошибка при инициализации Firebase:', error);
  process.exit(1);
}

const db = admin.firestore();

// Чтение JSON файла
let bookStructure;
try {
  bookStructure = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../data/math-textbook-structure.json'), 'utf8'));
} catch (error) {
  console.error('Ошибка при чтении JSON файла:', error);
  process.exit(1);
}

// Функция для рекурсивной загрузки структуры в Firestore
async function uploadStructure(data, collectionPath) {
  for (const item of data) {
    const docRef = db.collection(collectionPath).doc();
    try {
      await docRef.set(item);
      console.log(`Документ успешно добавлен: ${docRef.id}`);
      if (item.sections) {
        await uploadStructure(item.sections, `${collectionPath}/${docRef.id}/sections`);
      }
    } catch (error) {
      console.error(`Ошибка при добавлении документа: ${error}`);
    }
  }
}

// Загрузка структуры книги
uploadStructure(bookStructure.chapters, 'book')
  .then(() => console.log('Структура книги успешно загружена'))
  .catch((error) => console.error('Ошибка при загрузке структуры книги:', error))
  .finally(() => process.exit());
