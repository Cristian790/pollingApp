const mongoose = require('mongoose');
const { data } = require('./data');

mongoose.connect(data.database)
  .then(() => { console.log('Connected to MLab') })
  .catch(err => console.log(err));

mongoose.Promise = global.Promise;
