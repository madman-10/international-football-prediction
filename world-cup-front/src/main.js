// import './style.css'
// import javascriptLogo from './assets/javascript.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
// <section id="center">
//   <div class="hero">
//     <img src="${heroImg}" class="base" width="170" height="179">
//     <img src="${javascriptLogo}" class="framework" alt="JavaScript logo"/>
//     <img src="${viteLogo}" class="vite" alt="Vite logo" />
//   </div>
//   <div>
//     <h1>Get started</h1>
//     <p>Edit <code>src/main.js</code> and save to test <code>HMR</code></p>
//   </div>
//   <button id="counter" type="button" class="counter"></button>
// </section>

// <div class="ticks"></div>

// <section id="next-steps">
//   <div id="docs">
//     <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
//     <h2>Documentation</h2>
//     <p>Your questions, answered</p>
//     <ul>
//       <li>
//         <a href="https://vite.dev/" target="_blank">
//           <img class="logo" src="${viteLogo}" alt="" />
//           Explore Vite
//         </a>
//       </li>
//       <li>
//         <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//           <img class="button-icon" src="${javascriptLogo}" alt="">
//           Learn more
//         </a>
//       </li>
//     </ul>
//   </div>
//   <div id="social">
//     <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
//     <h2>Connect with us</h2>
//     <p>Join the Vite community</p>
//     <ul>
//       <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
//       <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
//       <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
//       <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
//     </ul>
//   </div>
// </section>

// <div class="ticks"></div>
// <section id="spacer"></section>
// `

// setupCounter(document.querySelector('#counter'))


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
        const response = await fetch('http://localhost:8000/api/predict', {
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