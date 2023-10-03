const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Servir les fichiers statiques depuis le répertoire 'public'
app.use(express.static('public'));

// Configuration de la base de données
const db = mysql.createConnection({
  host: 'devbdd.iutmetz.univ-lorraine.fr',
  user: 'basbunar2u_appli',
  password: '31912712',
  database: 'basbunar2u_denverCrimes'
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MariaDB');
});

// Définir une route pour récupérer des données depuis la base de données
app.get('/donnees', (req, res) => {
  db.query('SELECT * FROM crimes_2021 LIMIT 10', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).send('Erreur serveur');
      return;
    }
    res.json(results);
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Node.js en cours d'exécution sur le port ${port}`);
});
