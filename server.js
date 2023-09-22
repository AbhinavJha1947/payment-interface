const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abhinav@12345',
    database: 'paymentdb',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Serve payment form
app.get('/payment', (req, res) => {
    res.sendFile(__dirname + '/payment.html');
});

// Handle payment submission
app.post('/charge', (req, res) => {
    const { cardNumber, cvv, name, amount } = req.body;

    // Save payment details to the MySQL database
    const sql = 'INSERT INTO payments (card_number, cvv, name, amount) VALUES (?, ?, ?, ?)';
    db.query(sql, [cardNumber, cvv, name, amount], (err, result) => {
        if (err) {
            res.send('Payment failed: ' + err.message);
        } else {
            res.send('Payment successful. Payment ID: ' + result.insertId);
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
