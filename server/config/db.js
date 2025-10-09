const admin = require("firebase-admin");

// TODO: Replace with your service account key file
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eventboard-6c660.firebaseio.com"
});

console.log("✅ Firebase connected and healthy.");

module.exports = {
  db: admin.firestore(),
};
