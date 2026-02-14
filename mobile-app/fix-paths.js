const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');

    // Replace absolute paths with relative ones
    // e.g., src="/_expo/..." -> src="_expo/..."
    // e.g., href="/favicon.ico" -> href="favicon.ico"
    content = content.replace(/src="\//g, 'src="');
    content = content.replace(/href="\//g, 'href="');

    fs.writeFileSync(indexPath, content);
    console.log('Successfully converted absolute paths to relative in index.html');
} else {
    console.error('index.html not found in dist folder');
    process.exit(1);
}
