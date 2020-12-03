// Initialize firebase app
var admin = require("firebase-admin");
var serviceAccount = require("../firebaseAdminKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-monday-30a2d.firebaseio.com"
});
const colName = "mondayItems";
const db = admin.firestore();
const colRef = db.collection(colName);


class FirebaseService {
  static async updateItems(items, boardId) {
    try {
      var mondayItemNames = [];
      items.filter(item => (item.board.id == boardId)).map( item => {
        mondayItemNames.push(item.name);
        colRef.doc(item.name).set(item);
      });
      // delete unexistent documents
      const snapshot = await colRef.get();
      snapshot.forEach(doc => {
        if (!mondayItemNames.includes(doc.data().name)) {
          colRef.doc(doc.id).delete();
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  static async getItems() {
    try {
      const firestoreItemNames = colRef.get().map(doc => doc.data().name);
      return firestoreItemNames;
    }
    catch (err) {
      console.log(err);
    }
  }
}
  
module.exports = { FirebaseService };