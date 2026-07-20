const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Log current directory for debugging
console.log('📁 Current directory:', __dirname);
console.log('📄 Files in directory:', fs.readdirSync(__dirname));

// ==================== MIDDLEWARE ====================

// Serve static files from the root directory
app.use(express.static(__dirname, {
    maxAge: '1d', // Cache static files for 1 day
    etag: true,
    lastModified: true
}));

// Explicitly serve the Resources folder with correct MIME types
app.use('/Resources', express.static(path.join(__dirname, 'Resources'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
        // Set correct MIME types for images
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
            res.setHeader('Content-Type', 'image/jpeg');
        } else if (filePath.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        } else if (filePath.endsWith('.webp')) {
            res.setHeader('Content-Type', 'image/webp');
        } else if (filePath.endsWith('.gif')) {
            res.setHeader('Content-Type', 'image/gif');
        }
    }
}));

// ==================== ROUTES ====================

// Serve index.html for the root route
app.get('/', (req, res) => {
    console.log('🌐 Serving index.html');
    res.sendFile(path.join(__dirname, 'index.html'), (err) => {
        if (err) {
            console.error('❌ Error serving index.html:', err);
            res.status(500).send('Error loading page');
        }
    });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    // Skip API routes (if any)
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For all other routes, serve index.html
    console.log(`📄 Serving index.html for route: ${req.path}`);
    res.sendFile(path.join(__dirname, 'index.html'), (err) => {
        if (err) {
            console.error('❌ Error serving index.html:', err);
            res.status(500).send('Error loading page');
        }
    });
});

// ==================== HEALTH CHECK ====================

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
    console.log(`⚠️ 404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log('\n===================================');
    console.log(`🚀 ALTRIN Server is running!`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log('===================================\n');
    
    // Check if index.html exists
    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
        console.log('✅ index.html found at:', indexPath);
    } else {
        console.log('❌ WARNING: index.html NOT found at:', indexPath);
    }
    
    // Check if Resources folder exists
    const resourcesPath = path.join(__dirname, 'Resources');
    if (fs.existsSync(resourcesPath)) {
        const files = fs.readdirSync(resourcesPath);
        console.log(`✅ Resources folder found with ${files.length} files`);
    } else {
        console.log('❌ WARNING: Resources folder NOT found at:', resourcesPath);
    }
});

// ==================== GRACEFUL SHUTDOWN ====================

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM signal, closing server...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT signal, closing server...');
    process.exit(0);
});