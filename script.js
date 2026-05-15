/* script.js */
let allGames = [];

async function initApp() {
    try {
        const response = await fetch('games.json'); [cite: 42]
        if (!response.ok) throw new Error('Unable to load games.json');
        allGames = await response.json(); [cite: 43]
        setupListeners();
        updateView(); [cite: 45]
    } catch (error) {
        document.getElementById('game-list').innerHTML = `<p style="color:red;">Error: ${error.message}</p>`; [cite: 47]
    }
}

function setupListeners() {
    document.getElementById('search-input').addEventListener('input', updateView); [cite: 25, 51]
    document.getElementById('sort-select').addEventListener('change', updateView); [cite: 29, 51]
}

function updateView() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase(); [cite: 52]
    const sortType = document.getElementById('sort-select').value; [cite: 53]

    let processedGames = allGames.filter(game => 
        game.name.toLowerCase().includes(searchTerm) || 
        game.id.toLowerCase().includes(searchTerm)
    ); [cite: 55, 56, 57]

    if (sortType === 'name-asc') processedGames.sort((a, b) => a.name.localeCompare(b.name)); [cite: 60, 61]
    if (sortType === 'name-desc') processedGames.sort((a, b) => b.name.localeCompare(a.name)); [cite: 62, 63]
    if (sortType === 'id-asc') processedGames.sort((a, b) => a.id.localeCompare(b.id)); [cite: 64, 65]

    renderGames(processedGames);
}

function renderGames(games) {
    const container = document.getElementById('game-list');
    document.getElementById('game-count').innerText = games.length; [cite: 68]

    if (games.length === 0) {
        container.innerHTML = "<p>No result.</p>"; [cite: 75]
        return;
    }

    container.innerHTML = games.map(game => `
        <div class="game-item">
            <h3>📄 ${game.name}</h3> [cite: 80]
            <p>
                <strong>ID:</strong> ${game.id} 
                <button class="copy-btn" onclick="copyToClipboard('${game.id}', this)">Copy ID</button>
                | <strong>Size:</strong> ${game.size} | <strong>Version:</strong> ${game.version} [cite: 81]
            </p>
            <a href="${game.link}" class="game-link" target="_blank">Get link</a> [cite: 82]
        </div>
    `).join(''); [cite: 84]
}

// Hàm copy chuẩn xịn có feedback màu xanh
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerText;
        button.innerText = "✅ Copied!";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";

        setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = "";
            button.style.color = "";
        }, 1500);
    }).catch(err => {
        console.error('Lỗi khi copy: ', err);
    });
}

initApp(); [cite: 87]
