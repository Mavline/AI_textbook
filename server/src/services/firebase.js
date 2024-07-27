const admin = require('firebase-admin');

class FirebaseService {
  constructor() {
    this.db = admin.firestore();
    this.storage = admin.storage();
  }

  async addDocument(collection, data) {
    const docRef = await this.db.collection(collection).add(data);
    return docRef.id;
  }

  async getDocument(collection, id) {
    const doc = await this.db.collection(collection).doc(id).get();
    return doc.exists ? doc.data() : null;
  }

  async uploadFile(bucket, filePath, destination) {
    await this.storage.bucket(bucket).upload(filePath, {
      destination: destination,
    });
  }

  async getFileUrl(bucket, filePath) {
    const file = this.storage.bucket(bucket).file(filePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });
    return url;
  }
}

module.exports = new FirebaseService();
