/* script.js */
let allGames = [];

// 1. Khởi tạo và tải dữ liệu
async function initApp() {
    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error('Không thể tải file games.json');
        allGames = await response.json();
        
        setupListeners();
        updateView();
    } catch (error) {
        document.getElementById('game-list').innerHTML = `<p style="color:red;">Lỗi: ${error.message}</p>`;
    }
}

// 2. Lắng nghe sự kiện (Search & Sort)
function setupListeners() {
    document.getElementById('search-input').addEventListener('input', updateView);
    document.getElementById('sort-select').addEventListener('change', updateView);
}

// 3. Xử lý Logic: Lọc + Sắp xếp
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

// 4. Hiển thị (Render) - Sử dụng .join('') để tăng hiệu suất [cite: 68]
function renderGames(games) {
    const container = document.getElementById('game-list');
    document.getElementById('game-count').innerText = games.length;

    if (games.length === 0) {
        container.innerHTML = "<p>Không tìm thấy kết quả nào.</p>";
        return;
    }

    container.innerHTML = games.map(game => `
        <div class="game-item">
            <h3>📄 ${game.name}</h3>
            <p>
                <strong>ID:</strong> <code>${game.id}</code> 
                <button class="copy-btn" onclick="copyToClipboard('${game.id}', this)">Copy ID</button>
                | <strong>Size:</strong> ${game.size} | <strong>Version:</strong> ${game.version}
            </p>
            <a href="${game.link}" class="game-link" target="_blank">Get link</a>
        </div>
    `).join('');
}

// 5. Quan trọng: Đưa hàm Copy ra ngoài phạm vi toàn cục để HTML gọi được
window.copyToClipboard = function(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerText;
        button.innerText = "✅ Copied!";
        button.style.backgroundColor = "#2ecc71"; // Đổi màu xanh lá khi thành công [cite: 77]
        
        setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = ""; // Trả lại màu cũ
        }, 1500);
    }).catch(err => {
        console.error('Lỗi khi copy: ', err);
    });
};

initApp();
