let allGames = [];

async function initApp() {
    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error('Không thể tải file games.json');
        allGames = await response.json();
        
        // Sắp xếp mặc định A-Z
        allGames.sort((a, b) => a.name.localeCompare(b.name));
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = 'name-asc';
        }

        setupListeners();
        updateView();
    } catch (error) {
        document.getElementById('game-list').innerHTML = `<p style="color:red; text-align:center;">Lỗi: ${error.message}</p>`;
    }
}

function setupListeners() {
    document.getElementById('search-input').addEventListener('input', updateView);
    document.getElementById('sort-select').addEventListener('change', updateView);
}

function updateView() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortType = document.getElementById('sort-select').value;

    let processedGames = allGames.filter(game => 
        game.name.toLowerCase().includes(searchTerm) || 
        game.id.toLowerCase().includes(searchTerm)
    );

    if (sortType === 'name-asc') {
        processedGames.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'name-desc') {
        processedGames.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortType === 'id-asc') {
        processedGames.sort((a, b) => a.id.localeCompare(b.id));
    }

    renderGames(processedGames);
}

function renderGames(games) {
    const container = document.getElementById('game-list');
    const countDisplay = document.getElementById('game-count');
    countDisplay.innerText = games.length;

    if (games.length === 0) {
        container.innerHTML = "<div class='loading-text'>No result.</div>";
        return;
    }
    
    container.innerHTML = games.map(game => `
        <div class="game-item">
            <img src="${game.thumbnail || 'https://via.placeholder.com/300x187?text=No+Image'}" class="game-thumbnail" alt="${game.name}">
            <div class="game-info">
                <h3>${game.name}</h3>
                <p>
                    <strong>ID:</strong> <code>${game.id}</code>
                    <button class="copy-btn" onclick="copyToClipboard('${game.id}', this)">Copy ID</button><br>
                    <strong>Size:</strong> ${game.size} | <strong>Version:</strong> ${game.version}
                </p>
                <a href="${game.link}" class="game-link" target="_blank">Get link</a>
            </div>
        </div>
    `).join('');
}

window.copyToClipboard = function(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerText;
        button.innerText = "✅ Copied!";
        button.style.backgroundColor = "#2ecc71"; 
        button.style.color = "#ffffff";
        
        setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = ""; 
            button.style.color = "";
        }, 1500);
    }).catch(err => {
        console.error('Lỗi khi copy: ', err);
    });
};

initApp();
