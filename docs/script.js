document.addEventListener('DOMContentLoaded', () => {
    // Shared Chart.js options for the glowing line charts
    Chart.defaults.color = '#8b9bb4';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // 1. Site Activity Chart (Bottom Panel)
    const ctxActivity = document.getElementById('siteActivityChart').getContext('2d');
    
    // Create gradient for the blue line
    let gradientBlue = ctxActivity.createLinearGradient(0, 0, 0, 400);
    gradientBlue.addColorStop(0, 'rgba(52, 152, 219, 0.5)');
    gradientBlue.addColorStop(1, 'rgba(52, 152, 219, 0.0)');

    new Chart(ctxActivity, {
        type: 'line',
        data: {
            labels: ['2pm', '4pm', '6pm', '8pm', '10pm', '12am', '2am', '4am', '6am', '8am', '10am', '12pm'],
            datasets: [{
                label: 'Activity',
                data: [150, 250, 220, 320, 280, 400, 310, 290, 420, 390, 450, 410],
                borderColor: '#3498db',
                borderWidth: 2,
                backgroundColor: gradientBlue,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6
            },
            {
                // The orange spike event dataset
                label: 'Event',
                data: [null, null, null, null, null, null, null, null, 420, null, null, null],
                borderColor: '#ff9500',
                backgroundColor: '#ff9500',
                pointRadius: 6,
                pointBackgroundColor: '#ff9500',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                showLine: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    border: { display: false }
                }
            }
        }
    });

    // 2. Worker Status Sparkline Chart (Right Panel)
    const ctxWorker = document.getElementById('workerStatusChart').getContext('2d');
    
    new Chart(ctxWorker, {
        type: 'line',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            datasets: [{
                data: [20, 25, 22, 35, 45, 30, 40, 25, 22, 25],
                borderColor: '#ff9500',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                y: { display: false, min: 0 },
                x: { display: false }
            },
            layout: { padding: { top: 10, bottom: 10 } }
        }
    });
});
