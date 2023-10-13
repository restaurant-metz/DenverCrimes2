// Créez une variable pour stocker le graphique
let myChart;

// Créez le graphique une seule fois lors du chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('myChart').getContext('2d');
    
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
                labels: {
                    color: 'black', // Changer la couleur du texte des labels
                }
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



    