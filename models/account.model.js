const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var AccountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  username: {
    type: String,
  },
  fullName: {
    type: String,
    trim: true,
  },
  // Other fields can be here. Cut short for brevity
});

module.exports = mongoose.model('Account', AccountSchema);
