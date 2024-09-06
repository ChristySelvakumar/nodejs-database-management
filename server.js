const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;

// Sample data (replace with actual data retrieval logic)
const expiredDatabases = [
    { DatabaseName: 'db1', ExpiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { DatabaseName: 'db2', ExpiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

app.get('/', (req, res) => {
    let formHtml = `
    <div class="container">
        <h1>Manage Expired or Expiring Databases</h1>
        <form method="post" action="/">
    `;

    expiredDatabases.forEach(db => {
        formHtml += `
        <div class="db-item">
            <h2>Database: ${db.DatabaseName}</h2>
            <p>Expiry Date: ${db.ExpiryDate.toISOString().split('T')[0]}</p>
            <div class="radio-group">
                <label><input type="radio" name="${db.DatabaseName}" value="7"> Extend by 7 days</label>
                <label><input type="radio" name="${db.DatabaseName}" value="15"> Extend by 15 days</label>
                <label><input type="radio" name="${db.DatabaseName}" value="30"> Extend by 30 days</label>
                <label><input type="radio" name="${db.DatabaseName}" value="0"> No need to extend (Delete after 5 hours)</label>
            </div>
        </div>
        `;
    });

    formHtml += `
        <input type="submit" class="submit-btn" value="Submit">
        </form>
    </div>
    `;

    res.send(formHtml);
});

app.post('/', (req, res) => {
    // Process form data here
    let outputHtml = "<html><body><h1>Updated Expiry Dates</h1>";

    Object.keys(req.body).forEach(key => {
        const daysToExtend = parseInt(req.body[key], 10);
        if (daysToExtend === 0) {
            outputHtml += `<p>Database: ${key} will be deleted after 5 hours.</p>`;
            // Add logic to handle deletion
        } else {
            outputHtml += `<p>Expiry date for ${key} has been extended by ${daysToExtend} days.</p>`;
            // Add logic to update expiry date
        }
    });

    outputHtml += "</body></html>";
    res.send(outputHtml);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
