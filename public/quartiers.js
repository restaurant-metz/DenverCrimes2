let myChart;
let myDonutChart;

// Créer une carte Leaflet
var mymap = L.map('leafletMap').setView([39.704130, -105.011018], 18);

// Ajouter une couche de tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(mymap);

var markers = L.markerClusterGroup();

var map = L.map('heatMap').setView([39.704130, -105.011018], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

var heat;

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
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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

function submitForm() {

    // Récupérez les valeurs sélectionnées par l'utilisateur
    const annee = document.getElementById("annee_quartiers").value;
    const quartier = document.getElementById("quartier").value;

    // Vérifiez si les deux sélections ont été faites
    if (annee && quartier) {
        //--------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------
        const query_month_count = `
        SELECT month(first_occurrence_date) as mois, count(*) as nombre_totale
        FROM crimes_${annee}
        WHERE neighborhood_id = "${quartier}"
        GROUP BY month(first_occurrence_date);
        `;
        const query_avg_victim_count = `
            SELECT SUM(victim_count)/COUNT(victim_count) AS average_victim_count
            FROM crimes_${annee}
            WHERE neighborhood_id = "${quartier}";
        `;
        const query_category_count = `
            SELECT offense_category_id, count(*) as nombre
            FROM crimes_${annee}
            WHERE neighborhood_id = "${quartier}"
            GROUP BY offense_category_id;
        `;
        const query_sum_victims = `
            SELECT SUM(victim_count) AS average_victim_count
            FROM crimes_${annee}
            WHERE neighborhood_id = "${quartier}"
        `;
        const query_count_incidents = `
            SELECT COUNT(incident_id) AS average_victim_count
            FROM crimes_${annee}
            WHERE neighborhood_id = "${quartier}"
        `;
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

            // Affichez les données dans la console
            //console.log('Données récupérées depuis le serveur :', data);
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
            // Affichez la réponse dans le div "resultatRequete"
            const resultatRequete = document.getElementById('resultatRequete');
            resultatRequete.textContent = `${data[0].average_victim_count}`;

            // Affichez les données dans la console
            //console.log('Moyenne du nombre de victimes récupérée depuis le serveur :', data[0].average_victim_count);
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

        //---------------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------------

        //-----------------------------------------------------------------------------------------
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
        const yearQuartier = `
                SELECT geo_lat, geo_lon
                FROM crimes_${annee}
                WHERE geo_lat IS NOT NULL
                AND geo_lon IS NOT NULL
                AND neighborhood_id = "${quartier}";
        `; 

        fetch('/donnees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: yearQuartier })
        })
        .then(response => response.json())
        .then(data => {
            // Transform data into the expected format
            var heatData = data.map(coord => [coord.geo_lat, coord.geo_lon]);
            heat = L.heatLayer(heatData, { radius: 25 }).addTo(map);
            // Ajoutez des marqueurs sur la carte pour chaque coordonnée récupérée
            /*
            data.forEach(coord => {
                var marker = L.marker([coord.geo_lat, coord.geo_lon]);
                markers.addLayer(marker); // Ajoutez le marqueur au groupe de marqueurs
                //heat.addLatLng([coord.geo_lat, coord.geo_lon]);
            });
            */
            data.forEach(coord => {
                if(coord.geo_lat && coord.geo_lon) {
                    var marker = L.marker([coord.geo_lat, coord.geo_lon]);
                    markers.addLayer(marker); // Ajoutez le marqueur au groupe de marqueurs
                }
            });
            mymap.addLayer(markers);
            
        })
        .catch(error => console.error(error));
    } else {
        alert('Veuillez sélectionner à la fois l\'année et le quartier.');
    }
}