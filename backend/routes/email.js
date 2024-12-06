const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

router.post('/send-email', async (req, res) => {
  const { email, firstName, cartItems, adresse, paymentMethod } = req.body;

  try {
    const doc = new jsPDF();
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const logoPath = path.join(__dirname, 'logo512.png');
    const logoData = fs.readFileSync(logoPath).toString('base64'); // Convertir en base64

    doc.addImage(logoData, 'PNG', 10, 10, 20, 20);

    doc.setFontSize(18);
    doc.text('Document de Facturation', 110, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text('SoukNet', 110, 30, null, null, 'center');
    doc.text(`Date: ${formattedDate}`, 150, 40);
    doc.text(`Nom du client: ${firstName}`, 14, 50);
    doc.text(`Méthode de paiement: ${paymentMethod}`, 14, 60);

    doc.setFontSize(14);
    doc.text('Adresse de Livraison :', 14, 70);
    doc.autoTable({
      startY: 75,
      head: [['Rue', 'Ville', 'Code Postal', 'Téléphone']],
      body: [[adresse.rue, adresse.ville, adresse.codePostal, adresse.telephone]],
      margin: { horizontal: 14 },
    });

    doc.text('Contenu du Panier :', 14, doc.lastAutoTable.finalY + 10);
    const cartData = cartItems.map((item) => [
      item.nom,
      item.quantity,
      (item.prix * item.quantity).toFixed(2) + ' DT',
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Produit', 'Quantité', 'Prix (DT)']],
      body: cartData,
      margin: { horizontal: 14 },
    });

    const total = cartItems
      .reduce((sum, item) => sum + item.prix * item.quantity, 0)
      .toFixed(2);
    doc.text(`Total: ${total} DT`, 14, doc.lastAutoTable.finalY + 10);

    const pdfPath = path.join(__dirname, 'facture.pdf');
    const pdfBytes = doc.output('arraybuffer');
    fs.writeFileSync(pdfPath, Buffer.from(pdfBytes));

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'houssemlangar17@gmail.com',
        pass: 'kwmj hnpt xvhv ivvc',
      },
    });

    const mailOptions = {
      from: '"SoukNet" <houssemlangar17@gmail.com>',
      to: email,
      subject: 'Confirmation de paiement',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              background-color: #4CAF50;
              color: #ffffff;
              text-align: center;
              padding: 20px;
            }
            .email-header h1 {
              margin: 0;
              font-size: 24px;
            }
            .email-body {
              padding: 20px;
              color: #333333;
            }
            .email-body p {
              line-height: 1.6;
            }
            .email-footer {
              background-color: #f1f1f1;
              text-align: center;
              padding: 15px;
              font-size: 12px;
              color: #777777;
            }
            .button {
              display: inline-block;
              background-color: #4CAF50;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>SoukNet</h1>
            </div>
            <div class="email-body">
              <p>Bonjour <strong>${firstName}</strong>,</p>
              <p>Nous avons le plaisir de vous informer que votre paiement a été confirmé avec succès.</p>
              <p>Veuillez trouver votre facture en pièce jointe pour vos archives.</p>
              <a href="#" class="button">Télécharger la Facture</a>
            </div>
            <div class="email-footer">
              <p>Merci d'avoir choisi SoukNet. Si vous avez des questions, n'hésitez pas à nous contacter.</p>
              <p>© 2024 SoukNet. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'facture.pdf',
          path: pdfPath,
        },
      ],
    };    

    await transporter.sendMail(mailOptions);
    fs.unlinkSync(pdfPath);
    res.status(200).json({ message: 'Email envoyé avec succès.' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email.' });
  }
});

module.exports = router;
