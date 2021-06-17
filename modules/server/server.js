require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const usersRouter = require('../routers/users.router');
const errorMiddleware = require('../middlewares/error.middleware');

const PORT = process.env.PORT || 5000;
const server = express();
server.use(morgan('common'));
server.use(express.json());
server.use(cookieParser());
server.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
server.use('/api/v1', usersRouter);
server.use(errorMiddleware);

exports.start = async () => {
  try {
    await mongoose.connect(process.env.CLOUD_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    server.listen(PORT, () => console.warn(`Server started on PORT: ${PORT}`));
  } catch (err) {
    console.warn(err);
  }
};
