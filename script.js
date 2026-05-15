/* script.js */

// ... (giữ nguyên các hàm initApp, setupListeners, updateView bên trên)

// 4. Hàm hiển thị (Render) kết quả ra DOM
function renderGames(games) {
    const container = document.getElementById('game-list');
    const countDisplay = document.getElementById('game-count');
    
    countDisplay.innerText = games.length;

    if (games.length === 0) {
        container.innerHTML = "<p>No result.</p>";
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
    `).join(''); [cite: 84, 99]
}

// 5. Hàm xử lý Copy vào Clipboard
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        // Thay đổi giao diện nút bấm tạm thời để báo cho người dùng biết đã copy xong
        const originalText = button.innerText;
        button.innerText = "✅ Copied!";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";

        // Trả lại trạng thái cũ sau 1.5 giây
        setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = "";
            button.style.color = "";
        }, 1500);
    }).catch(err => {
        console.error('Lỗi khi copy: ', err);
    });
}

// Chạy ứng dụng
initApp();
