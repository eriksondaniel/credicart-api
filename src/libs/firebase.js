import * as admin from "firebase-admin";
var serviceAccount = require("../../credicart-app-firebase-adminsdk-b2uj9-5fed266bc9.json");

module.exports = () => {
    const adminFb = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://credicart-app.firebaseio.com"
    });
    return adminFb;
};
