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
                'rgba(255, 99, 132, 0.2)',   // Couleur de la barre 1
                'rgba(54, 162, 235, 0.2)',  // Couleur de la barre 2
                'rgba(255, 206, 86, 0.2)',  // Couleur de la barre 3
                'rgba(75, 192, 192, 0.2)',  // Couleur de la barre 4
                'rgba(153, 102, 255, 0.2)',  // Couleur de la barre 5
                'rgba(255, 99, 131, 0.2)',   // Couleur de la barre 1
                'rgba(54, 162, 235, 0.2)',  // Couleur de la barre 2
                'rgba(255, 206, 86, 0.2)',  // Couleur de la barre 3
                'rgba(75, 192, 192, 0.2)',  // Couleur de la barre 4
                'rgba(153, 102, 255, 0.2)',  // Couleur de la barre 5    
                'rgba(75, 192, 192, 0.2)',  // Couleur de la barre 4
                'rgba(153, 102, 255, 0.2)'  // Couleur de la barre 5
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',    // Bordure de la barre 1
                'rgba(54, 162, 235, 1)',   // Bordure de la barre 2
                'rgba(255, 206, 86, 1)',   // Bordure de la barre 3
                'rgba(75, 192, 192, 1)',   // Bordure de la barre 4
                'rgba(153, 102, 255, 1)',  // Bordure de la barre 5
                'rgba(255, 99, 132, 1)',    // Bordure de la barre 1
                'rgba(54, 162, 235, 1)',   // Bordure de la barre 2
                'rgba(255, 206, 86, 1)',   // Bordure de la barre 3
                'rgba(75, 192, 192, 1)',   // Bordure de la barre 4
                'rgba(153, 102, 255, 1)',   // Bordure de la barre 5
                'rgba(75, 192, 192, 1)',   // Bordure de la barre 4
                'rgba(153, 102, 255, 1)'   // Bordure de la barre 5
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
                    color: 'red', // Changer la couleur du texte des labels
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



    