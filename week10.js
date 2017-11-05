var express = require('express'),
    app = express();
const { Pool } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'mibacon';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'sensor';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

app.get('/', function (req, res) {
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query
    var q = `SELECT EXTRACT(DAY FROM datatime AT TIME ZONE 'America/New_York') as sensorday, 
             EXTRACT(MONTH FROM datatime AT TIME ZONE 'America/New_York') as sensormonth, 
             count(*) as num_obs, 
             max(temp) as max_temp, 
             min(temp) as min_light,
             max(fsr) as max_fsr, 
             min(fsr) as min_fsr
             FROM sensordata 
             GROUP BY sensormonth, sensorday;`;

    client.connect();
    client.query(q, (qerr, qres) => {
        res.send(qres.rows);
        console.log('responded to request');
    });
    client.end();
});

app.listen(3000, function () {
    console.log('Server listening...');
});
