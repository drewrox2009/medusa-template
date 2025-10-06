#!/usr/bin/env node
/**
 * Enhanced startup script that:
 * 1. Starts the Medusa backend
 * 2. Waits for it to be healthy
 * 3. Automatically creates a publishable key
 * 4. Outputs the key for use in storefront configuration
 */

const { spawn } = require('child_process');
const axios = require('axios');
const { createPublishableKey } = require('./create-publishable-key');

const BACKEND_URL = process.env.BACKEND_PUBLIC_URL;
const MAX_HEALTH_RETRIES = 30; // 5 minutes max wait
const HEALTH_RETRY_DELAY = 10000; // 10 seconds between retries

async function waitForHealthy() {
  console.log('🔍 Waiting for backend to be healthy...');
  
  for (let i = 0; i < MAX_HEALTH_RETRIES; i++) {
    try {
      const response = await axios.get(`${BACKEND_URL}/health`);
      if (response.status === 200) {
        console.log('✅ Backend is healthy!');
        return true;
      }
    } catch (error) {
      // Backend not ready yet
    }
    
    console.log(`⏳ Waiting for backend... (${i + 1}/${MAX_HEALTH_RETRIES})`);
    await new Promise(resolve => setTimeout(resolve, HEALTH_RETRY_DELAY));
  }
  
  throw new Error('❌ Backend failed to become healthy within timeout period');
}

async function startBackendWithKeyGeneration() {
  console.log('🚀 Starting Medusa backend with automatic publishable key generation...');
  
  // Start the backend process
  const backend = spawn('pnpm', ['start'], {
    stdio: 'inherit',
    env: process.env
  });
  
  // Handle backend process events
  backend.on('error', (error) => {
    console.error('❌ Failed to start backend:', error);
    process.exit(1);
  });
  
  backend.on('exit', (code) => {
    console.log(`Backend process exited with code ${code}`);
    process.exit(code);
  });
  
  // Wait a bit for backend to start, then check health and create key
  setTimeout(async () => {
    try {
      await waitForHealthy();
      
      // Small delay to ensure everything is fully initialized
      console.log('⏳ Waiting 10 seconds for full initialization...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      console.log('🔑 Creating publishable key...');
      await createPublishableKey();
      
    } catch (error) {
      console.error('❌ Failed during startup sequence:', error.message);
      console.log('\n📝 Manual steps if auto-creation failed:');
      console.log('1. Ensure backend is accessible at:', BACKEND_URL);
      console.log('2. Run manually: pnpm create-publishable-key');
      console.log('3. Or create via admin UI:', `${BACKEND_URL}/app`);
    }
  }, 30000); // Wait 30 seconds before starting health checks
}

if (require.main === module) {
  startBackendWithKeyGeneration();
}

module.exports = { startBackendWithKeyGeneration, waitForHealthy };
