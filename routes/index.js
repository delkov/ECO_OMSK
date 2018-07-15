var express = require('express');
var router = express.Router();
var db = require('../queries');

// const path = require('path');

router.get('/air_data', db.getAircrafts_RealTime);
router.get('/Flight_stats', db.getFlights_Stats);
router.get('/Noise_stats/:level', db.getNoise_Stats);

// router.get('/noise_data', db.getNoise_RealTime);
router.get('/noise_data_last_5m', db.getNoise_Last_5m);
router.get('/noise_data/:level_from/:level_to/:max_distance/:from/:to', db.getNoise_Table);
router.get('/noise_data/unique/:level_from/:level_to/:max_distance/:from/:to', db.getNoise_Unique_Table);
router.get('/noise_data/:track', db.getNoise_Table_by_Track);
router.get('/noise_data/chart/:track', db.getNoise_Chart_by_Track);
// router.get('/noise_data/:level_from/:level_to/:from/:to', db.getNoise_Table);
router.get('/tracks/:from/:to', db.getTracks_Table);
router.get('/tracks/:track', db.getTracks_Table_by_Track);


// router.post('/api/puppies', db.createPuppy);
// router.put('/api/puppies/:id', db.updatePuppy);
// router.delete('/api/puppies/:id', db.removePuppy);
// router.get('/', (req, res, next) => {
  // res.sendFile('index.html');
// });
// router.post('/', function (req, res) {
//   res.send(req.body)
// })


// router.get(/a/, function (req, res) {
//   res.send('/a/')
// // })
// var cb0 = function (req, res, next) {
//   console.log('CB0')
//   next()6
// }

// var cb1 = function (req, res, next) {
//   console.log('CB1')
//   next()
// }

// var cb2 = function (req, res) {
//   res.send('Hello from C!')
// }

// router.get('/example/c', [cb0, cb1, cb2])
// router.get('/example/b', function (req, res, next) {
//   console.log('the response will be sent by the next function ...')
//   next()
// }, function (req, res) {
//   res.send('Hello from B!')
// })

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})


// define the home page route
router.get('/', function (req, res) {
  // res.send('index')
    res.render('index', { title: '' });
})

// router.get('/users/:userId/books/:bookId', function (req, res) {
//   res.send(req.params)
// })

// router.post('/', function (req, res) {
//   // res.send('Got it')

//      return res.json({
//         errors: ['Failed to create photo'],
//         REQ_BODY: [req.body.id]
//       });

// })
// router.get('/', function(req, res) {
  // res.render('index', { title: '' });
// });

module.exports = router;