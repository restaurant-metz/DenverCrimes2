const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const port = 3000;


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index.js');
});


let connectionStatus = "Connexion en cours...";
let connectionColor = "green"; // Couleur initiale en vert
let db;

// Configuration de la base de données
const dbConfig = {
  host: "db4free.net",
  user: 'hasanbb',
  password: 'hASANIBASRI57µ',
  database: "datavizu"
};

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

/*
app.post('/donnees', (req, res) => {
  const query = req.body.query;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err);
      res.status(500).send('Erreur serveur');
      return;
    }
    res.json(results);
  });
});
*/

// Créez un pool de connexions
const pool = mysql.createPool(dbConfig);

// Utilisez le pool de connexions pour gérer les connexions
app.post('/donnees', (req, res) => {
  const query = req.body.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Erreur lors de l'obtention de la connexion :", err);
      res.status(500).send('Erreur serveur');
      return;
    }

    connection.query(query, (err, results) => {
      connection.release(); // Libérez la connexion après utilisation

      if (err) {
        console.error('Erreur lors de la récupération des données :', err);
        res.status(500).send('Erreur serveur');
        return;
      }
      res.json(results);
    });
  });
});
// test

app.listen(port, () => {
  console.log(`Serveur Node.js en cours d'exécution sur le port ${port}`);
});

// Exposez l'état de la connexion à un point de terminaison
app.get('/connection-status', (req, res) => {
  res.json({ status: connectionStatus, color: connectionColor });
});

