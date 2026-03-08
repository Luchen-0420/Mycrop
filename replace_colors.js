const fs = require('fs');
const path = require('path');

const files = [
    'packages/client/src/pages/pr/Contacts.jsx',
    'packages/client/src/pages/pr/Gifts.jsx',
    'packages/client/src/pages/pr/Maintenance.jsx',
    'packages/client/src/pages/admin/Assets.jsx',
    'packages/client/src/pages/admin/Credentials.jsx',
    'packages/client/src/pages/admin/Inventory.jsx',
    'packages/client/src/pages/admin/Procurement.jsx'
];

files.forEach(f => {
    const fullPath = path.join('d:/idea/manage', f);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');

        // Cards replacement: replace the common long class strings with corp-card
        content = content.replace(/bg-corporate-900\/50 rounded-xl p-5 border border-corporate-700 hover:border-corporate-500 transition-colors shadow-sm/g, 'corp-card p-5');
        content = content.replace(/bg-corporate-800 rounded-xl p-5 border transition-colors border-corporate-danger\/50/g, 'corp-card p-5 border-corp-danger');
        content = content.replace(/bg-corporate-800 rounded-xl p-5 border transition-colors border-corporate-700 hover:border-corporate-600/g, 'corp-card p-5');

        // General color mappings
        content = content.replace(/corporate-800/g, 'corp-surface');
        content = content.replace(/corporate-900/g, 'corp-bg');
        content = content.replace(/corporate-700/g, 'corp-border');
        content = content.replace(/corporate-600/g, 'corp-border');
        content = content.replace(/corporate-500/g, 'corp-muted');
        content = content.replace(/corporate-primary/g, 'corp-accent');
        content = content.replace(/corporate-accent/g, 'corp-accent');
        content = content.replace(/corporate-text-secondary/g, 'corp-muted');
        content = content.replace(/corporate-success/g, 'corp-success');
        content = content.replace(/corporate-warning/g, 'corp-warning');
        content = content.replace(/corporate-danger/g, 'corp-danger');

        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${f}`);
    } else {
        console.log(`File not found: ${f}`);
    }
});
