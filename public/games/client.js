// client.js
const socket = io(); // Kết nối tới máy chủ Socket.IO

const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const roomIdInput = document.getElementById('roomIdInput');
const roomStatus = document.getElementById('roomStatus');
const roomSelection = document.getElementById('room-selection');
const gameContainer = document.getElementById('game-container');
const playerInfo = document.getElementById('playerInfo');
const turnInfo = document.getElementById('turnInfo');
const gameMessage = document.getElementById('gameMessage');
const boardCells = document.querySelectorAll('.cell');
const resetGameBtn = document.getElementById('resetGameBtn');

let currentRoomId = null;
let playerSymbol = null; // 'X' or 'O'
let isMyTurn = false;
let currentBoard = Array(9).fill(null);

// --- Xử lý sự kiện tạo/tham gia phòng ---
createRoomBtn.addEventListener('click', () => {
    socket.emit('createRoom');
});

joinRoomBtn.addEventListener('click', () => {
    const roomId = roomIdInput.value.trim();
    if (roomId) {
        socket.emit('joinRoom', roomId);
    } else {
        roomStatus.textContent = 'Vui lòng nhập ID phòng.';
    }
});

// --- Lắng nghe các sự kiện từ máy chủ ---

socket.on('roomCreated', (roomId, symbol) => {
    currentRoomId = roomId;
    playerSymbol = symbol;
    roomStatus.textContent = `Bạn đã tạo phòng: ${roomId}. Chờ người chơi khác tham gia...`;
    playerInfo.textContent = `Bạn là: ${playerSymbol}`;
    roomSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    resetBoard(); // Đảm bảo bảng trống khi tạo phòng
});

socket.on('joinedRoom', (roomId, symbol) => {
    currentRoomId = roomId;
    playerSymbol = symbol;
    roomStatus.textContent = `Bạn đã tham gia phòng: ${roomId}.`;
    playerInfo.textContent = `Bạn là: ${playerSymbol}`;
    roomSelection.style.display = 'none';
    gameContainer.style.display = 'block';
});

socket.on('roomError', (message) => {
    roomStatus.textContent = message;
});

socket.on('gameStart', (startingPlayer, board, playerMap) => {
    gameMessage.textContent = 'Trò chơi bắt đầu!';
    updateBoardUI(board);
    updateTurnInfo(startingPlayer, playerMap);
    resetGameBtn.style.display = 'none'; // Ẩn nút reset khi game bắt đầu
});

socket.on('updateBoard', (board, nextPlayer) => {
    currentBoard = board;
    updateBoardUI(board);
    updateTurnInfo(nextPlayer);
    gameMessage.textContent = ''; // Xóa thông báo cũ
});

socket.on('gameOver', (winner) => {
    if (winner === 'Hòa') {
        gameMessage.textContent = 'Trò chơi hòa!';
    } else {
        gameMessage.textContent = `Người chiến thắng là: ${winner}!`;
    }
    turnInfo.textContent = ''; // Ẩn thông tin lượt đi
    disableBoard();
    resetGameBtn.style.display = 'block';
});

socket.on('invalidMove', (message) => {
    gameMessage.textContent = message;
});

socket.on('playerDisconnected', (disconnectedPlayerId) => {
    gameMessage.textContent = 'Người chơi kia đã ngắt kết nối. Trò chơi kết thúc.';
    disableBoard();
    resetGameBtn.style.display = 'block';
    // Có thể thêm logic để reset lại game hoặc đưa người chơi về màn hình chọn phòng
});


// --- Xử lý nước đi của người chơi ---
boardCells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (!isMyTurn || currentRoomId === null) {
            gameMessage.textContent = 'Chưa đến lượt bạn hoặc bạn chưa vào phòng.';
            return;
        }

        const index = parseInt(cell.dataset.index);
        if (currentBoard[index] === null) { // Chỉ cho phép đánh vào ô trống
            socket.emit('makeMove', currentRoomId, index);
        } else {
            gameMessage.textContent = 'Ô này đã được đánh!';
        }
    });
});

// --- Hàm hỗ trợ giao diện ---
function updateBoardUI(board) {
    boardCells.forEach((cell, index) => {
        cell.textContent = board[index];
        cell.className = 'cell'; // Reset class
        if (board[index] === 'X') {
            cell.classList.add('x');
        } else if (board[index] === 'O') {
            cell.classList.add('o');
        }
    });
}

function updateTurnInfo(currentPlayerSymbol) {
    turnInfo.textContent = `Lượt của: ${currentPlayerSymbol}`;
    isMyTurn = (playerSymbol === currentPlayerSymbol);
    if (isMyTurn) {
        gameMessage.textContent = 'Đến lượt bạn!';
    } else {
        gameMessage.textContent = 'Đang chờ đối thủ...';
    }
}

function disableBoard() {
    boardCells.forEach(cell => {
        cell.style.pointerEvents = 'none';
    });
}

function enableBoard() {
    boardCells.forEach(cell => {
        cell.style.pointerEvents = 'auto';
    });
}

function resetBoard() {
    currentBoard = Array(9).fill(null);
    updateBoardUI(currentBoard);
    enableBoard();
    gameMessage.textContent = '';
    turnInfo.textContent = '';
    isMyTurn = false;
    resetGameBtn.style.display = 'none'; // Ẩn nút reset khi game chưa kết thúc
}

// Xử lý nút chơi lại (có thể yêu cầu server reset game hoặc tạo phòng mới)
resetGameBtn.addEventListener('click', () => {
    // Để đơn giản, khi chơi lại, bạn có thể buộc người chơi tạo/tham gia phòng mới
    // hoặc triển khai logic reset game trên server và gửi lại trạng thái
    alert('Để chơi lại, vui lòng tạo hoặc tham gia phòng mới.');
    window.location.reload(); // Tải lại trang để về màn hình chọn phòng
});

// Khởi tạo trạng thái ban đầu
resetBoard();