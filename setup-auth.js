#!/usr/bin/env node

/**
 * Authentication Setup Script
 * This script automates the setup of authentication system
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔐 Authentication Setup Script\n');

let hasErrors = false;

// Step 1: Check backend .env file
console.log('📋 Step 1: Checking backend environment configuration...');
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  if (backendEnv.includes('MONGODB_URI') && backendEnv.includes('JWT_SECRET')) {
    console.log('✅ Backend .env file is configured\n');
  } else {
    console.log('⚠️  Backend .env file is missing required variables\n');
    hasErrors = true;
  }
} else {
  console.log('❌ Backend .env file not found\n');
  hasErrors = true;
}

// Step 2: Check and fix frontend .env.development
console.log('📋 Step 2: Checking frontend environment configuration...');
const frontendEnvPath = path.join(__dirname, 'frontend', '.env.development');
if (fs.existsSync(frontendEnvPath)) {
  let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
  
  if (frontendEnv.includes('VITE_AUTH_BYPASS_MODE=true')) {
    console.log('⚠️  Bypass auth is enabled, disabling it...');
    frontendEnv = frontendEnv.replace('VITE_AUTH_BYPASS_MODE=true', 'VITE_AUTH_BYPASS_MODE=false');
    fs.writeFileSync(frontendEnvPath, frontendEnv, 'utf8');
    console.log('✅ Bypass auth disabled\n');
  } else if (frontendEnv.includes('VITE_AUTH_BYPASS_MODE=false')) {
    console.log('✅ Bypass auth is already disabled\n');
  } else {
    console.log('⚠️  Adding VITE_AUTH_BYPASS_MODE=false to .env.development...');
    frontendEnv += '\nVITE_AUTH_BYPASS_MODE=false\n';
    fs.writeFileSync(frontendEnvPath, frontendEnv, 'utf8');
    console.log('✅ Bypass auth disabled\n');
  }
} else {
  console.log('❌ Frontend .env.development file not found\n');
  hasErrors = true;
}

// Step 3: Verify controller exports
console.log('📋 Step 3: Verifying controller exports...');
const controllersDir = path.join(__dirname, 'backend', 'src', 'controllers');
if (fs.existsSync(controllersDir)) {
  const controllers = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));
  let fixedCount = 0;
  
  controllers.forEach(file => {
    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if has both named exports and default export
    const hasNamedExports = /^export const /m.test(content);
    const hasDefaultExport = /^export default \{/m.test(content);
    
    if (hasNamedExports && hasDefaultExport) {
      content = content.replace(/^export const /gm, 'const ');
      fs.writeFileSync(filePath, content, 'utf8');
      fixedCount++;
    }
  });
  
  if (fixedCount > 0) {
    console.log(`✅ Fixed ${fixedCount} controller exports\n`);
  } else {
    console.log('✅ All controller exports are correct\n');
  }
} else {
  console.log('❌ Controllers directory not found\n');
  hasErrors = true;
}

// Step 4: Verify service exports
console.log('📋 Step 4: Verifying service exports...');
const servicesDir = path.join(__dirname, 'frontend', 'src', 'services');
if (fs.existsSync(servicesDir)) {
  const services = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  let fixedCount = 0;
  
  services.forEach(file => {
    const filePath = path.join(servicesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const serviceExportMatch = content.match(/^export const (\w+Service) = \{/m);
    
    if (serviceExportMatch) {
      const serviceName = serviceExportMatch[1];
      const hasDefaultExport = content.includes(`export default ${serviceName}`);
      
      if (!hasDefaultExport) {
        content = content.trimEnd() + `\n\nexport default ${serviceName};\n`;
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
      }
    }
  });
  
  if (fixedCount > 0) {
    console.log(`✅ Fixed ${fixedCount} service exports\n`);
  } else {
    console.log('✅ All service exports are correct\n');
  }
} else {
  console.log('❌ Services directory not found\n');
  hasErrors = true;
}

// Step 5: Create clear storage HTML file
console.log('📋 Step 5: Creating storage clearing tool...');
const clearStorageHtml = path.join(__dirname, 'frontend', 'clear-demo-session.html');
if (!fs.existsSync(clearStorageHtml)) {
  console.log('⚠️  Clear storage tool not found, but it should have been created\n');
} else {
  console.log('✅ Clear storage tool is available\n');
}

// Summary
console.log('═══════════════════════════════════════════════════════════');
console.log('📊 Setup Summary\n');

if (hasErrors) {
  console.log('❌ Setup completed with errors. Please fix the issues above.\n');
  console.log('Next steps:');
  console.log('1. Fix the errors mentioned above');
  console.log('2. Run this script again');
} else {
  console.log('✅ All checks passed!\n');
  console.log('Next steps:');
  console.log('1. Stop all running servers (Ctrl+C)');
  console.log('2. Clear browser storage:');
  console.log('   - Open frontend/clear-demo-session.html in browser');
  console.log('   - Click "Clear All Storage"');
  console.log('3. Start backend server:');
  console.log('   cd backend && npm run dev');
  console.log('4. Start frontend server (in new terminal):');
  console.log('   cd frontend && npm run dev');
  console.log('5. Login at http://localhost:5173/login');
  console.log('   Email: superadmin@example.com');
  console.log('   Password: (your MongoDB password)');
}

console.log('═══════════════════════════════════════════════════════════\n');

console.log('📚 For detailed instructions, see AUTHENTICATION-SETUP.md\n');
