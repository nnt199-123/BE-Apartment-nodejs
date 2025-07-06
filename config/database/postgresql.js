const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 20,                   // tối đa 20 kết nối (tùy app scale cỡ nào)
    min: 1,                    // giữ ít nhất 1 connection sống
    idleTimeoutMillis: 30000, // đóng kết nối sau 30s không dùng
    connectionTimeoutMillis: 5000, // timeout khi connect DB
});

// Helper log function
const logMessage = (message, isError = false) => {
    const timestamp = new Date().toISOString();
    console[isError ? 'error' : 'log'](`[${timestamp}] ${message}`);
};

// Kiểm tra kết nối khi khởi động
const connectToDatabase = async () => {
    logMessage('🔌 Đang kiểm tra kết nối tới PostgreSQL...');
    try {
        await pool.query('SELECT 1'); // test query
        logMessage('✅ Đã kết nối thành công tới PostgreSQL.');
    } catch (error) {
        logMessage(`❌ Lỗi kết nối PostgreSQL: ${error.message}`, true);
        process.exit(1); // thoát để tránh lỗi tiềm ẩn sau này
    }
};

// Tùy chọn: Ping mỗi 60s để giữ alive nếu server không truy vấn thường xuyên
setInterval(async () => {
    try {
        await pool.query('SELECT 1');
    } catch (err) {
        logMessage(`⚠️ Ping DB thất bại: ${err.message}`, true);
    }
}, 60000); // mỗi 60 giây

module.exports = { pool, connectToDatabase };
