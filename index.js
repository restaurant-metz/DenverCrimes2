const express = require('express');
//const app = express();
const path = require('path');

var server = express();
server.use(express.static(__dirname + '/public'));

server.get('*', function(req, res){
  res.sendFile('index.html');
});

//app.use(express.static('public'));

const mysql = require('mysql2');
const bodyParser = require('body-parser');
//const port = 3000;
//const dotenv = require('dotenv').config();

let connectionStatus = "Connexion en cours...";
let connectionColor = "green"; // Couleur initiale en vert
let db;

// Configuration de la base de donnéess
const dbConfig = {
  host: "db4free.net",//process.env.DB_HOST,
  user: 'hasanbb',
  password: 'hASANIBASRI57µ',
  database: "datavizu"//'basbunar2u_denverCrimes'
};

app.get('/', (req, res) => {
  res.send('Bienvenue');
});

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

      // Réessayer la connexion après 5 secondes
      setTimeout(tryDatabaseConnection, 10000);
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
      res.status(100000).send('Erreur serveur');
      return;
    }
    res.json(results);
  });
});

var port = 10001;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});

// Démarrer le serveur
//app.listen(port, () => {
//  console.log(`Serveur Node.js en cours d'exécution sur le port ${port}`);
//});

// Exposez l'état de la connexion à un point de terminaison
app.get('/connection-status', (req, res) => {
  res.json({ status: connectionStatus, color: connectionColor });
});

