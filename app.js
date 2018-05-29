const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const poll = require('./routes/poll');
const connection = require('./config/connectDB');
const app = express();

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Enable CORS
app.use(cors());

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/poll', poll);

const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});