#!/usr/bin/env tsx

/**
 * Create Test Promo Code Script
 * 
 * This script creates a $1 promo code in Stripe for testing user purchases.
 * The promo code will reduce any purchase to $1.00 for testing purposes.
 * 
 * Usage: tsx scripts/create-test-promo.ts
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function createTestPromoCode() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not found in environment variables');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    console.log('🎫 Creating test promo code in Stripe...\n');

    // Create a 95% off coupon for testing (brings most prices down to ~$1-2)
    const testCoupon = await stripe.coupons.create({
      name: 'Test Access - 95% Off',
      percent_off: 95,
      duration: 'once',
      max_redemptions: 1000,
    });

    console.log('✅ Created test coupon:', testCoupon.id);

    // Create a promotion code that users can enter
    const promoCode = await stripe.promotionCodes.create({
      coupon: testCoupon.id,
      code: 'TEST1DOLLAR',
      active: true,
      max_redemptions: 1000,
      restrictions: {
        first_time_transaction: false,
      },
    });

    console.log('✅ Created promotion code:', promoCode.code);
    console.log('\n🎯 Test Setup Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📋 Promo Code: ${promoCode.code}`);
    console.log(`💰 Discount: ${testCoupon.percent_off}% off`);
    console.log(`🔢 Max Uses: ${promoCode.max_redemptions}`);
    console.log(`✅ Status: ${promoCode.active ? 'Active' : 'Inactive'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Instructions:');
    console.log('1. Go to your purchase page');
    console.log('2. Click "Complete Purchase"');
    console.log('3. On the Stripe checkout page, click "Add promotion code"');
    console.log(`4. Enter: ${promoCode.code}`);
    console.log('5. Complete the test purchase with a test card');
    console.log('\n💳 Test Cards:');
    console.log('• 4242424242424242 (Visa)');
    console.log('• 4000000000003220 (3D Secure)');
    console.log('• 4000000000000002 (Declined)');

  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('⚠️  Promo code already exists. Fetching existing...');
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-06-20',
      });
      
      try {
        const existingPromo = await stripe.promotionCodes.list({
          code: 'TEST1DOLLAR',
          limit: 1,
        });
        
        if (existingPromo.data.length > 0) {
          const promo = existingPromo.data[0];
          console.log('✅ Found existing promo code:', promo.code);
          console.log(`💰 Discount: ${promo.coupon.percent_off}% off`);
          console.log(`✅ Status: ${promo.active ? 'Active' : 'Inactive'}`);
        }
      } catch (fetchError) {
        console.error('❌ Error fetching existing promo:', fetchError);
      }
    } else {
      console.error('❌ Error creating promo code:', error);
      process.exit(1);
    }
  }
}

console.log('🚀 Setting up test promo code for AdvocatePro...');
createTestPromoCode();
