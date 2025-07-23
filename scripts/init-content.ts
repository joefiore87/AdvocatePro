import { initializeContent } from '../src/lib/content-service';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function main() {
  try {
    console.log('Initializing content in Firestore...');
    const result = await initializeContent();
    
    if (result) {
      console.log('✅ Content initialized successfully');
    } else {
      console.log('ℹ️ Content was already initialized');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing content:', error);
    process.exit(1);
  }
}

main();