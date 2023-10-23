const express = require('express');
const mysql = require('mysql2');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

let connectionStatus = "Connexion en cours...";
let connectionColor = "green"; // Couleur initiale en vert

// Servir les fichiers statiques depuis le répertoire 'public'
app.use(express.static('public'));

// Configuration de la base de données
const dbConfig = {
  host: 'devbdd.iutmetz.univ-lorraine.fr',
  user: 'basbunar2u_appli',
  password: '31912712',
  database: 'basbunar2u_denverCrimes'
};

let db;

// Fonction pour mettre à jour le statut de connexion
function updateConnectionStatus(status, color) {
  connectionStatus = status;
  connectionColor = color;
}

// Fonction pour tenter de se connecter à la base de données
function tryDatabaseConnection() {
  db = mysql.createConnection(dbConfig);
  
  db.connect((err) => {
    if (err) {
      updateConnectionStatus('Erreur de connexion à la base de données : ' + err.message, 'red');
      console.error(connectionStatus);

      // Réessayer la connexion après un délai (par exemple, 5 secondes)
      setTimeout(tryDatabaseConnection, 5000);
    } else {
      updateConnectionStatus('Connecté à la base de données', 'green');
      console.log(connectionStatus);
    }
  });
}

// Initialiser la tentative de connexion
tryDatabaseConnection();

// Utilisez bodyParser pour analyser les données JSON
app.use(bodyParser.json());

// Mettez à jour la route pour gérer la requête POST
app.post('/donnees', (req, res) => {
  const query = req.body.query; // Obtenez la requête SQL du corps de la demande

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(1000).send('Erreur serveur');
      return;
    }
    res.json(results);
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Node.js en cours d'exécution sur le port ${port}`);
});

// Exposez l'état de la connexion à un point de terminaison
app.get('/connection-status', (req, res) => {
  res.json({ status: connectionStatus, color: connectionColor });
});