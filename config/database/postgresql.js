const { Pool } = require('pg');
const readline = require('readline'); // Import readline for user input
require('dotenv').config();

// Khởi tạo Pool kết nối tới PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 20, // Tối đa 20 kết nối (tùy app scale cỡ nào)
    min: 1, // Giữ ít nhất 1 connection sống
    idleTimeoutMillis: 30000, // Đóng kết nối sau 30s không dùng
    connectionTimeoutMillis: 5000, // Timeout khi connect DB
});

// Helper log function
const logMessage = (message, isError = false) => {
    const timestamp = new Date().toISOString();
    console[isError ? 'error' : 'log'](`[${timestamp}] ${message}`);
};

// Định nghĩa các câu lệnh SQL để tạo bảng và index
// Thứ tự tạo bảng quan trọng để tránh lỗi khóa ngoại
const createTableQueries = [
    `CREATE TABLE buildings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        full_address TEXT NOT NULL,
        short_name VARCHAR(100),
        rooms INTEGER DEFAULT 0,
        owner_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE rooms (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(12, 2) NOT NULL,
        deposit NUMERIC(12, 2) DEFAULT 0,
        size INTEGER,
        max_tenants INTEGER DEFAULT 1,
        building_id INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
        floors INTEGER,
        owner_id INTEGER,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE assets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(100),
        price NUMERIC(12, 2),
        owner_id INTEGER,
        room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
        warranty TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE fees (
        id SERIAL PRIMARY KEY,
        room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        cycle_month VARCHAR(7) NOT NULL, -- ví dụ '2025-07'
        quantity INTEGER NOT NULL DEFAULT 1,
        unit_price NUMERIC(12, 2) NOT NULL,
        total_price NUMERIC(12, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(12, 2) NOT NULL,
        fee_id INTEGER REFERENCES fees(id) ON DELETE SET NULL,
        building_id INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );`,
    // Các câu lệnh tạo index
    `CREATE INDEX idx_rooms_building_id ON rooms(building_id);`,
    `CREATE INDEX idx_assets_room_id ON assets(room_id);`,
    `CREATE INDEX idx_fees_room_id ON fees(room_id);`,
    `CREATE INDEX idx_services_building_id ON services(building_id);`
];

// Thứ tự xóa bảng (ngược lại với thứ tự tạo để tránh lỗi khóa ngoại)
const dropTableQueries = [
    `DROP TABLE IF EXISTS services CASCADE;`,
    `DROP TABLE IF EXISTS fees CASCADE;`,
    `DROP TABLE IF EXISTS assets CASCADE;`,
    `DROP TABLE IF EXISTS rooms CASCADE;`,
    `DROP TABLE IF EXISTS buildings CASCADE;`,
    `DROP TABLE IF EXISTS users CASCADE;`
];

// Hàm kiểm tra kết nối khi khởi động
const connectToDatabase = async () => {
    logMessage('🔌 Đang kiểm tra kết nối tới PostgreSQL...');
    try {
        await pool.query('SELECT 1'); // test query
        logMessage('✅ Đã kết nối thành công tới PostgreSQL.');
        return true;
    } catch (error) {
        logMessage(`❌ Lỗi kết nối PostgreSQL: ${error.message}`, true);
        return false;
    }
};

// Hàm xóa tất cả các bảng
const dropAllTables = async () => {
    logMessage('🗑️ Đang xóa các bảng hiện có...');
    for (const query of dropTableQueries) {
        try {
            await pool.query(query);
            logMessage(`   - Đã thực thi: ${query.split(' ')[2]}`); // Log tên bảng được xóa
        } catch (error) {
            logMessage(`   - Lỗi khi xóa bảng: ${query.split(' ')[2]} - ${error.message}`, true);
        }
    }
    logMessage('🗑️ Đã hoàn tất việc xóa các bảng.');
};

// Hàm tạo tất cả các bảng và index
const createAllTables = async () => {
    logMessage('✨ Đang tạo các bảng và index mới...');
    for (const query of createTableQueries) {
        try {
            await pool.query(query);
            logMessage(`   - Đã thực thi: ${query.substring(0, 50)}...`); // Log một phần câu lệnh
        } catch (error) {
            logMessage(`   - Lỗi khi tạo bảng/index: ${query.substring(0, 50)}... - ${error.message}`, true);
            // Nếu lỗi do bảng đã tồn tại, có thể bỏ qua nếu là chế độ "cập nhật"
            // Tuy nhiên, hàm này chỉ dùng cho "tạo lại", nên lỗi là không mong muốn
        }
    }
    logMessage('✨ Đã hoàn tất việc tạo các bảng và index.');
};

// Hàm đảm bảo các bảng tồn tại (tạo nếu chưa có)
const ensureTablesExist = async () => {
    logMessage('🔄 Đang kiểm tra và tạo các bảng nếu chưa tồn tại...');
    for (const query of createTableQueries) {
        try {
            await pool.query(query);
            logMessage(`   - Đã tạo hoặc đã tồn tại: ${query.substring(0, 50)}...`);
        } catch (error) {
            // Lỗi phổ biến khi bảng đã tồn tại là '42P07' (duplicate_table)
            if (error.code === '42P07') {
                logMessage(`   - Bảng/index đã tồn tại: ${query.substring(0, 50)}... (bỏ qua)`, false);
            } else {
                logMessage(`   - Lỗi khi đảm bảo bảng/index: ${query.substring(0, 50)}... - ${error.message}`, true);
            }
        }
    }
    logMessage('🔄 Đã hoàn tất việc kiểm tra và đảm bảo các bảng.');
};

// Hàm hỏi người dùng muốn làm gì với bảng
const promptUserForTableAction = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(
            'Bạn muốn làm gì với các bảng cơ sở dữ liệu? (1: Tạo lại tất cả, 2: Cập nhật/Đảm bảo tồn tại, Thoát: Bất kỳ phím nào khác) -> ',
            async (answer) => {
                rl.close();
                if (answer === '1') {
                    logMessage('Bạn đã chọn: Tạo lại tất cả các bảng.');
                    await dropAllTables();
                    await createAllTables();
                    resolve(true);
                } else if (answer === '2') {
                    logMessage('Bạn đã chọn: Cập nhật/Đảm bảo các bảng tồn tại.');
                    await ensureTablesExist();
                    resolve(true);
                } else {
                    logMessage('Không thực hiện hành động nào với các bảng. Ứng dụng sẽ thoát.');
                    resolve(false);
                }
            }
        );
    });
};

// Tùy chọn: Ping mỗi 60s để giữ alive nếu server không truy vấn thường xuyên
setInterval(async () => {
    try {
        await pool.query('SELECT 1');
    } catch (err) {
        logMessage(`⚠️ Ping DB thất bại: ${err.message}`, true);
    }
}, 60000); // mỗi 60 giây

// Export pool và các hàm quản lý schema
module.exports = { pool, connectToDatabase, promptUserForTableAction };
