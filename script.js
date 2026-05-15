/* script.js */
let allGames = [];

// 1. Khởi tạo và tải dữ liệu từ games.json
async function initApp() {
    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error('Unable to load games.json');
        
        allGames = await response.json();
        
        // Thiết lập các sự kiện lắng nghe
        setupListeners();
        
        // Hiển thị dữ liệu lần đầu
        updateView();
    } catch (error) {
        document.getElementById('game-list').innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
}

// 2. Thiết lập lắng nghe sự kiện từ Toolbar
function setupListeners() {
    // Tự động tìm kiếm khi gõ phím (Real-time Search)
    document.getElementById('search-input').addEventListener('input', updateView);
    
    // Tự động sắp xếp khi thay đổi lựa chọn (Sort)
    document.getElementById('sort-select').addEventListener('change', updateView);
}

// 3. Hàm xử lý logic: Lọc + Sắp xếp
function updateView() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortType = document.getElementById('sort-select').value;

    // Lọc theo tên hoặc ID
    let processedGames = allGames.filter(game => 
        game.name.toLowerCase().includes(searchTerm) || 
        game.id.toLowerCase().includes(searchTerm)
    );

    // Sắp xếp trên kết quả đã lọc
    if (sortType === 'name-asc') {
        processedGames.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'name-desc') {
        processedGames.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortType === 'id-asc') {
        processedGames.sort((a, b) => a.id.localeCompare(b.id));
    }

    renderGames(processedGames);
}

// 4. Hàm hiển thị (Render) kết quả ra DOM
function renderGames(games) {
    const container = document.getElementById('game-list');
    const countDisplay = document.getElementById('game-count');
    
    // Cập nhật số lượng hiển thị
    countDisplay.innerText = games.length;

    if (games.length === 0) {
        container.innerHTML = "<p>No result.</p>";
        return;
    }

    // Sử dụng map và .join('') để tăng hiệu suất hiển thị và tránh lỗi dấu phẩy
    container.innerHTML = games.map(game => `
        <div class="game-item">
            <h3>📄 ${game.name}</h3>
            <p><strong>ID:</strong> ${game.id} | <strong>Size:</strong> ${game.size} | <strong>Version:</strong> ${game.version}</p>
            <a href="${game.link}" class="game-link" target="_blank">Get link</a>
        </div>
    `).join('');
}

// Chạy ứng dụng khi file JS được tải
initApp();
