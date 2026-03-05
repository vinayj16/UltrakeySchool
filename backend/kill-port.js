#!/usr/bin/env node

import { exec } from 'child_process';
import os from 'os';

const port = process.argv[2] || 5000;

console.log(`🔄 Attempting to kill process on port ${port}...`);

const platform = os.platform();
let command;

if (platform === 'win32') {
  // Windows
  command = `netstat -ano | findstr :${port} | findstr LISTENING`;
} else {
  // Unix-like systems (Linux, macOS)
  command = `lsof -ti:${port}`;
}

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.log(`✅ No process found on port ${port}`);
    process.exit(0);
  }

  const pid = stdout.trim().split('\n')[0];
  if (!pid) {
    console.log(`✅ No process found on port ${port}`);
    process.exit(0);
  }

  console.log(`🔧 Killing process ${pid} on port ${port}...`);

  if (platform === 'win32') {
    exec(`taskkill /PID ${pid} /F`, (killError) => {
      if (killError) {
        console.log(`⚠️  Failed to kill process ${pid}: ${killError.message}`);
      } else {
        console.log(`✅ Successfully killed process on port ${port}`);
      }
      process.exit(0);
    });
  } else {
    exec(`kill -9 ${pid}`, (killError) => {
      if (killError) {
        console.log(`⚠️  Failed to kill process ${pid}: ${killError.message}`);
      } else {
        console.log(`✅ Successfully killed process on port ${port}`);
      }
      process.exit(0);
    });
  }
});
