const express = require('express');
const bodyParser = require('body-parser');
const ticketRoutes = require('./routes/ticketRoutes');

const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors())
app.use(bodyParser.json());

app.use('/api', ticketRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
