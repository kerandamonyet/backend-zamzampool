const midtransClient = require('midtrans-client');

let snap;
try {
  snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-8aOMBz0EBRRvCvAY8GUne9R7',
  });
} catch (error) {
  console.error("Failed to initialize Snap:", error);
}

module.exports = snap;
