const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Chỉ cần khai báo một lần
const app = express();

// Thay mật khẩu và tên database của bạn
const uri = "mongodb+srv://hieuthai171203:tokuda.123@websales.hmwjxxi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// Middleware
app.use(cors()); // Chỉ cần gọi một lần

// Route để lấy danh sách thực phẩm từ MongoDB
app.get('/api/foods', async (req, res) => {
    try {
        await client.connect();
        const db = client.db("WebSales");
        const foodsCollection = db.collection("foods");

        // Lấy tất cả sản phẩm
        const foods = await foodsCollection.find({}).toArray();
        res.json(foods);
    } catch (err) {
        console.error("Lỗi khi lấy thực phẩm:", err);
        res.status(500).json({ error: "Không thể lấy danh sách thực phẩm." });
    } finally {
        await client.close();
    }
});

// Khởi động server
app.listen(3000, () => {
    console.log('Server đang chạy trên http://localhost:3000');
});
