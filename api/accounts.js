const fs = require('fs');
const path = require('path');

const ACCOUNTS_FILE = path.join(__dirname, 'accounts.json');

// Initialize accounts file if it doesn't exist
if (!fs.existsSync(ACCOUNTS_FILE)) {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify([]));
}

function getAccounts() {
    const data = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
    return JSON.parse(data);
}

function saveAccounts(accounts) {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
}

// This would be an Express.js or similar route handler in a real API
// For this simulation, we'll just export functions

// Simulate GET /api/accounts
function handleGetAccounts(req, res) {
    const accounts = getAccounts();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(accounts));
}

// Simulate POST /api/accounts (for saving/updating accounts)
function handlePostAccount(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const newAccount = JSON.parse(body);
        let accounts = getAccounts();

        const existingAccountIndex = accounts.findIndex(acc => acc.name === newAccount.name);

        if (existingAccountIndex > -1) {
            // Update existing account if password is different
            if (accounts[existingAccountIndex].password !== newAccount.password) {
                accounts[existingAccountIndex] = { ...accounts[existingAccountIndex], ...newAccount };
            }
        } else {
            // Add new account
            accounts.push(newAccount);
        }

        saveAccounts(accounts);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Account saved successfully' }));
    });
}

module.exports = {
    handleGetAccounts,
    handlePostAccount,
    getAccounts, // Export for direct use in TriX Executor if needed
    saveAccounts // Export for direct use in TriX Executor if needed
};
