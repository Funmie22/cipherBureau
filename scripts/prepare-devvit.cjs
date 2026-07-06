const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist', 'devvit-package');

function ensure(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copy(src, dest) {
  ensure(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyFolder(srcDir, destDir) {
  ensure(destDir);
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyFolder(src, dest);
    else copy(src, dest);
  }
}

(async function() {
  console.log('Preparing Devvit package...');
  // clean
  if (fs.existsSync(out)) fs.rmSync(out, { recursive: true, force: true });
  ensure(out);

  // copy manifest
  copy(path.join(root, 'devvit.yaml'), path.join(out, 'devvit.yaml'));

  // copy server-side code (Devvit handlers)
  copy(path.join(root, 'src', 'main.tsx'), path.join(out, 'src', 'main.tsx'));
  copyFolder(path.join(root, 'backend'), path.join(out, 'backend'));

  // copy webview build
  const webDist = path.join(root, 'webview', 'dist');
  if (!fs.existsSync(webDist)) {
    console.error('webview/dist not found — run `npm run build:webview` first');
    process.exit(1);
  }
  copyFolder(webDist, path.join(out, 'webview'));

  // include package.json with minimal metadata
  const pkg = require(path.join(root, 'package.json'));
  const minimal = { name: pkg.name, version: pkg.version, description: pkg.description };
  fs.writeFileSync(path.join(out, 'package.json'), JSON.stringify(minimal, null, 2));

  console.log('Devvit package prepared at', out);
})();
