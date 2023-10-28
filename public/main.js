let myChart;
let myDonutChart;


// Créer une carte Leaflet
var mymap = L.map('leafletMap').setView([39.739377, -104.990253], 12);

// Ajouter une couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(mymap);

var markers = L.markerClusterGroup();

var map = L.map('heatMap').setView([39.739377, -104.990253], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

var heat;

// Créez le graphique une seule fois lors du chargement de la page
document.addEventListener('DOMContentLoaded', function() {

    const ctx = document.getElementById('myChart').getContext('2d');
    const donutChartCtx = document.getElementById('donutChart').getContext('2d');
    const initialData = {
        labels: [
            'Janvier', 
            'Février', 
            'Mars', 
            'Avril', 
            'Mai', 
            'Juin', 
            'Juillet', 
            'Août', 
            'Septembre', 
            'Octobre', 
            'Novembre', 
            'Décembre'
        ],
        datasets: [{
            label: 'Nombre de crimes par mois',
            data: [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12
            ],
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
                data: [
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
                ],
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
                    display: false,
                }
            },
            legend: {
                display: true,
                position: 'bottom' // Vous pouvez ajuster la position selon vos préférences
            }
        }
    });

});

// Écoutez les changements de sélection dans la liste déroulante
function submitForm() { 

    const selectedYear = document.getElementById("annee").value;
    const category = document.getElementById("category").value;
    var monTitre = document.getElementById("monTitre");

    if(selectedYear)
    {
        let query_month_count = `
            SELECT month(first_occurrence_date) as mois, count(*) as nombre_totale
            FROM crimes_${selectedYear}
            GROUP BY month(first_occurrence_date);
        `;
        let query_avg_victim_count = `
            SELECT SUM(victim_count)/COUNT(victim_count) AS average_victim_count
            FROM crimes_${selectedYear}
        `;
        let query_category_count = `
            SELECT offense_category_id, count(*) as nombre
            FROM crimes_${selectedYear}
            GROUP BY offense_category_id;
        `;
        let query_sum_victims = `
            SELECT SUM(victim_count) AS average_victim_count
            FROM crimes_${selectedYear}
        `;
        let query_count_incidents = `
            SELECT COUNT(incident_id) AS average_victim_count
            FROM crimes_${selectedYear}
        `;
        let query_geo_lat_lon = `
            SELECT offense_type_id, offense_category_id, 
            first_occurrence_date, last_occurrence_date, 
            reported_date, incident_address, 
            geo_lon, geo_lat, victim_count
            FROM crimes_${selectedYear}
            WHERE geo_lat IS NOT NULL
        `;

        monTitre.textContent = "Répartition des crimes par catégorie";
        
        if (category)
        {
            monTitre.textContent = "Répartition des crimes par type";

            query_month_count = `
                SELECT month(first_occurrence_date) as mois, count(*) as nombre_totale
                FROM crimes_${selectedYear}
                WHERE offense_category_id = '${category}'
                GROUP BY month(first_occurrence_date);
            `;
            query_avg_victim_count = `
                SELECT SUM(victim_count)/COUNT(victim_count) AS average_victim_count
                FROM crimes_${selectedYear}
                WHERE offense_category_id = '${category}';
            `;
            query_category_count = `
                SELECT offense_type_id as offense_category_id, count(*) as nombre
                FROM crimes_${selectedYear}
                WHERE offense_category_id = '${category}'
                GROUP BY offense_type_id;
            `;
            query_sum_victims = `
                SELECT SUM(victim_count) AS average_victim_count
                FROM crimes_${selectedYear}
                WHERE offense_category_id = '${category}';
            `;
            query_count_incidents = `
                SELECT COUNT(incident_id) AS average_victim_count
                FROM crimes_${selectedYear}
                WHERE offense_category_id = '${category}';
            `;

            query_geo_lat_lon = `
                SELECT offense_type_id, offense_category_id, 
                first_occurrence_date, last_occurrence_date, 
                reported_date, incident_address, 
                geo_lon, geo_lat, victim_count
                FROM crimes_${selectedYear}
                WHERE geo_lat IS NOT NULL
                AND offense_category_id = '${category}';
            `;
        }

        // Utilisez fetch pour récupérer les données avec la nouvelle requête
        fetch('/donnees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query_month_count })
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

        });

        // ------------------------------------------------

        // Utilisez fetch pour récupérer les données avec la nouvelle requête
        fetch('/donnees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query_avg_victim_count })
        })
        .then(response => response.json())
        .then(data => {
            const resultatRequete = document.getElementById('resultatRequete');
            resultatRequete.textContent = `${data[0].average_victim_count}`;
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de la moyenne du nombre de victimes :', error);
        });

        // ----------------------------------------------------------------------------------

        // Utilisez fetch pour récupérer les données avec la nouvelle requête
        fetch('/donnees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query_category_count })
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
                //console.log('Données récupérées depuis le serveur :', data);
        });

        // ------------------------------------------------------------------------------------------------------------------
    
        // Utilisez fetch pour récupérer les données avec la nouvelle requête
        fetch('/donnees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query_sum_victims })
        })
        .then(response => response.json())
        .then(data => {
            // Affichez la réponse dans le div "resultatRequete"
            const resultatRequete = document.getElementById('nombres2');
            resultatRequete.textContent = `${data[0].average_victim_count}`;
    
            // Affichez les données dans la console
            console.log('Moyenne du nombre de victimes récupérée depuis le serveur :', data[0].average_victim_count);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de la moyenne du nombre de victimes :', error);
        });


        // ------------------------------------------------------------------------

        // Utilisez fetch pour récupérer les données avec la nouvelle requête
        fetch('/donnees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query_count_incidents })
        })
        .then(response => response.json())
        .then(data => {
            // Affichez la réponse dans le div "resultatRequete"
            const resultatRequete = document.getElementById('nombres3');
            resultatRequete.textContent = `${data[0].average_victim_count}`;

            // Affichez les données dans la console
            console.log('Moyenne du nombre de victimes récupérée depuis le serveur :', data[0].average_victim_count);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de la moyenne du nombre de victimes :', error);
        });

        //--------------------------------------------------------------------------------------------
        // ----------------------------------------------------------------------------------------

            // Supprimer la couche de chaleur existante
        if (heat) {
            map.removeLayer(heat);
        }

        // Supprimer les marqueurs existants
        if (markers) {
            mymap.removeLayer(markers);
            markers = L.markerClusterGroup();
            //markers = L.layerGroup(); // Créer un nouveau groupe de marqueurs
        }

        // -------------------------------------------------
        fetch('/donnees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query_geo_lat_lon })
        })
        .then(response => response.json())
        .then(data => {
            // Transform data into the expected format
            var heatData = data.map(coord => [coord.geo_lat, coord.geo_lon]);
            heat = L.heatLayer(heatData, { radius: 25 }).addTo(map);

            data.forEach(coord => {
                if(coord.geo_lat && coord.geo_lon) {
                    var marker = L.marker([coord.geo_lat, coord.geo_lon]);
                    var popupContent = `<b>Adresse :</b> ${coord.incident_address}<br>`;
                    popupContent += `<b>offense_type_id : </b> ${coord.offense_type_id}<br>`;
                    popupContent += `<b>offense_category_id : </b> ${coord.offense_category_id}<br>`;

                    //popupContent += `<b>first_occurrence_date : </b> ${coord.first_occurrence_date}<br>`;
                    //popupContent += `<b>last_occurrence_date : </b> ${coord.last_occurrence_date}<br>`;
                    //popupContent += `<b>reported_date : </b> ${coord.reported_date}<br>`;
                    if (coord.first_occurrence_date) {
                        const firstOccurrenceDate = new Date(coord.first_occurrence_date);
                        const formattedFirstOccurrenceDate = firstOccurrenceDate.toLocaleString('en-US');
                        popupContent += `<b>first_occurrence_date : </b> ${formattedFirstOccurrenceDate}<br>`;
                    }

                    if (coord.last_occurrence_date) {
                        const lastOccurrenceDate = new Date(coord.last_occurrence_date);
                        const formattedLastOccurrenceDate = lastOccurrenceDate.toLocaleString('en-US');
                        popupContent += `<b>last_occurrence_date : </b> ${formattedLastOccurrenceDate}<br>`;
                    }

                    if (coord.reported_date) {
                        const reportedDate = new Date(coord.reported_date);
                        const formattedReportedDate = reportedDate.toLocaleString('en-US');
                        popupContent += `<b>reported_date : </b> ${formattedReportedDate}<br>`;
                    }

                    popupContent += `<b>victim_count : </b> ${coord.victim_count}<br>`;
                    marker.bindPopup(popupContent); // Associez la popup au marqueur
                    markers.addLayer(marker);
                }
            });
            mymap.addLayer(markers);
            
        })
        .catch(error => console.error(error));
        // ---------------------------------------------------------------
        // ----------------------------------------------------------------

        updateConnectionStatus();
    }else{
        alert('Veuillez sélectionner l\'année au minimum');
    }

};


//------------------------------------------------------------------------------------------------------------
const connectionStatusElement = document.getElementById('connection-status');
//const connectionButton = document.getElementById('connection-button');

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
        //connectionButton.textContent = status;
        //connectionButton.style.color = color;

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
setInterval(updateConnectionStatus, 1500);

// Mettez à jour l'état de connexion lors du chargement de la page
updateConnectionStatus();