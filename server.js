const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌞 Ruuf Panel Calculator running on http://localhost:${PORT}`);
    console.log('¡Listo para calcular paneles solares!!');
});