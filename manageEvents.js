const mongoose = require('mongoose');
const Event = mongoose.model('Event');
var PastEventModel = require('./models/pastEvent.js');
mongoose.model('PastEventModel');
const Cron = require('cron');

const CronJob = Cron.CronJob;

module.exports = () => {
  new CronJob(
    "* 0 0 * * *",
    () => {
      mongoose
        .connect(process.env.MONGODB_URI), { useNewUrlParser: true }
        .then(() => {
          console.log("connected to MongoDB");
          const currentDate = new Date();
          Event.find()
            .then(events => {
             const matchingEvents = events.filter(
                e => new Date(e.eventDateUntil) < currentDate
              );

              const pastEventIds = matchingEvents.map(i => i.id);

              const addEventsPromises = matchingEvents.map(e => {
                const newRecord = JSON.parse(JSON.stringify(e));
                delete newRecord._id;
                delete newRecord.__v;
                const newPastEvent = new PastEventModel(newRecord);
                return newPastEvent.save();
              });

              Promise.all(addEventsPromises).then(addResArr => {
                console.log(
                  "added all past events to pastEvents collection",
                  addResArr && addResArr.length
                );

                Event.deleteMany({_id: {$in: pastEventIds}})
                .then(res => {
                  console.log(
                    "removed all past events from events collection",
                    pastEventIds && pastEventIds.length
                  );
                })
                .catch(err =>  console.log('errrrr', err));
              });
            })
            .catch(err => console.log("err fetching events", err));
        })
        .catch(err => console.log("err connecting to DB", err));
    },
    null,
    true
  );
};

