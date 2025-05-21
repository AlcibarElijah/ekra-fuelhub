/* -------------------------------------------------------------------------- */
/*                                  requires                                  */
/* -------------------------------------------------------------------------- */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

/* -------------------------------------------------------------------------- */
/*                                  variables                                 */
/* -------------------------------------------------------------------------- */
/* ------------------------------ env variables ----------------------------- */
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

/* ------------------------------- express app ------------------------------ */
const app = express();

/* -------------------------------------------------------------------------- */
/*                                  on start                                  */
/* -------------------------------------------------------------------------- */
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to the database.');
    app.listen(PORT, () => {
      console.log('Server running on port', PORT);
    })
  })
  .catch((err) => {
    console.error('There was an error connecting to the database.', err);
  });

/* -------------------------------------------------------------------------- */
/*                                 middleware                                 */
/* -------------------------------------------------------------------------- */
app.use(morgan('dev')); // log requests to the console

app.use(express.json()); // parse JSON request bodies