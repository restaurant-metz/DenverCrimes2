// Récupérez les données depuis le serveur Node.js (utilisez fetch ou jQuery.ajax)
fetch('/donnees')
    .then(response => response.json())
    .then(data => {
    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);

    // Créez un graphique avec Chart.js
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: labels,
        datasets: [{
            label: 'Données',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
        },
        options: {
        scales: {
            y: {
            beginAtZero: true
            }
        }
        }
    });
    });
  