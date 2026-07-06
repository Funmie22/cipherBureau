const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const pkgDir = path.join(root, 'dist', 'devvit-package');
const outZip = path.join(root, 'dist', `${require(path.join(root, 'package.json')).name}-devvit.zip`);

if (!fs.existsSync(pkgDir)) {
  console.error('Package directory not found. Run `npm run package:devvit` first.');
  process.exit(1);
}

try {
  if (process.platform === 'win32') {
    const ps = `Compress-Archive -Path '${pkgDir}\\*' -DestinationPath '${outZip}' -Force`;
    execSync(`powershell -Command "${ps}"`, { stdio: 'inherit' });
  } else {
    execSync(`zip -r '${outZip}' '${pkgDir}'`, { stdio: 'inherit' });
  }
  console.log('Created', outZip);
} catch (e) {
  console.error('Failed to create zip:', e.message);
  process.exit(1);
}
