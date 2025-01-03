const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Log pour déboguer
  console.log('Login attempt:', { username, password });

  // Vérification pour admin
  if (username === 'admin' && password === 'admin123') {
    console.log('Admin login successful');
    return res.json({
      success: true,
      user: {
        id: 1,
        username: 'admin',
        role: 'admin',
        token: 'admin_token_123'
      }
    });
  }
  
  // Vérification pour entreprise (test)
  if (username === 'company' && password === 'company123') {
    console.log('Company login successful');
    return res.json({
      success: true,
      user: {
        id: 2,
        username: 'company',
        role: 'company',
        token: 'company_token_123'
      }
    });
  }

  // Échec de connexion
  console.log('Login failed');
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
});