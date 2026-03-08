import { initDb } from './src/db/init.js';

initDb().then(() => {
    console.log('Init complete.');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
