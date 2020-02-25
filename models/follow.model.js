const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var FollowSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  followers: [{
    type: String,
    ref: 'Card'
  }],
  following: [{
    type: String,
    ref: 'Card'
  }]
}, { toJSON: { virtuals: true } }
);

module.exports = mongoose.model('Follow', FollowSchema);
