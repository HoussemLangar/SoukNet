const express = require('express');
const cors = require('cors');
const emailRouter = require('./routes/email'); 
const emailCategory = require('./routes/category'); 



const app = express();

app.use(cors({
  origin: ['http://localhost:3000','https://souknet-ce8dc.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api', emailRouter, emailCategory);

app.listen(5000, () => {
  console.log('Backend démarré sur http://localhost:5000');
});
