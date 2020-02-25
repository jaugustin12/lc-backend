const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const ctrlEvent = require('../controllers/event.controller');


const jwtHelper = require('../config/jwtHelper');
router.route('/test').post(jwtHelper.verifyJwtToken, (req, res) => {
  console.log('yes');
  console.log('req.body:', req.body);
  res.status(200).send(req.body);
});
router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.post('/refresh', ctrlUser.refresh);
router.post('/logout', ctrlUser.logout);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.get('/users', jwtHelper.verifyJwtToken, ctrlUser.users);
router.post('/posts', jwtHelper.verifyJwtToken, ctrlUser.posts);
router.post('/ticketmaster-events', ctrlEvent.tmEvents);
router.get('/users2', ctrlUser.users);
router.get("/profile/:email", ctrlUser.friendProfile);
router.post('/follow', jwtHelper.verifyJwtToken, ctrlUser.follow);
router.get('/events', ctrlEvent.events);
router.post('/events/add', jwtHelper.verifyJwtToken, ctrlEvent.addEvent);
router.post('/events/upload', ctrlEvent.uploadFiles);
router.route('/events/:id').get((req, res) => {
  Event.findById(req.params.id, (err, event) => {
    if (err)
      console.log(err);
    else
      res.json(event);
  });
});

router.route('/events/update/:id').post((req, res) => {
  Event.findById(req.params.id, (err, event) => {
    if (!event)
      return next(new Error('Could not load document'));
    else{
      // This may change here
      event.eventName= req.body.eventName;
      event.eventLocation= req.body.eventLocation;
      event.eventLat= req.body.eventLat;
      event.eventLng= req.body.eventLng;
      event.eventDateFrom= req.body.eventDateFrom;
      event.eventDateUntil= req.body.eventDateUntil;
      event.eventDescr= req.body.eventDescr;
      event.price= req.body.price;
      event.eventPrivate= req.body.eventPrivate;
      event.interest= req.body.interest;

      event.save().then(event => {
        res.json('Update done');
      }).catch(err => {
        res.status(400).send('Update failed');
      });
    }
  });
});

router.route('/events/delete/:id').get((req, res) => {
  Event.findByIdAndRemove({_id: req.params.id}, (err, event) => {
    if (err)
      res.json(err);
    else
      res.json('Remove successfully');
  })
})

/* router.post('/unfollow', function(req, res) {
    const user_id = req.user._id;
    const to_follow_id = req.body.follow_id;

    let bulk = Follow.collection.initializeUnorderedBulkOp();

    bulk.find({ 'user': Types.ObjectId(user_id) }).upsert().updateOne({
        $pull: {
            following: Types.ObjectId(to_follow_id)
        }
    });

    bulk.find({ 'user': Types.ObjectId(to_follow_id) }).upsert().updateOne({
        $pull: {
            followers: Types.ObjectId(user_id)
        }
    })

    bulk.execute(function(err, doc) {
        if (err) {
            return res.json({
                'state': false,
                'msg': err
            })
        }
        res.json({
            'state': true,
            'msg': 'Unfollowed'
        })
    })
}) */

module.exports = router;
