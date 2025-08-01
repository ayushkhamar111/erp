const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authenticate = require('./Middleware/AuthMiddleware');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Your routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/branches',authenticate, require('./Routes/branch'));
app.use('/api/material',authenticate, require('./Routes/material'));
app.use('/api/vendor',authenticate, require('./Routes/vendor'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
