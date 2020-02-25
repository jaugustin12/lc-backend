const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const axios = require('axios');
const crypto = require('crypto');
const multer = require('multer');
const methodOverride = require('method-override');
const { saveFileFromStream } = require('../lib/azure-connect');
const User = mongoose.model('User');


module.exports = {
  events: (req, res) => {
    Event.find((err, events) => {
      if (err) res.send(err);
      else res.status(200).send(events);
    });
  },
  tmEvents: (req, res) => {
    /*   adding it to this query */
    const { hash } = req.body;
    axios.get(
        'http://app.ticketmaster.com/discovery/v2/events.json?apikey=hneV7jzq6Uz7IyQC7GtEHz5s2nTsU6Jm&page=0&size=200&geoPoint=' +
          hash +
          '&sort=distance,date,asc'
      )
/*       .then( function (tmEvents) {
        return tmEvents.json();
      }) */
      .then(json => {
        res.send(json.data._embedded.events);
      })
      .catch(err => {
        res.send(err);
      });
  },
  addEvent: (req, res) => {
    Event.create({
      eventName: req.body.eventName,
      location: req.body.eventLocation,
      lat: req.body.eventLat,
      long: req.body.eventLng,
      startDate: req.body.eventDateFrom,
      eventDateUntil: req.body.eventDateUntil,
      info: req.body.eventDescr,
      price: req.body.price,
      status: req.body.status,
      promoter: req.user.email,
    })
      .then(event => {
        User.findOne({ email: event.promoter}, function (err, user) {
          if (!user)
          return next(new Error('Could not load document'));
          else{
            user.posts.userPosts.push(event._id);
            user.save();
            res.status(200).send({'event': 'Added successfully'});
        }
      }
      )
    })
      .catch(err => {
            res.status(400).send('Failed to create new record because', err);
      });
  },
  uploadFiles: async (req, res) => {
    try {
      const { stream, filename, mimetype, encoding, size } = req.file;

      await saveFileFromStream(
        userSetting.privateKey,
        userSetting.map,
        filename,
        stream,
        size,
      );
      res.send(200);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
