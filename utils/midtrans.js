const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
    isProduction: false, // Ganti ke true untuk production
    serverKey: 'SB-Mid-server-8aOMBz0EBRRvCvAY8GUne9R7'
});

module.exports = snap;
