const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');

  // Replace absolute paths with relative ones
  content = content.replace(/src="\//g, 'src="');
  content = content.replace(/href="\//g, 'href="');

  // Inject a special routing fix for Electron custom protocol
  const routingFix = `
    <script>
      (function() {
        // If we are on our custom app:// protocol, ensure history matches
        if (window.location.protocol === 'app:') {
          window.history.replaceState(null, '', 'app://./');
        }
      })();
    </script>
    `;

  if (content.includes('<head>')) {
    content = content.replace('<head>', '<head>' + routingFix);
  }

  fs.writeFileSync(indexPath, content);
  console.log('Successfully applied custom protocol and routing fixes to index.html');
} else {
  console.error('index.html not found in dist folder');
  process.exit(1);
}
