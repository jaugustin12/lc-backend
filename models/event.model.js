const mongoose = require("mongoose");


const Schema = mongoose.Schema;

let Event = new Schema({
  eventName: {
    type: String
  },
  location: {
    type: String
  },
  lat: {
    type: Number
  },
  long: {
    type: Number
  },
  startDate: {
    type: String
  },
  eventDateUntil: {
    type: String
  },
  info: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  interest: {
    type: Number,
    default: 0
  },
  eventPrivate: {
    type: Boolean,
    default: false
  },
  promoter: {
/*     required: true */
  },
  status: {
    type: String,
    default: 'Open'
  }
});

module.exports = mongoose.model('Event', Event)
