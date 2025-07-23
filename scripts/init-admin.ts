import { initializeAdminUser } from '../src/lib/roles';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  return new Promise<void>((resolve) => {
    rl.question('Enter the email address for the admin user: ', async (email) => {
      if (!email || !email.includes('@')) {
        console.error('Invalid email address');
        rl.close();
        resolve();
        return;
      }

      try {
        console.log(`Setting ${email} as an admin user...`);
        const result = await initializeAdminUser(email);
        
        if (result) {
          console.log(`✅ Successfully set ${email} as an admin user`);
        } else {
          console.log(`ℹ️ User ${email} already exists or could not be set as admin`);
        }
      } catch (error) {
        console.error('❌ Error setting admin user:', error);
      } finally {
        rl.close();
        resolve();
      }
    });
  });
}

main().then(() => process.exit(0)).catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});