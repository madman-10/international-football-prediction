document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/teams.txt');
        if (!response.ok) throw new Error('Failed to load teams.txt');

        const textData = await response.text();
        const teams = textData.split('\n').map(t => t.trim()).filter(t => t.length > 0);

        const homeSelect = document.getElementById('home-team');
        const awaySelect = document.getElementById('away-team');

        // Streamlined option creation
        teams.forEach(team => {
            homeSelect.appendChild(new Option(team, team));
            awaySelect.appendChild(new Option(team, team));
        });
    } catch (error) {
        console.error('Initialization Error:', error);
    }
});

const form = document.getElementById('prediction-form');
const submitBtn = document.getElementById('submit-btn');
const errorBox = document.getElementById('error-box');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Reset UI state
    errorBox.classList.add('hidden');
    document.getElementById('result-container').classList.add('hidden');

    const homeTeam = document.getElementById('home-team').value;
    const awayTeam = document.getElementById('away-team').value;

    // Validate teams
    if (homeTeam === awayTeam) {
        errorBox.textContent = "Invalid Matchup: Please select two different teams.";
        errorBox.classList.remove('hidden');
        return; 
    }

    const payload = {
        home_team: homeTeam,
        away_team: awayTeam,
        tournament: "FIFA World Cup"
    };

    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Predicting...';
    submitBtn.disabled = true;

    // Send and recieve the data for prediction
    try {
        const response = await fetch('https://international-football-prediction.onrender.com/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Server Error: ${response.status}`);

        const data = await response.json();
        const probs = data.probabilities || {};

        document.getElementById('result-container').classList.remove('hidden');
        
        // Format winner text
        const predictionStr = String(data.prediction).toUpperCase().trim();
        const winnerElement = document.getElementById('predicted-winner');

        if (predictionStr.includes('DRAW')) {
            winnerElement.textContent = 'MATCH DRAWN';
        } else if (predictionStr.includes(homeTeam.toUpperCase())) {
            winnerElement.textContent = `${homeTeam} to Win`;
        } else if (predictionStr.includes(awayTeam.toUpperCase())) {
            winnerElement.textContent = `${awayTeam} to Win`;
        } else {
            winnerElement.textContent = String(data.prediction); 
        }

        // Exact Probability Extraction mapping to the Python dictionary keys
        const homeProb = parseFloat(probs[homeTeam]) || 0;
        const drawProb = parseFloat(probs['Draw']) || parseFloat(probs['draw']) || 0;
        const awayProb = parseFloat(probs[awayTeam]) || 0;

        document.getElementById('prob-home').textContent = (homeProb * 100).toFixed(1) + '%';
        document.getElementById('prob-draw').textContent = (drawProb * 100).toFixed(1) + '%';
        document.getElementById('prob-away').textContent = (awayProb * 100).toFixed(1) + '%';

    } catch (error) {
        console.error('Prediction Error:', error);
        errorBox.textContent = "Failed to connect to the prediction server. Ensure FastAPI is running.";
        errorBox.classList.remove('hidden');
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});