const express = require('express');
const cors = require('cors');

const app = express();

// Middleware avec CORS plus permissif
app.use(cors({
    origin: '*', // Accepte toutes les origines en développement
    credentials: true
}));

app.use(express.json());

// Routes
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    // Log pour déboguer
    console.log('Tentative de connexion reçue:', { username, password });

    if (username === 'admin' && password === 'admin123') {
        console.log('Connexion admin réussie');
        return res.json({
            success: true,
            user: {
                username: 'admin',
                role: 'admin',
                token: 'admin_token_123'
            }
        });
    } else if (username === 'company' && password === 'company123') {
        console.log('Connexion company réussie');
        return res.json({
            success: true,
            user: {
                username: 'company',
                role: 'company',
                token: 'company_token_123'
            }
        });
    } else {
        console.log('Échec de connexion');
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

const PORT = 5004;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Credentials attendus:');
    console.log('Admin - username: admin, password: admin123');
    console.log('Company - username: company, password: company123');
});