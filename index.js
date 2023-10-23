const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const dotenv = require('dotenv'); // Importez la bibliothèque dotenv

// Chargez les variables d'environnement à partir du fichier .env
dotenv.config();

// Utilisez bodyParser pour analyser les données JSON
app.use(bodyParser.json());

// Configuration de la base de données à partir des variables d'environnement
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Fonction asynchrone pour gérer la connexion à la base de données
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connecté à la base de données');
    return connection;
  } catch (error) {
    console.error('Erreur de connexion à la base de données :', error);
    throw error;
  }
}

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err);
  res.status(500).send('Erreur serveur');
});

// Exposer l'état de la connexion à un point de terminaison
app.get('/connection-status', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    res.json({ status: 'Connecté à la base de données' });
  } catch (error) {
    res.status(500).json({ status: 'Erreur de connexion à la base de données' });
  }
});

// Mettre à jour la route pour gérer la requête POST
app.post('/donnees', async (req, res) => {
  const query = req.body.query; // Obtenez la requête SQL du corps de la demande

  try {
    const connection = await connectToDatabase();
    const [results, fields] = await connection.execute(query);
    res.json(results);
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    res.status(500).send('Erreur serveur');
  }
});

// Servez les fichiers statiques depuis le répertoire 'public'
app.use(express.static('public'));

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur Node.js en cours d'exécution sur le port ${port}`);
});

