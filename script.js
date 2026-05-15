/* script.js */
let allGames = [];

// 1. Khởi tạo ứng dụng
async function initApp() {
    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error('Unable to load games.json');
        allGames = await response.json();
        
        setupListeners();
        updateView();
    } catch (error) {
        document.getElementById('game-list').innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
}

// 2. Thiết lập lắng nghe sự kiện
function setupListeners() {
    document.getElementById('search-input').addEventListener('input', updateView);
    document.getElementById('sort-select').addEventListener('change', updateView);
}

// 3. Logic xử lý: Tìm kiếm + Sắp xếp
function updateView() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortType = document.getElementById('sort-select').value;

    // Lọc theo tên hoặc ID
    let processedGames = allGames.filter(game => 
        game.name.toLowerCase().includes(searchTerm) || 
        game.id.toLowerCase().includes(searchTerm)
    );

    // Sắp xếp
    if (sortType === 'name-asc') {
        processedGames.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'name-desc') {
        processedGames.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortType === 'id-asc') {
        processedGames.sort((a, b) => a.id.localeCompare(b.id));
    }

    renderGames(processedGames);
}

// 4. Hiển thị dữ liệu kèm nút Copy ID
function renderGames(games) {
    const container = document.getElementById('game-list');
    document.getElementById('game-count').innerText = games.length;

    if (games.length === 0) {
        container.innerHTML = "<p>No results found.</p>";
        return;
    }

    container.innerHTML = games.map(game => `
        <div class="game-item">
            <h3>📄 ${game.name}</h3>
            <p>
                <strong>ID:</strong> ${game.id} 
                <button class="copy-btn" onclick="copyToClipboard('${game.id}', this)">Copy ID</button>
                | <strong>Size:</strong> ${game.size} | <strong>Version:</strong> ${game.version}
            </p>
            <a href="${game.link}" class="game-link" target="_blank">Get link</a>
        </div>
    `).join('');
}

// 5. Hàm xử lý Copy ID vào Clipboard
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerText;
        button.innerText = "✅ Copied!";
        button.classList.add('success');

        setTimeout(() => {
            button.innerText = originalText;
            button.classList.remove('success');
        }, 1500);
    }).catch(err => {
        console.error('Copy failed: ', err);
    });
}

initApp();
