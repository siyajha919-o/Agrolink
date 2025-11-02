const admin = require('firebase-admin');

let initialized = false;
const initFirebase = (serviceAccountJson) => {
  if (initialized) return;
  try {
    const obj = typeof serviceAccountJson === 'string' ? JSON.parse(serviceAccountJson) : serviceAccountJson;
    admin.initializeApp({ credential: admin.credential.cert(obj) });
    initialized = true;
  } catch (err) {
    console.warn('Firebase initialization skipped (no valid service account)');
  }
};

const sendNotification = async (token, payload) => {
  if (!initialized) return;
  try {
    const message = {
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {}
    };
    const res = await admin.messaging().send(message);
    return res;
  } catch (err) {
    console.error('Notification error', err.message);
  }
};

module.exports = { initFirebase, sendNotification };
