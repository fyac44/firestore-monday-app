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
  static async updateItems(items) {
    try {
      var mondayItemNames = [];
      items.map( item => {
        mondayItemNames.push(item.name);
        colRef.add({
          name: item.name,
          boardId: item.board.id,
          groupId: item.group.id,
          groupTitle: item.group.title
        });
      });
      // delete unexistent documents
      colRef.get().map(doc => {
        if (!mondayItemNames.includes(doc.data().name)) {
          doc.delete();
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