// seedFoods.js
const { MongoClient } = require("mongodb");

// Thay mật khẩu của bạn (không kèm < >)
const uri = "mongodb+srv://hieuthai171203:tokuda.123@websales.hmwjxxi.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const productsData = [
 
];

async function seedFoods() {
    try {
        await client.connect();
        // CHỈNH LẠI database name thành đúng case trên Atlas:
        const db = client.db("WebSales");
        const foodsCol = db.collection("foods");
    
        // Xóa toàn bộ document cũ nếu có
        await foodsCol.deleteMany({});
    
        // Chèn mới toàn bộ
        const result = await foodsCol.insertMany(productsData);
        console.log(`Đã chèn ${result.insertedCount} sản phẩm vào collection 'foods'.`);
    } catch (err) {
        console.error("Lỗi khi chèn dữ liệu thực phẩm:", err);
    } finally {
        await client.close();
    }
}

seedFoods();
