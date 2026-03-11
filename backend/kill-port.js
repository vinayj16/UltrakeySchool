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

  // Extract PID from netstat output
  let pid;
  if (platform === 'win32') {
    // Windows netstat output: "TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       2140"
    // PID is the last column
    const lines = stdout.trim().split('\n');
    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      const parts = lastLine.trim().split(/\s+/);
      pid = parts[parts.length - 1]; // Last column is PID
    }
  } else {
    // Unix-like systems
    pid = stdout.trim().split('\n')[0];
  }

  if (!pid || isNaN(pid)) {
    console.log(`✅ No valid process found on port ${port}`);
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
