const admin = require('firebase-admin');

if (!process.env.SERVICE_ACCOUNT_KEY_JSON) {
  console.error('❌ SERVICE_ACCOUNT_KEY_JSON environment variable not set.');
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.error('❌ Please provide an email address as a command-line argument.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT_KEY_JSON))
});

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
