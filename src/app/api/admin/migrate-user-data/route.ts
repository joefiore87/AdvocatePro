import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreAdmin, getAuthAdmin } from '@/lib/firebase-admin';

/**
 * ADMIN-ONLY Migration Script
 * Migrates existing user data from email-based document IDs to UID-based IDs
 * 
 * WARNING: This should only be run once during deployment
 * Call with admin credentials: POST /api/admin/migrate-user-data
 */

export async function POST(req: NextRequest) {
  try {
    // Verify admin access (you should add proper admin authentication here)
    const migrationKey = req.headers.get('X-Migration-Key');
    
    // Simple protection - in production, use proper admin auth
    if (!migrationKey || migrationKey !== process.env.MIGRATION_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - Migration key required' },
        { status: 403 }
      );
    }

    const db = await getFirestoreAdmin();
    const auth = await getAuthAdmin();
    
    if (!db || !auth) {
      return NextResponse.json(
        { error: 'Firebase services not available' },
        { status: 500 }
      );
    }

    const migrationResults = {
      users: { migrated: 0, errors: [] as string[] },
      payments: { migrated: 0, errors: [] as string[] },
      subscriptions: { migrated: 0, errors: [] as string[] }
    };

    // Get all documents from each collection
    const collections = ['users', 'payments', 'subscriptions'];
    
    for (const collectionName of collections) {
      console.log(`Starting migration for ${collectionName} collection...`);
      
      const snapshot = await db.collection(collectionName).get();
      
      for (const doc of snapshot.docs) {
        const docId = doc.id;
        const data = doc.data();
        
        // Check if document ID looks like an email
        if (docId.includes('@')) {
          try {
            // Find the corresponding Firebase user
            const user = await auth.getUserByEmail(docId);
            
            // Create new document with UID as ID
            const newDocData = {
              ...data,
              firebaseUid: user.uid,
              email: docId, // Store email as field
              migratedAt: new Date(),
              originalDocId: docId
            };
            
            // Create new document with UID
            await db.collection(collectionName).doc(user.uid).set(newDocData);
            
            // Delete old document
            await doc.ref.delete();
            
            migrationResults[collectionName as keyof typeof migrationResults].migrated++;
            console.log(`✅ Migrated ${collectionName}/${docId} → ${user.uid}`);
            
          } catch (error) {
            const errorMsg = `Failed to migrate ${collectionName}/${docId}: ${error}`;
            console.error(errorMsg);
            migrationResults[collectionName as keyof typeof migrationResults].errors.push(errorMsg);
          }
        } else {
          console.log(`⏭️ Skipping ${collectionName}/${docId} (already UID-based)`);
        }
      }
    }

    console.log('Migration completed:', migrationResults);
    
    return NextResponse.json({
      success: true,
      message: 'User data migration completed',
      results: migrationResults
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Check migration status
export async function GET(req: NextRequest) {
  try {
    const migrationKey = req.headers.get('X-Migration-Key');
    
    if (!migrationKey || migrationKey !== process.env.MIGRATION_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - Migration key required' },
        { status: 403 }
      );
    }

    const db = await getFirestoreAdmin();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }

    const status = {
      users: { emailBasedDocs: 0, uidBasedDocs: 0 },
      payments: { emailBasedDocs: 0, uidBasedDocs: 0 },
      subscriptions: { emailBasedDocs: 0, uidBasedDocs: 0 }
    };

    const collections = ['users', 'payments', 'subscriptions'];
    
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      
      snapshot.docs.forEach(doc => {
        const docId = doc.id;
        if (docId.includes('@')) {
          status[collectionName as keyof typeof status].emailBasedDocs++;
        } else {
          status[collectionName as keyof typeof status].uidBasedDocs++;
        }
      });
    }

    return NextResponse.json({
      success: true,
      migrationStatus: status,
      needsMigration: Object.values(status).some(collection => collection.emailBasedDocs > 0)
    });

  } catch (error) {
    console.error('Error checking migration status:', error);
    return NextResponse.json(
      { error: 'Failed to check migration status' },
      { status: 500 }
    );
  }
}
