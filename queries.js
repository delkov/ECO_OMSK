var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const connectionString = {
    host: 'localhost',
    port: 5432,
    database: 'eco_db',
    user: 'postgres',
    password: 'z5UHwrg8'
};
var db = pgp(connectionString);


// Aircrafts for last 300 sec
function getAircrafts_RealTime(req, res, next) {
db.any('WITH last_time AS\
  (SELECT track, time_track FROM eco.tracks ORDER BY time_track DESC LIMIT 1) SELECT\
    ff.time_track,ff.track,ff.callsign, ff.altitude,ff.speed,ff.angle,ff.latitude,ff.longitude,ff.vertical_speed,ff.altitude, ff.distance_1, eco.aircraft_tracks.icao, \
    eco.aircrafts.type, eco.aircrafts.operator, eco.routes.FromAirport, eco.routes.ToAirport\
  FROM (SELECT * FROM (SELECT ROW_NUMBER() OVER (PARTITION BY track ORDER BY time_track desc) AS r, t.*  FROM eco.tracks t\
    WHERE time_track > (SELECT time_track FROM last_time) - INTERVAL \'300 seconds\') AS x WHERE  x.r <= 1) AS ff\
    LEFT JOIN eco.aircraft_tracks ON ff.track = eco.aircraft_tracks.track LEFT JOIN eco.aircrafts ON eco.aircraft_tracks.icao  = eco.aircrafts.icao\
    LEFT JOIN eco.routes ON ff.callsign = eco.routes.callsign')   
   .then(function (data) {
      res.send(data)
    })
    .catch(function (err) {
      return next(err);
    });
}

// // take LAST NOISE
// function getNoise_RealTime(req, res, next) {
//   db.any({
//     text:'SELECT ss.time_noise, ss.slow, eco.aircraft_tracks.icao FROM \
//     (SELECT extract (epoch from time_noise)*1000 time_noise, slow, track FROM eco.noise ORDER BY time_noise DESC LIMIT 1) AS ss\
//     LEFT JOIN eco.aircraft_tracks ON ss.track = eco.aircraft_tracks.track',
//            rowMode: 'array'
//          })
//     .then(function (data) {
//       res.send(data)
//           // message: 'Retrieved ALL puppies'
//     })
//     .catch(function (err) {
//       return next(err);
//     });
// }


// GET NOISE FROM LAST 300s == 5 min
function getNoise_Last_5m(req, res, next) {
  db.any({
    text:
    'WITH t AS ( SELECT extract (epoch from time_noise)*1000 as time_noise, slow FROM\
    eco.noise ORDER BY time_noise DESC LIMIT 300) SELECT * FROM t ORDER BY t.time_noise ASC;',
           rowMode: 'array'
         })
    .then(function (data) {
      res.send(data)
          // message: 'Retrieved ALL puppies'        
    })
    .catch(function (err) {
      return next(err);
    });
}

// CHART BY TRACK
function getNoise_Chart_by_Track(req, res, next) {
  var track = parseInt(req.params.track);
  db.any({
    text:
    'WITH ff AS (SELECT first_time, last_time FROM eco.aircraft_tracks WHERE track=$1),\
      t AS (SELECT extract (epoch from time_noise)*1000 as time_noise, slow FROM\
      eco.noise WHERE time_noise >= (SELECT first_time FROM ff) AND time_noise <= (SELECT last_time FROM ff) ORDER BY time_noise) SELECT * FROM t ORDER BY t.time_noise ASC;',
      values: track,
      rowMode: 'array'
    })
    .then(function (data) {
      res.send(data)
    })
    .catch(function (err) {
      return next(err);
    });
}




function getFlights_Stats(req, res, next) {
  db.any({
    text:
    "SELECT extract (epoch from date_trunc('day', first_time))*1000 AS month, floor(count(*)) AS amount  FROM eco.aircraft_tracks  GROUP BY month order by month;",
       rowMode: 'array'
    })
    .then(function (data) {
      res.send(data)
    })
    .catch(function (err) {
      return next(err);
    });
}

function getNoise_Stats(req, res, next) {
    var level = parseInt(req.params.level);
    db.any({
      text:"SELECT extract (epoch from date_trunc('day', time_noise))*1000 AS day, floor(count(*)) AS amount FROM eco.noise WHERE slow>=$1 GROUP BY day order by day;",
      values: level,
      rowMode: 'array'
      })
      .then(function (data) {
        res.send(data)
            // message: 'Retrieved ALL puppies'
      })
      .catch(function (err) {
        return next(err);
      });
}

// NOISE TAB
function getNoise_Table(req, res, next) {
    var level_from = parseInt(req.params.level_from);
    var level_to = parseInt(req.params.level_to);
    var max_distance = parseInt(req.params.max_distance);
    var from = req.params.from;
    var to = req.params.to;

    db.any('SELECT\
    ss.time_noise, ss.base_name, ss.slow, ss.track, ss.aircraft_time,\
     eco.aircraft_tracks.icao, eco.aircrafts.type, eco.aircrafts.operator,\
     eco.routes.fromairport, eco.routes.toairport,\
     eco.tracks.callsign, eco.tracks.altitude,eco.tracks.speed,eco.tracks.angle,eco.tracks.latitude,eco.tracks.longitude,eco.tracks.vertical_speed,eco.tracks.distance_1\
    FROM (SELECT time_noise, base_name, slow, track, distance, aircraft_time FROM eco.noise\
    WHERE slow >= $1 AND slow <= $2 AND distance <= $3 AND time_noise >= (SELECT to_timestamp($4)) AND time_noise <= (SELECT to_timestamp($5)) ORDER BY time_noise) AS ss\
     LEFT JOIN eco.aircraft_tracks ON ss.track = eco.aircraft_tracks.track\
     LEFT JOIN eco.aircrafts ON eco.aircraft_tracks.icao  = eco.aircrafts.icao\
     LEFT JOIN eco.tracks ON ss.track  = eco.tracks.track AND eco.tracks.time_track = ss.aircraft_time\
     LEFT JOIN eco.routes ON eco.tracks.callsign  = eco.routes.callsign;',
     [level_from, level_to, max_distance, from, to])
    .then(function (data) {
      res.status(200)
      .json({
        data: data
      })
    })
    .catch(function (err) {
      return next(err);
    });
}

function getNoise_Unique_Table(req, res, next) {
    var level_from = parseInt(req.params.level_from);
    var level_to = parseInt(req.params.level_to);
    var max_distance = parseInt(req.params.max_distance);
    var from = req.params.from;
    var to = req.params.to;

    db.any('WITH ss AS (SELECT  \
            time_noise, track, slow, distance, aircraft_time\
          FROM\
              eco.noise\
          WHERE\
              (track, time_noise, slow) IN (\
              SELECT\
                track, time_noise, MAX(slow) OVER (PARTITION BY track) AS mx\
              FROM\
                eco.noise\
              WHERE\
                slow >= $1 AND slow <= $2 AND distance <= $3 AND time_noise >= (SELECT to_timestamp($4)) AND time_noise <= (SELECT to_timestamp($5)) \
              ) \
          ORDER BY time_noise)\
          SELECT\
              ss.time_noise, ss.slow, ss.track, ss.aircraft_time,\
              eco.aircraft_tracks.icao, eco.aircrafts.type, eco.aircrafts.operator,\
              eco.tracks.callsign, eco.tracks.altitude,eco.tracks.speed,eco.tracks.angle,eco.tracks.latitude,eco.tracks.longitude,eco.tracks.vertical_speed,eco.tracks.distance_1\
          FROM ss\
    LEFT JOIN eco.aircraft_tracks ON ss.track = eco.aircraft_tracks.track\
    LEFT JOIN eco.aircrafts ON eco.aircraft_tracks.icao  = eco.aircrafts.icao\
    LEFT JOIN eco.tracks ON ss.track  = eco.tracks.track AND eco.tracks.time_track = ss.aircraft_time\
    LEFT JOIN eco.routes ON eco.tracks.callsign  = eco.routes.callsign;',
     [level_from, level_to, max_distance, from, to])
    .then(function (data) {
      res.status(200)
      .json({
        data: data
      })
    })
    .catch(function (err) {
      return next(err);
    });
}













function getNoise_Table_by_Track(req, res, next) {
    var track = parseInt(req.params.track);
    db.any('WITH ff AS (SELECT first_time, last_time FROM eco.aircraft_tracks WHERE track=$1)\
SELECT\
    ss.time_noise, ss.base_name, ss.slow, ss.track, ss.aircraft_time,\
     eco.aircraft_tracks.icao, eco.aircrafts.type, eco.aircrafts.operator,\
     eco.routes.fromairport, eco.routes.toairport,\
     eco.tracks.callsign, eco.tracks.altitude,eco.tracks.speed,eco.tracks.angle,eco.tracks.latitude,eco.tracks.longitude,eco.tracks.vertical_speed,eco.tracks.distance_1\
    FROM (SELECT time_noise, base_name, slow, track, distance, aircraft_time FROM eco.noise\
    WHERE time_noise >= (SELECT first_time FROM ff) AND time_noise <= (SELECT last_time FROM ff) ORDER BY time_noise) AS ss\
     LEFT JOIN eco.aircraft_tracks ON ss.track = eco.aircraft_tracks.track\
     LEFT JOIN eco.aircrafts ON eco.aircraft_tracks.icao  = eco.aircrafts.icao\
     LEFT JOIN eco.tracks ON ss.track  = eco.tracks.track AND eco.tracks.time_track = ss.aircraft_time\
     LEFT JOIN eco.routes ON eco.tracks.callsign  = eco.routes.callsign;', track)
    .then(function (data) {
      res.status(200)
      .json({
        data: data
      })
    })
    .catch(function (err) {
      return next(err);
    });
}



// TRACKS TAB
function getTracks_Table(req, res, next) {
    var from = req.params.from;
    var to = req.params.to;
    db.any('SELECT\
            ff.time_track,ff.track,ff.callsign, ff.altitude,ff.speed,ff.angle,ff.latitude,ff.longitude,ff.vertical_speed, ff.distance_1,\
            eco.aircraft_tracks.icao,\
            eco.aircrafts.type, eco.aircrafts.operator,\
            eco.routes.fromairport, eco.routes.toairport\
          FROM (SELECT time_track, track, callsign, altitude, speed, angle, latitude, longitude, vertical_speed, distance_1 FROM eco.tracks\
          WHERE time_track >= (SELECT to_timestamp($1)) and time_track <= (SELECT to_timestamp($2))) AS ff\
          LEFT JOIN eco.aircraft_tracks ON ff.track = eco.aircraft_tracks.track\
          LEFT JOIN eco.aircrafts ON  eco.aircrafts.icao = eco.aircraft_tracks.icao\
          LEFT JOIN eco.routes ON eco.routes.callsign = ff.callsign  ORDER BY ff.time_track DESC;', [from, to])
    .then(function (data) {
      res.status(200)
      .json({
        data: data
      })
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTracks_Table_by_Track(req, res, next) {
    var track = parseInt(req.params.track);
    db.any('SELECT ff.time_track,ff.track,ff.callsign,ff.altitude,ff.speed,ff.angle,ff.latitude,ff.longitude, ff.vertical_speed, ff.distance_1,\
    eco.aircraft_tracks.icao,\
    eco.aircrafts.type, eco.aircrafts.operator,\
    eco.routes.fromairport, eco.routes.toairport\
      FROM (SELECT * FROM eco.tracks WHERE track=$1) AS ff\
      LEFT JOIN eco.aircraft_tracks ON ff.track = eco.aircraft_tracks.track\
      LEFT JOIN eco.aircrafts ON  eco.aircrafts.icao = eco.aircraft_tracks.icao\
      LEFT JOIN eco.routes ON eco.routes.callsign = ff.callsign;', track)
    .then(function (data) {
      res.status(200)
      .json({
        data: data
      })
    })
    .catch(function (err) {
      return next(err);
    });
}









function getTracks_Stats(req, res, next) {
    var level = parseInt(req.params.level);
  db.any('SELECT time_noise, base_name, slow, track FROM eco.noise WHERE slow > $1;', level)
    .then(function (data) {
      res.status(200)
      .json({
        data: data
      })
    })
    .catch(function (err) {
      return next(err);
    });
}


module.exports = {
  // REAL-TIME
  getAircrafts_RealTime: getAircrafts_RealTime,
  getNoise_Last_5m:getNoise_Last_5m,
  // getNoise_RealTime: getNoise_RealTime,
  // NOISE
  getNoise_Table: getNoise_Table,
  getNoise_Unique_Table:getNoise_Unique_Table,
  getNoise_Table_by_Track:getNoise_Table_by_Track,
  getNoise_Chart_by_Track:getNoise_Chart_by_Track,
  // TRACKS
  getTracks_Table_by_Track:getTracks_Table_by_Track,
  getTracks_Table: getTracks_Table,
  // STATS
  getFlights_Stats: getFlights_Stats,
  getNoise_Stats: getNoise_Stats
};