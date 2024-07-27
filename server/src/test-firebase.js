const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const admin = require('./config/firebase-config');

console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

async function testFirebaseConnection() {
  try {
    const collections = await admin.firestore().listCollections();
    console.log('Успешное подключение к Firebase. Список коллекций:', collections.map(col => col.id));
  } catch (error) {
    console.error('Ошибка при подключении к Firebase:', error);
  }
}

testFirebaseConnection();
