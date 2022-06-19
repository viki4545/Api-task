const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userInfo',{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(con => {console.log("Connected to db");})
  .catch(error => {console.log(error);});

module.exports = mongoose;
