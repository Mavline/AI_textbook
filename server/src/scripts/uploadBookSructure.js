require('dotenv').config({ path: '../../../.env' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialisation Firebase
const serviceAccount = require('../../../ai-textbook-firebase-adminsdk-r1xsq-3397157646.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
  
  const db = admin.firestore();
  
  // Чтение JSON файла
  const bookStructure = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../data/math-textbook-structure.json'), 'utf8'));
  

// Функция для рекурсивной загрузки структуры в Firestore
async function uploadStructure(data, collectionPath) {
  for (const item of data) {
    const docRef = db.collection(collectionPath).doc();
    await docRef.set(item);
    if (item.sections) {
      await uploadStructure(item.sections, `${collectionPath}/${docRef.id}/sections`);
    }
  }
}

// Загрузка структуры книги
uploadStructure(bookStructure.chapters, 'book')
  .then(() => console.log('Book structure uploaded successfully'))
  .catch((error) => console.error('Error uploading book structure:', error))
  .finally(() => process.exit());
