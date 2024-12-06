const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/category-request', async (req, res) => {
  const { nomCategorie, description, user } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'houssemlangar17@gmail.com',
        pass: 'kwmj hnpt xvhv ivvc',
      },
    });

    const mailOptions = {
      from: '"SoukNet" <houssemlangar17@gmail.com>',
      to: 'houssemlangar3@gmail.com',
      subject: 'Nouvelle demande d\'ajout de catégorie',
      html: `
        <p><strong>Nom de la catégorie :</strong> ${nomCategorie}</p>
        <p><strong>Description :</strong> ${description}</p>
        <p><strong>Utilisateur :</strong> ${user.email}</p>
        <p><strong>Date :</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Demande enregistrée et email envoyé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'envoi de l\'email.' });
  }
});

module.exports = router;
