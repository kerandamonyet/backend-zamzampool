const express = require('express');
const bodyParser = require('body-parser');
const ticketRoutes = require('./routes/ticketRoutes');
const adminRoutes = require('./routes/adminRoutes')

const cors = require('cors');
const statusRoutes = require('./routes/statusRoutes');
const roleRoutes = require('./routes/roleRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
require('dotenv').config();

app.use(cors())
app.use(bodyParser.json());

const routes = [ticketRoutes, adminRoutes, statusRoutes, roleRoutes, authRoutes];

routes.forEach(route => {
    app.use('/api', route);
});

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
