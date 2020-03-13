const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let pastEvent = new Schema({
  eventName: {
    type: String
  },
  eventLocation: {
    type: String
  },
  eventLat: {
    type: Number
  },
  eventLng: {
    type: Number
  },
  eventDateFrom: {
    type: String
  },
  eventDateUntil: {
    type: String
  },
  eventDescr: {
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
  responsible: {
    type: String,
    default: '0000'
  },
  status: {
    type: String,
    default: 'Open'
  }
});

module.exports = mongoose.model('PastEvent', pastEvent)

