// Créez une variable pour stocker le graphique
let myChart;
let myDonutChart;

// Créez le graphique une seule fois lors du chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const donutChartCtx = document.getElementById('donutChart').getContext('2d');
    
    // Initialisation du graphique avec les données de 2021
    const initialData = {
        labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'], // Ajoutez les noms des mois de 2021 ici
        datasets: [{
            label: 'Répartition par mois',
            data: [6175,5279,5641,5815,6467,6374,6614,6397,6034,6119,5904,6135], // Ajoutez les données de 2021 ici
            backgroundColor: [ 
                'rgba(255, 99, 71, 0.9)',
                'rgba(65, 105, 225, 0.9)',
                'rgba(60, 179, 113, 0.9)',
                'rgba(255, 165, 0, 0.9)',
                'rgba(186, 85, 211, 0.9)',
                'rgba(255, 215, 0, 0.9)',
                'rgba(70, 130, 180, 0.9)',
                'rgba(0, 128, 0, 0.9)',
                'rgba(255, 192, 203, 0.9)',
                'rgba(128, 0, 128, 0.9)',
                'rgba(210, 105, 30, 0.9)',
                'rgba(0, 128, 128, 0.9)'
            ],
            borderColor: [
                'rgba(255, 99, 71, 1)',
                'rgba(65, 105, 225, 1)',
                'rgba(60, 179, 113, 1)',
                'rgba(255, 165, 0, 1)',
                'rgba(186, 85, 211, 1)',
                'rgba(255, 215, 0, 1)',
                'rgba(70, 130, 180, 1)',
                'rgba(0, 128, 0, 1)',
                'rgba(255, 192, 203, 1)',
                'rgba(128, 0, 128, 1)',
                'rgba(210, 105, 30, 1)',
                'rgba(0, 128, 128, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    myChart = new Chart(ctx, {
        type: 'bar',
        data: initialData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display:false
                }
            }
        }
    });

    // Initialisation du graphique donut avec des données vides
    myDonutChart = new Chart(donutChartCtx, {
        type: 'doughnut',
        data: {
            labels: [
                'aggravated-assault',
                'all-other-crimes',
                'arson',
                'auto-theft',
                'burglary',
                'drug-alcohol',
                'larceny',
                'murder',
                'other-crimes-against-persons',
                'public-disorder',
                'robbery',
                'sexual-assault',
                'theft-from-motor-vehicle',
                'white-collar-crime'
            ],
            datasets: [{
                data: [3276, 7484, 188, 12643, 5723, 2476, 10119, 88, 3328, 11023, 1282, 698, 13599, 1027],
                backgroundColor: [
                    'rgba(255, 99, 71, 0.9)',
                    'rgba(65, 105, 225, 0.9)',
                    'rgba(60, 179, 113, 0.9)',
                    'rgba(255, 165, 0, 0.9)',
                    'rgba(186, 85, 211, 0.9)',
                    'rgba(255, 215, 0, 0.9)',
                    'rgba(70, 130, 180, 0.9)',
                    'rgba(0, 128, 0, 0.9)',
                    'rgba(255, 192, 203, 0.9)',
                    'rgba(128, 0, 128, 0.9)',
                    'rgba(210, 105, 30, 0.9)',
                    'rgba(0, 128, 128, 0.9)',
                    'rgba(255, 206, 86, 0.9)',
                    'rgba(75, 192, 192, 0.9)'
                ],
                borderColor: [
                    'rgba(255, 99, 71, 1)',
                    'rgba(65, 105, 225, 1)',
                    'rgba(60, 179, 113, 1)',
                    'rgba(255, 165, 0, 1)',
                    'rgba(186, 85, 211, 1)',
                    'rgba(255, 215, 0, 1)',
                    'rgba(70, 130, 180, 1)',
                    'rgba(0, 128, 0, 1)',
                    'rgba(255, 192, 203, 1)',
                    'rgba(128, 0, 128, 1)',
                    'rgba(210, 105, 30, 1)',
                    'rgba(0, 128, 128, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Cela masquera les légendes
                }
            }
        }
    });
});

// ...

// Écoutez les changements de sélection dans la liste déroulante
document.getElementById('annee').addEventListener('change', function() {
    const selectedYear = this.value; // Obtenez l'année sélectionnée

    // Mettez à jour la requête SQL en fonction de l'année sélectionnée
    const query = `
        SELECT month(first_occurrence_date) as mois, count(*) as nombre_totale
        FROM crimes_${selectedYear}
        GROUP BY month(first_occurrence_date);
    `;

    // Utilisez fetch pour récupérer les données avec la nouvelle requête
    fetch('/donnees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: query })
    })
    .then(response => response.json())
    .then(data => {
        // Remodelez les données pour utiliser les noms des mois
        const moisMap = {
            1: 'Janvier',
            2: 'Février',
            3: 'Mars',
            4: 'Avril',
            5: 'Mai',
            6: 'Juin',
            7: 'Juillet',
            8: 'Août',
            9: 'Septembre',
            10: 'Octobre',
            11: 'Novembre',
            12: 'Décembre'
        };
        const labels = data.map(item => moisMap[item.mois]);
        const values = data.map(item => item.nombre_totale);

        // Mettez à jour les données du graphique existant
        myChart.data.labels = labels;
        myChart.data.datasets[0].data = values;
        myChart.update(); // Mettez à jour le graphique

        // Affichez les données dans la console
        console.log('Données récupérées depuis le serveur :', data);
    });

});
// Écoutez les changements de sélection dans la liste déroulante
document.getElementById('annee').addEventListener('change', function() {
    const selectedYear = this.value; // Obtenez l'année sélectionnée

    // Mettez à jour la requête SQL en fonction de l'année sélectionnée
    const query = `
        SELECT offense_category_id, count(*) as nombre
        FROM crimes_${selectedYear}
        GROUP BY offense_category_id;
    `;

    // Utilisez fetch pour récupérer les données avec la nouvelle requête
    fetch('/donnees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: query })
    })
    .then(response => response.json())
    .then(data => {
        // Remodelez les données pour Chart.js
        const labels = data.map(item => item.offense_category_id);
        const values = data.map(item => item.nombre);

        // Vérifiez si le graphique donut existe déjà
        if (myDonutChart) {
            myDonutChart.destroy(); // Détruire le graphique précédent si présent
        }

         // Vérifiez si le graphique donut existe déjà
        if (myDonutChart) {
            myDonutChart.destroy(); // Détruire le graphique précédent si présent
        }

        // Créez le graphique donut et initialisez le contexte
        const donutChartCtx = document.getElementById('donutChart').getContext('2d');

        const donutData = {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 71, 0.9)',
                    'rgba(65, 105, 225, 0.9)',
                    'rgba(60, 179, 113, 0.9)',
                    'rgba(255, 165, 0, 0.9)',
                    'rgba(186, 85, 211, 0.9)',
                    'rgba(255, 215, 0, 0.9)',
                    'rgba(70, 130, 180, 0.9)',
                    'rgba(0, 128, 0, 0.9)',
                    'rgba(255, 192, 203, 0.9)',
                    'rgba(128, 0, 128, 0.9)',
                    'rgba(210, 105, 30, 0.9)',
                    'rgba(0, 128, 128, 0.9)',
                    'rgba(255, 206, 86, 0.9)',
                    'rgba(75, 192, 192, 0.9)'
                ],
                borderColor: [
                    'rgba(255, 99, 71, 1)',
                    'rgba(65, 105, 225, 1)',
                    'rgba(60, 179, 113, 1)',
                    'rgba(255, 165, 0, 1)',
                    'rgba(186, 85, 211, 1)',
                    'rgba(255, 215, 0, 1)',
                    'rgba(70, 130, 180, 1)',
                    'rgba(0, 128, 0, 1)',
                    'rgba(255, 192, 203, 1)',
                    'rgba(128, 0, 128, 1)',
                    'rgba(210, 105, 30, 1)',
                    'rgba(0, 128, 128, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        };

        myDonutChart = new Chart(donutChartCtx, {
            type: 'doughnut',
            data: donutData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Cela masquera les légendes
                    }
                }
            } // Ajoute l'accolade manquante ici
        });
        
            // Affichez les données dans la console
            console.log('Données récupérées depuis le serveur :', data);
        });

    // ...
});

const connectionStatusElement = document.getElementById('connection-status');
const connectionButton = document.getElementById('connection-button');

// Fonction pour mettre à jour l'état de connexion
function updateConnectionStatus() {
  // Effectuez une requête AJAX au point de terminaison '/connection-status' pour obtenir l'état de la connexion
  fetch('/connection-status')
    .then(response => response.json())
    .then(data => {
      const { status, color } = data;
      connectionStatusElement.textContent = status;
      connectionStatusElement.style.color = color;

      // Mettez à jour le texte du bouton avec l'état de la connexion
      connectionButton.textContent = status;
      connectionButton.style.color = color;

      // Si l'état de connexion indique une retentative, vous pouvez afficher un message ou effectuer des actions supplémentaires ici
      if (status === "Retentative de connexion") {
        // Affichez un message ou effectuez des actions supplémentaires si nécessaire
      }
    })
    .catch(error => {
      console.error('Erreur lors de la récupération de l\'état de la connexion :', error);
    });
}

// Mettez à jour l'état de connexion toutes les quelques secondes (par exemple, toutes les 5 secondes)
setInterval(updateConnectionStatus, 1000);

// Mettez à jour l'état de connexion lors du chargement de la page
updateConnectionStatus();

