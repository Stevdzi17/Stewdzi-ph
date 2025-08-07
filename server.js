const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Podesi transporter za Gmail SMTP


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server radi na portu ${3000}`));

// Start server
app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${3000}`);
});
