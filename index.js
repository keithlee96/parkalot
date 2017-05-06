/**
 * Created by Keith Lee on 6/05/2017.
 */

var express = require('express')
var sql = require('mysql')
var app = express()

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.post('/parkingspot', function (req, res) {

    /**
    Following code should return the closest carpark at a specific time.
    */
    var inLatitude = parseFloat(req['lat']);
    var inLongitude = parseFloat(req['lng']);

    var config = {
        host: 'rent-out-your-garage-angel-hack-2017.c68iuepecghy.ap-southeast-2.rds.amazonaws.com',
        user: 'root',
        password: 'rootasd123',
        database: 'test'
    };
    var connection = sql.createConnection(config);
    connection.connect();

    var query = "SELECT latitude1, longitude1, latitude2, longitude2, time_limit from parking_data WHERE(starttime <= CURTIME() AND endtime >= CURTIME());";

    connection.query(query, function(err, rows){
        if(err) throw err;

        var closest = 999999999999999;
        // NOTE this will not break unless we are exaclty at the north pole.

        var closestLat1 = 0;
        var closestLong1 = 0;
        var closestLat2 = 0;
        var closestLong2 = 0;
        var time_limit = 0;

        for(var row in rows){

            var latitiude = (parseFloat(rows[row].latitude1) + parseFloat(rows[row].longitude1)) / 2;
            var longitude = (parseFloat(rows[row].longitude2) + parseFloat(rows[row].latitude2)) / 2;
            var dist = (inLatitude - latitiude) * (inLatitude - latitiude) + (inLongitude - longitude) * (inLongitude - longitude);
            if(dist < closest){
                closest = dist;
                closestLat1 = rows[row].latitude1;
                closestLat2 = rows[row].latitude2;
                closestLong2 = rows[row].longitude2;
                closestLong1 = rows[row].longitude1;
                time_limit = rows[row].time_limit;

            }

        }

        var obj = {lat1: closestLat1, lng1: closestLong1, lat2: closestLat2, lng2: closestLong2, time_limit: time_limit};
        res.send(obj);

    });

    connection.end();


})

app.listen(3000, function () {

    console.log('Example app listening on port 3000!')

})