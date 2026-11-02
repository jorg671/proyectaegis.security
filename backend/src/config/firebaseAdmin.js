const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");

const serviceAccount = require(
    path.join(__dirname, "../../firebase-service-account.json")
);

const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount)
    });

const admin = {
    auth: () => getAuth(app)
};

module.exports = admin;