const express = require('express');
const axios = require('axios');
const AWS = require('aws-sdk');
const fs = require('fs');
var moment = require('moment');
const Constants = require('./constants.js')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
app.use(express.json());

var covid = null;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const uploadString = (str, filename) => {
  const params = {
    Bucket: 'jasoncovid',
    Key: filename,
    Body: str
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log('err:', err);
    } else {
      console.log(`File uploaded successfully. ${data.Location}`);
    }
  })
}

// setInterval(() => {
  axios.get('https://api.covid19api.com/dayone/country/australia/status/confirmed/live')
    .then(res => {
      const covids = res.data;
      // const covids = JSON.parse(Constants.COVIDS_TEMP);

      // get last 2 days info and subtract cases to get the latest 24 hours cases
      let twoDaysCovids = new Array(2).fill(0).map(a => []);
      let index = 0;
      twoDaysCovids[index].unshift({...covids[covids.length - 1]});
      for (let i = covids.length - 2; i >= 0; i--) {
        if (covids[i + 1].Date !== covids[i].Date) {
          index++;
          if (index > 1) {
            break;
          }
        }
        twoDaysCovids[index].unshift({...covids[i]});
      }

      twoDaysCovids[0].forEach(covid => {
        covid.Cases = covid.Cases - twoDaysCovids[1].find(c => c.Province === covid.Province).Cases
      });

      const tempDate = moment(new Date(twoDaysCovids[0][0].Date)).format('dddd, DD MMMM YYYY');

      // 6 months statistics
      let sixMonthsCovids = {}
      index = 0;
      for (let i = covids.length - 1; i >= 0; i--) {
        if (!sixMonthsCovids[covids[i].Province]) {
          sixMonthsCovids[covids[i].Province] = [{...covids[i]}];
        } else if (new Date(sixMonthsCovids[covids[i].Province][0].Date).getMonth() === new Date(covids[i].Date).getMonth()) {
          continue;
        } else if (sixMonthsCovids[covids[i].Province].length >= 7) {
          break;
        } else {
          sixMonthsCovids[covids[i].Province][0].Cases -= covids[i].Cases;
          sixMonthsCovids[covids[i].Province].unshift({...covids[i]});
        }
      }

      covid = {
        oneDayCovids: {
          date: tempDate,
          covids: twoDaysCovids[0]
        },
        longTermCovids: {
          covids: sixMonthsCovids
        }
      }

      console.log(covid);
      console.table(covid.longTermCovids.covids.Victoria);

      const now = new Date(Date.now());
      uploadString(JSON.stringify(covid), `${Constants.FILE_NAME}_${now.getHours()}_${now.getMinutes()}__${now.getDate()}_${now.getMonth() + 1}`);

    }).catch(err => {
      console.log('err:', err);
    });

// }, 1000 * 60 * 60 * 12);
// }, 1000 * 60 * 60);

app.get('/', (req, res) => {
  if (covid) {
    res.send(covid);
  } else {
    res.status(404).send('Cannot access Covid-19 API');
  }

})

app.listen(8080, () => console.log(`Listening on port 8080...`));

module.exports = app;