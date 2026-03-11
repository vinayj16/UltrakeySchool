import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesDir = path.join(__dirname, 'src', 'services');

console.log('--- Adding Default Exports to Service Files ---\n');

let fixedCount = 0;
let skippedCount = 0;

// Get all service files
const files = fs.readdirSync(servicesDir).filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file has named export like 'export const xxxService = {'
  const serviceExportMatch = content.match(/^export const (\w+Service) = \{/m);
  
  if (serviceExportMatch) {
    const serviceName = serviceExportMatch[1];
    
    // Check if it already has a default export for this service
    const hasDefaultExport = content.includes(`export default ${serviceName}`);
    
    if (!hasDefaultExport) {
      // Add default export at the end
      content = content.trimEnd() + `\n\nexport default ${serviceName};\n`;
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${file} (added default export for ${serviceName})`);
      fixedCount++;
    } else {
      console.log(`✓ Skip: ${file} (already has default export)`);
      skippedCount++;
    }
  } else {
    console.log(`✓ Skip: ${file} (no service export pattern found)`);
    skippedCount++;
  }
});

console.log('\n--- Summary ---');
console.log(`Fixed: ${fixedCount}`);
console.log(`Skipped: ${skippedCount}`);
console.log(`Total: ${files.length}\n`);
