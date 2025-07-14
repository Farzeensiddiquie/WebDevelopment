const crypto = require('crypto');

console.log('🔐 Generating secure JWT secrets...\n');

// Generate secure random strings for JWT secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');

console.log('✅ Generated secure JWT secrets:');
console.log('\nJWT_SECRET:');
console.log(jwtSecret);
console.log('\nJWT_REFRESH_SECRET:');
console.log(jwtRefreshSecret);
console.log('\n📝 Copy these values to your .env file to replace the placeholder values.');
console.log('\n⚠️  Keep these secrets secure and never commit them to version control!'); 