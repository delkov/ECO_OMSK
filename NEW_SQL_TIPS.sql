WITH last_time AS
  (SELECT track, time_track FROM eco.tracks ORDER BY time_track DESC LIMIT 1) SELECT
    ff.time_track,ff.track,ff.callsign, ff.altitude,ff.speed,ff.angle,ff.latitude,ff.longitude,ff.vertical_speed,ff.altitude, ff.distance_1, eco.aircraft_tracks.icao, 
    eco.aircrafts.type, eco.aircrafts.operator, eco.routes.FromAirport, eco.routes.ToAirport
  FROM (SELECT * FROM (SELECT ROW_NUMBER() OVER (PARTITION BY track ORDER BY time_track desc) AS r, t.*  FROM eco.tracks t
    WHERE time_track > (SELECT time_track FROM last_time) - INTERVAL '300 seconds') AS x WHERE  x.r <= 1) AS ff
    LEFT JOIN eco.aircraft_tracks ON ff.track = eco.aircraft_tracks.track LEFT JOIN eco.aircrafts ON eco.aircraft_tracks.icao  = eco.aircrafts.icao
    LEFT JOIN eco.routes ON ff.callsign = eco.routes.callsign;






    SELECT
    ss.time_noise, ss.slow, ss.track, ss.aircraft_time,
     eco.aircraft_tracks.icao, eco.aircrafts.type, eco.aircrafts.operator,
     eco.tracks.callsign, eco.tracks.altitude,eco.tracks.speed,eco.tracks.angle,eco.tracks.latitude,eco.tracks.longitude,eco.tracks.vertical_speed,eco.tracks.distance_1
    FROM (SELECT time_noise, base_name, slow, track, distance, aircraft_time FROM eco.noise
   	WHERE slow >= 75 AND slow <= 100 AND distance <= 10000 AND time_noise >= '2018-05-23 00:00:00' AND time_noise <= '2018-05-26' ORDER BY time_noise) AS ss
     LEFT JOIN eco.aircraft_tracks ON ss.track = eco.aircraft_tracks.track
     LEFT JOIN eco.aircrafts ON eco.aircraft_tracks.icao  = eco.aircrafts.icao
     LEFT JOIN eco.tracks ON ss.track  = eco.tracks.track AND eco.tracks.time_track = ss.aircraft_time
     LEFT JOIN eco.routes ON eco.tracks.callsign  = eco.routes.callsign;



SELECT
    ss.time_noise, ss.base_name, ss.slow, ss.track, ss.aircraft_time,
     eco.aircraft_tracks.icao, eco.aircrafts.type, eco.aircrafts.operator,
     eco.routes.fromairport, eco.routes.toairport,
     eco.tracks.callsign, eco.tracks.altitude,eco.tracks.speed,eco.tracks.angle,eco.tracks.latitude,eco.tracks.longitude,eco.tracks.vertical_speed,eco.tracks.distance_1
    FROM (SELECT time_noise, base_name, slow, track, distance, aircraft_time FROM eco.noise
   	WHERE slow >= 75 AND slow <= 100 AND distance <= 10000 AND time_noise >= '2018-05-22' AND time_noise <= '2018-05-25' ORDER BY time_noise) AS ss
     LEFT JOIN eco.aircraft_tracks ON ss.track = eco.aircraft_tracks.track
     LEFT JOIN eco.aircrafts ON eco.aircraft_tracks.icao  = eco.aircrafts.icao
     LEFT JOIN eco.tracks ON ss.track  = eco.tracks.track AND eco.tracks.time_track = ss.aircraft_time
     LEFT JOIN eco.routes ON eco.tracks.callsign  = eco.routes.callsign;






SELECT time_noise, track, slow, distance FROM eco.noise WHERE track=61802;


SELECT 
	time_noise, track, slow, distance
FROM
	eco.noise
WHERE
	slow >= 1 AND slow <= 100 AND distance <= 10000 AND time_noise >= '2018-05-23' AND time_noise <= '2018-05-25' ORDER by time_noise;





WITH ss AS (SELECT  
    time_noise, track, slow, distance, aircraft_time
FROM
    eco.noise
WHERE
    (track, time_noise, slow) IN (
		SELECT
			track, time_noise, MAX(slow) OVER (PARTITION BY track) AS mx
		FROM
			eco.noise
		WHERE
			time_noise >= '2018-05-23' AND time_noise <= '2018-05-25' AND slow >= 99 AND slow <= 100 AND distance <= 10000 
    ) 
ORDER BY time_noise)
SELECT
    ss.time_noise, ss.slow, ss.track, ss.aircraft_time,
    eco.aircraft_tracks.icao, eco.aircrafts.type, eco.aircrafts.operator,
    eco.tracks.callsign, eco.tracks.altitude,eco.tracks.speed,eco.tracks.angle,eco.tracks.latitude,eco.tracks.longitude,eco.tracks.vertical_speed,eco.tracks.distance_1
FROM ss
	LEFT JOIN eco.aircraft_tracks ON ss.track = eco.aircraft_tracks.track
    LEFT JOIN eco.aircrafts ON eco.aircraft_tracks.icao  = eco.aircrafts.icao
    LEFT JOIN eco.tracks ON ss.track  = eco.tracks.track AND eco.tracks.time_track = ss.aircraft_time
    LEFT JOIN eco.routes ON eco.tracks.callsign  = eco.routes.callsign;







-- ORDER BY
    -- time_noise;




SELECT 
track, MAX(slow) AS max_slow FROM eco.noise
GROUP BY track
LIMIT 10;


-- WHERE slow >= 99 AND slow <= 100 AND distance <= 10000 AND time_noise >= '2018-05-23' AND time_noise <= '2018-05-25'
