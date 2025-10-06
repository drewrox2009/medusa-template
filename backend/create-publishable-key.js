#!/usr/bin/env node
/**
 * Script to create a publishable key for Medusa and output it for use in storefront
 * Run this after the backend is deployed and accessible
 */

const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_PUBLIC_URL;
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD;

if (!BACKEND_URL) {
  console.error('❌ BACKEND_PUBLIC_URL environment variable is required');
  process.exit(1);
}

if (!ADMIN_EMAIL) {
  console.error('❌ MEDUSA_ADMIN_EMAIL environment variable is required');
  process.exit(1);
}

if (!ADMIN_PASSWORD) {
  console.error('❌ MEDUSA_ADMIN_PASSWORD environment variable is required');
  process.exit(1);
}

async function createPublishableKey() {
  try {
    console.log(`Creating publishable key for ${BACKEND_URL}...`);
    
    // 1. Login to admin
    const loginResponse = await axios.post(`${BACKEND_URL}/admin/auth/token`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    const { access_token } = loginResponse.data;
    
    // 2. Create publishable key
    const keyResponse = await axios.post(`${BACKEND_URL}/admin/publishable-api-keys`, {
      title: 'Storefront Key (Auto-generated)'
    }, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const publishableKey = keyResponse.data.publishable_api_key.id;
    
    console.log('\n✅ SUCCESS! Use this publishable key in your storefront:');
    console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableKey}`);
    console.log('\nCopy this value to:');
    console.log('1. Coolify Storefront Build Args: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY');
    console.log('2. Coolify Storefront Environment: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY');
    console.log('3. Rebuild your storefront service');
    
    return publishableKey;
    
  } catch (error) {
    console.error('❌ Failed to create publishable key:', error.response?.data || error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure backend is running and accessible');
    console.log('2. Check MEDUSA_ADMIN_EMAIL and MEDUSA_ADMIN_PASSWORD are correct');
    console.log('3. Try visiting the admin manually:', `${BACKEND_URL}/app`);
    process.exit(1);
  }
}

if (require.main === module) {
  createPublishableKey();
}

module.exports = { createPublishableKey };
