const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('./service-account-key.json'))
});

const email = 'joejfiore@gmail.com';

admin.auth().getUserByEmail(email)
  .then(user => {
    console.log('UID:', user.uid);
    return admin.firestore().collection('users').doc(user.uid).set({
      subscriptionStatus: 'active',
      role: 'admin',
      stripeCustomerId: 'manual_override',
      email: email,
      createdAt: new Date()
    });
  })
  .then(() => {
    console.log('✅', email, 'created and marked as paid admin');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌', err.message);
    process.exit(1);
  });
