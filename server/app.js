const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/api.js');

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
