document.addEventListener('DOMContentLoaded', () => {
    // Current Date Setup
    const dateEl = document.getElementById('current-date');
    const now = new Date();
    dateEl.innerText = now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    // === Navigation Logic ===
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all nav items
            navItems.forEach(nav => {
                nav.classList.remove('active');
                // Remove the dot span if it exists
                const dot = nav.querySelector('.active-dot');
                if(dot) dot.remove();
            });

            // Add active to clicked nav item
            item.classList.add('active');
            item.insertAdjacentHTML('afterbegin', '<span class="active-dot"></span>');

            // Hide all views
            viewSections.forEach(view => {
                view.classList.remove('active');
            });

            // Show target view
            const targetId = 'view-' + item.getAttribute('data-view');
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active');
            }
        });
    });


    // === Chart.js Rendering ===
    Chart.defaults.color = '#8b9bb4';
    Chart.defaults.font.family = "'Inter', sans-serif";

    // 1. Site Activity Chart (Bottom Panel of Site 01)
    const ctxActivity = document.getElementById('siteActivityChart');
    if (ctxActivity) {
        let gradientBlue = ctxActivity.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradientBlue.addColorStop(0, 'rgba(52, 152, 219, 0.5)');
        gradientBlue.addColorStop(1, 'rgba(52, 152, 219, 0.0)');

        new Chart(ctxActivity, {
            type: 'line',
            data: {
                labels: ['2pm', '4pm', '6pm', '8pm', '10pm', '12am', '2am', '4am', '6am', '8am', '10am', '12pm'],
                datasets: [{
                    label: 'Activity',
                    data: [150, 250, 220, 320, 280, 400, 310, 290, 420, 390, 450, 410],
                    borderColor: '#3498db', borderWidth: 2, backgroundColor: gradientBlue,
                    fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 6
                },
                {
                    label: 'Event',
                    data: [null, null, null, null, null, null, null, null, 420, null, null, null],
                    borderColor: '#ff9500', backgroundColor: '#ff9500',
                    pointRadius: 6, pointBackgroundColor: '#ff9500', pointBorderColor: '#fff',
                    pointBorderWidth: 2, showLine: false
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, border: { display: false } },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });
    }

    // 2. Worker Status Sparkline Chart (Site 01)
    const ctxWorker = document.getElementById('workerStatusChart');
    if(ctxWorker) {
        new Chart(ctxWorker, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                datasets: [{ data: [20, 25, 22, 35, 45, 30, 40, 25, 22, 25], borderColor: '#ff9500', borderWidth: 2, tension: 0.4, pointRadius: 0 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { y: { display: false, min: 0 }, x: { display: false } },
                layout: { padding: { top: 10, bottom: 10 } }
            }
        });
    }

    // 3. Overview Dashboard Main Chart
    const ctxOverview = document.getElementById('overviewChart');
    if(ctxOverview) {
        let gradOverview = ctxOverview.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradOverview.addColorStop(0, 'rgba(255, 59, 48, 0.3)');
        gradOverview.addColorStop(1, 'rgba(255, 59, 48, 0.0)');

        new Chart(ctxOverview, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Proximity Incidents',
                    data: [12, 19, 15, 8, 22, 5, 2],
                    backgroundColor: 'rgba(255, 59, 48, 0.8)',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, border: { display: false } },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });
    }
});
