const nodemailer = require('nodemailer');
const { MailtrapTransport, MailtrapClient } = require("mailtrap");
const { text } = require('body-parser');

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "2e001364ba78e1515a13d9d4e1e20834"
  }
});

const sender = {
  address: "hello@demomailtrap.com",
  name: "Zamzampool",
};

exports.sendEmail = (to, barcodeUrl, name, phone, entry_date, ticket_count, ticket_type) => {
  const mailOptions = {
    from: sender,
    to: to,
    subject: 'Waktunya Bersantai! Tiket Masuk Zamzampool Anda Telah Tersedia',
    html: `  
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tiket Masuk Zamzampool</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              .container {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  padding-bottom: 20px;
              }
              .header img {
                  max-width: 100%;
                  height: auto;
              }
              .ticket {
                  margin: 20px 0;
                  padding: 15px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  background-color: #f9f9f9;
              }
              .barcode {
                  text-align: center;
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 12px;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Selamat Datang di Zamzampool!</h1>
                  <img src="https://mailsend-email-assets.mailtrap.io/j6e1pwqodcgfddhkdnpdn5m6xlb9.jpg" alt="Logo Zamzampool">
              </div>
              <div class="ticket">
                  <h2>Tiket Masuk Anda</h2>
                  <p><strong>Nama Pemesan:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${to}</p>
                  <p><strong>No. Telepon:</strong> ${phone}</p>
                  <p><strong>Tipe Tiket:</strong> ${ticket_type}</p>
                  <p><strong>Jumlah Tiket:</strong> ${ticket_count}</p>
                  <p><strong>Tanggal Masuk:</strong> ${entry_date}</p>
              </div>
              <div class="barcode">
                  <h3>Barcode Tiket Anda</h3>
                  <img src="cid:barcode" alt="Barcode Tiket" style="max-width: 100%; height: auto;">
              </div>
              <div class="footer">
                  <p><strong>Note:</strong> QR Code hanya berlaku untuk 3 hari ke depan dari tanggal masuk.</p>
                  <p>Terima kasih telah memesan tiket di Zamzampool. Kami berharap Anda menikmati waktu Anda di sini!</p>
                  <p>Untuk pertanyaan lebih lanjut, silakan hubungi kami di <a href="mailto:support@zamzampool.com">support@zamzampool.com</a>.</p>
              </div>
          </div>
      </body>
      </html>`,
    attachments: [{
      filename: 'barcode.png',
      path: barcodeUrl,
      cid: 'barcode', // Menyertakan 'cid' untuk lampiran
      contentDisposition: 'inline'
    }]
  };

  return transporter.sendMail(mailOptions)
    .then(response => {
      console.log('Email sent successfully:', response);
      return response; // Mengembalikan response dari pengiriman email
    })
    .catch(error => {
      console.error('Error sending email:', error); // Menampilkan rincian kesalahan
      throw error; // Mengangkat kembali kesalahan untuk penanganan lebih lanjut jika perlu
    });
};
