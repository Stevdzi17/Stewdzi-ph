const express    = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path       = require('path');

const app = express();

// ── Middleware ──
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname))); // servira HTML/CSS/JS/slike

// ── Nodemailer transporter ──
// Zameni sa tvojim podacima (ili koristi .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER || 'stevan.radojcin123@gmail.com',
    pass: process.env.MAIL_PASS || 'TVOJA_APP_LOZINKA',  // Google App Password
  },
});

// ── Ruta za slanje emaila ──
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Sva polja su obavezna.' });
  }

  const mailOptions = {
    from: `"Stewdzi Portfolio" <${process.env.MAIL_USER || 'stevan.radojcin123@gmail.com'}>`,
    to:   'stevan.radojcin123@gmail.com',
    replyTo: email,
    subject: `Nova poruka od ${name} — Portfolio kontakt`,
    html: `
      <h2 style="color:#ffa62b;">Nova poruka sa portfolija</h2>
      <p><strong>Ime:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Poruka:</strong></p>
      <p style="background:#f4f4f4;padding:16px;border-radius:8px;">${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email uspešno poslat.' });
  } catch (err) {
    console.error('Email greška:', err);
    res.status(500).json({ error: 'Greška pri slanju emaila.' });
  }
});

// ── Start server ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server radi na http://localhost:${PORT}`);
});
