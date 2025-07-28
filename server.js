const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;

// Serve static files (HTML, JS, CSS)
app.use(express.static('public'));

app.get('/api/data', (req, res) => {
    const baseDir = path.join(__dirname, 'data');
    const dates = fs.readdirSync(baseDir).filter(dateDir => 
        fs.existsSync(path.join(baseDir, dateDir, 'AllPrices.json'))
    );

    let combinedData = {};

    for (const date of dates) {
        const filePath = path.join(baseDir, date, 'AllPrices.json');
        try {
            const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            combinedData[date] = json;
        } catch (err) {
            console.error(`Failed to load JSON for date ${date}:`, err);
            combinedData[date] = [];
        }
    }

    res.json(combinedData);
});

app.listen(PORT, () => {
    console.log(`📊 Server running at http://localhost:${PORT}`);
});
