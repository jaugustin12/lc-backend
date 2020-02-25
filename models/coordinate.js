import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let CoordinateSchema = new Schema({
  latitude: Number,
  longitude: Number
});

var Coordinate = mongoose.model('Coordinate', CoordinateSchema);

Coordinate.exports = Coordinate;

