import fs from 'node:fs';

const filePath = 'lib/StyleDictionary.js';
const indexContent = fs.readFileSync(filePath, 'utf-8');
const { version } = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const newIndexContent = indexContent.replace('<? version placeholder ?>', version);
fs.writeFileSync(filePath, newIndexContent, 'utf-8');
