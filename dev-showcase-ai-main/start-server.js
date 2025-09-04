import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverPath = join(__dirname, 'server', 'server.js');

console.log('🚀 Starting ShowWork backend server...');
console.log('📁 Server path:', serverPath);

const serverProcess = spawn('node', [serverPath], {
  stdio: 'inherit',
  cwd: __dirname
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

serverProcess.on('exit', (code, signal) => {
  console.log(`🛑 Server process exited with code ${code} and signal ${signal}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n🔄 Stopping server...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});