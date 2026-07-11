const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve static files from Resources folder explicitly
app.use('/Resources', express.static(path.join(__dirname, 'Resources')));

// Handle all routes - serve index.html for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`ALTRIN server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});