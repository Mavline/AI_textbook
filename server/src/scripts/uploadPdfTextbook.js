// require('dotenv').config({ path: '../../../.env' });
// const admin = require('firebase-admin');
// const fs = require('fs');
// const path = require('path');

// // Инициализация Firebase
// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
//   }),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET
// });

// const bucket = admin.storage().bucket();

// async function uploadPDF() {
//   const filePath = path.join(__dirname, '../../../data/Textbook_5class.pdf');
//   const uploadTo = 'textbooks/Textbook_5class.pdf';

//   try {
//     await bucket.upload(filePath, {
//       destination: uploadTo,
//       metadata: {
//         contentType: 'application/pdf',
//       }
//     });
//     console.log('PDF успешно загружен');
//   } catch (error) {
//     console.error('Ошибка при загрузке PDF:', error);
//   }
// }

// uploadPDF().then(() => process.exit());

require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

console.log('Текущая директория:', process.cwd());
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY);
console.log('FIREBASE_STORAGE_BUCKET:', process.env.FIREBASE_STORAGE_BUCKET);

// Проверка наличия необходимых переменных окружения
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_STORAGE_BUCKET) {
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
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
} catch (error) {
  console.error('Ошибка при инициализации Firebase:', error);
  process.exit(1);
}

const bucket = admin.storage().bucket();

async function uploadPDF() {
  const filePath = path.join(__dirname, '../../../data/Textbook_5class.pdf');
  const uploadTo = 'textbooks/Textbook_5class.pdf';

  try {
    console.log('Начинаем загрузку PDF...');
    await bucket.upload(filePath, {
      destination: uploadTo,
      metadata: {
        contentType: 'application/pdf',
      }
    });
    console.log('PDF успешно загружен');
  } catch (error) {
    console.error('Ошибка при загрузке PDF:', error);
  }
}

uploadPDF().then(() => process.exit());
