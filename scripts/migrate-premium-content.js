const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://advocate-empower-default-rtdb.firebaseio.com/',
  projectId: 'advocate-empower'
});

const db = admin.firestore();
db.settings({ databaseId: 'turboparent' });

async function migrateToPremiumContent() {
  console.log('🚀 Starting premium content migration...');
  
  try {
    // 1. Move letterTemplates to premiumContent
    console.log('📝 Moving letterTemplates to premium content...');
    
    const letterTemplatesRef = db.collection('content').doc('letterTemplates');
    const letterTemplatesSnap = await letterTemplatesRef.get();
    
    if (letterTemplatesSnap.exists) {
      const letterTemplatesData = letterTemplatesSnap.data();
      
      // Create in premiumContent
      await db.collection('premiumContent').doc('letterTemplates').set(letterTemplatesData);
      
      // Copy items subcollection
      const itemsRef = letterTemplatesRef.collection('items');
      const itemsSnap = await itemsRef.get();
      
      const batch = db.batch();
      itemsSnap.docs.forEach(doc => {
        const newRef = db.collection('premiumContent').doc('letterTemplates').collection('items').doc(doc.id);
        batch.set(newRef, doc.data());
      });
      await batch.commit();
      
      console.log(`✅ Moved ${itemsSnap.size} letter templates to premium content`);
    }
    
    // 2. Move educationalModules to premiumContent
    console.log('📚 Moving educationalModules to premium content...');
    
    const modulesRef = db.collection('content').doc('educationalModules');
    const modulesSnap = await modulesRef.get();
    
    if (modulesSnap.exists) {
      const modulesData = modulesSnap.data();
      
      // Create in premiumContent
      await db.collection('premiumContent').doc('educationalModules').set(modulesData);
      
      // Copy items subcollection
      const itemsRef = modulesRef.collection('items');
      const itemsSnap = await itemsRef.get();
      
      const batch = db.batch();
      itemsSnap.docs.forEach(doc => {
        const newRef = db.collection('premiumContent').doc('educationalModules').collection('items').doc(doc.id);
        batch.set(newRef, doc.data());
      });
      await batch.commit();
      
      console.log(`✅ Moved ${itemsSnap.size} educational modules to premium content`);
    }
    
    // 3. Create sample templates in public content
    console.log('🎁 Creating sample templates for public access...');
    
    await db.collection('content').doc('sampleTemplates').set({
      id: 'sampleTemplates',
      name: 'Sample Templates',
      description: 'Free sample templates to preview our toolkit'
    });
    
    // Create sample items
    const sampleItems = [
      {
        id: 'sampleEvaluation',
        type: 'textarea',
        value: `Dear [Principal Name],

I am writing to formally request a comprehensive evaluation for my child, [Child Name], who is currently in [Grade] at [School Name].

I have concerns about [Child's academic/behavioral concerns] and believe an evaluation is necessary to determine if special education services are needed.

Please consider this letter my formal request for an evaluation under the Individuals with Disabilities Education Act (IDEA).

Sincerely,
[Parent Name]

--- This is a SAMPLE. Get the full template library with purchase! ---`,
        lastUpdated: new Date().toISOString(),
        category: 'sampleTemplates',
        isSample: true
      },
      {
        id: 'sampleMeetingRequest',
        type: 'textarea',
        value: `Dear [Special Education Coordinator],

I am writing to request an IEP meeting for my child, [Child Name], Student ID [Student ID].

I would like to discuss [specific concerns or goals] and believe that adjustments to my child's current IEP may be necessary.

Please let me know your availability for the coming weeks.

Thank you,
[Parent Name]

--- This is a SAMPLE. Get 20+ complete templates with purchase! ---`,
        lastUpdated: new Date().toISOString(),
        category: 'sampleTemplates',
        isSample: true
      }
    ];
    
    const sampleBatch = db.batch();
    sampleItems.forEach(item => {
      const ref = db.collection('content').doc('sampleTemplates').collection('items').doc(item.id);
      sampleBatch.set(ref, item);
    });
    await sampleBatch.commit();
    
    console.log(`✅ Created ${sampleItems.length} sample templates`);
    
    // 4. Update system tracking
    await db.collection('system').doc('migration').set({
      premiumContentMigrated: true,
      migratedAt: new Date().toISOString(),
      version: '2.0'
    });
    
    console.log('🎉 Premium content migration completed successfully!');
    console.log('\n📊 Migration Summary:');
    console.log('• Moved letterTemplates to premiumContent collection');
    console.log('• Moved educationalModules to premiumContent collection');
    console.log('• Created sample templates for public access');
    console.log('• Marketing content (pageContent, features) remains public');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration
migrateToPremiumContent();
