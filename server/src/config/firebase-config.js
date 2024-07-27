const admin = require('firebase-admin');

const serviceAccount = require('./path/to/your/serviceAccountKey.json');

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com"
};

module.exports = {
  credential: admin.credential.cert(serviceAccount),
};
