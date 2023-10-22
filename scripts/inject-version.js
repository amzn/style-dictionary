import fs from 'node:fs';

const indexContent = fs.readFileSync('index.js', 'utf-8');
const { version } = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const newIndexContent = indexContent.replace('<? version placeholder ?>', version);
fs.writeFileSync('index.js', newIndexContent, 'utf-8');
