const midtransClient = require('midtrans-client');

let snap;
try {
<<<<<<< HEAD
  snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-8aOMBz0EBRRvCvAY8GUne9R7',
  });
} catch (error) {
  console.error("Failed to initialize Snap:", error);
=======
    snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: 'SB-Mid-server-8aOMBz0EBRRvCvAY8GUne9R7',
    });
} catch (error) {
    console.error("Failed to initialize Snap:", error);
}

if (!snap) {
    console.error("Snap is not initialized.");
>>>>>>> 720a17c (Add Compression, Helmet, RateLimit)
}

module.exports = snap;
