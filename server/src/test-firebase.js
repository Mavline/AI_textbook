// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../../.env') });
// const admin = require('./config/firebase-config');

// console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

// async function testFirebaseConnection() {
//   try {
//     const collections = await admin.firestore().listCollections();
//     console.log('Успешное подключение к Firebase. Список коллекций:', collections.map(col => col.id));
//   } catch (error) {
//     console.error('Ошибка при подключении к Firebase:', error);
//   }
// }

// testFirebaseConnection();


const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const admin = require('./config/firebase-config');

console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

async function testFirebaseConnection() {
  try {
    // Проверка подключения к Firestore
    const db = admin.firestore();
    const bookCollection = await db.collection('book').get();
    if (!bookCollection.empty) {
      console.log('Найдены документы в коллекции "book":');
      bookCollection.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
      });
    } else {
      console.log('Документы в коллекции "book" не найдены');
    }

    // Проверка подключения к Firebase Storage
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles({ prefix: 'textbooks/' });
    if (files.length > 0) {
      console.log('Файлы найдены в папке "textbooks":');
      files.forEach(file => {
        console.log('- ', file.name);
      });
    } else {
      console.log('Файлы в папке "textbooks" не найдены');
    }

    console.log('Тест подключения к Firebase успешно завершен');
  } catch (error) {
    console.error('Ошибка при тестировании подключения к Firebase:', error);
  }
}

testFirebaseConnection();
