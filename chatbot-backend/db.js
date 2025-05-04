// db.js
const mongoose = require('mongoose');

const uri = `mongodb+srv://hieuthai171203:${encodeURIComponent('tokuda.123')}@websales.hmwjxxi.mongodb.net/?retryWrites=true&w=majority&appName=WebSales`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'WebSales' 
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Lỗi kết nối MongoDB Atlas:'));
db.once('open', () => {
  console.log('✅ Đã kết nối tới MongoDB Atlas thành công!');
});

module.exports = db;
