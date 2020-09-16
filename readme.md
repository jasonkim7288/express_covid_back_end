# Covid back-end

## Link
### Github link : https://github.com/jasonkim7288/express_covid_back_end

## Description
Covid API(https://documenter.getpostman.com/view/10808728/SzS8rjbc) offers daily covid-19 statistics. However the number of access per hour or day is quite small. This covid back-end app gets the data from Covid API 4 times a day, and store it into the remote storage so that my another covid app (inside of 'OK Jason' app) can access this information frequently.

## JSON format
```js
{
  "oneDayCovids": {
    "date": "Friday, 04 September 2020",
    "covids": [{
      "Country": "Australia",
      "CountryCode": "AU",
      "Province": "Australian Capital Territory",
      "City": "",
      "CityCode": "",
      "Lat": "-35.47",
      "Lon": "149.01",
      "Cases": 0,
      "Status": "confirmed",
      "Date": "2020-09-04T00:00:00Z"
    },

    ...

    {
      "Country": "Australia",
      "CountryCode": "AU",
      "Province": "Victoria",
      "City": "",
      "CityCode": "",
      "Lat": "-37.81",
      "Lon": "144.96",
      "Cases": 64,
      "Status": "confirmed",
      "Date": "2020-09-04T00:00:00Z"
    }]
  },
  "longTermCovids": {
    "covids": {
      "Western Australia": [{
        "Country": "Australia",
        "CountryCode": "AU",
        "Province": "Western Australia",
        "City": "",
        "CityCode": "",
        "Lat": "-31.95",
        "Lon": "115.86",
        "Cases": 364,
        "Status": "confirmed",
        "Date": "2020-03-31T00:00:00Z"
      }, {
        "Country": "Australia",
        "CountryCode": "AU",
        "Province": "Western Australia",
        "City": "",
        "CityCode": "",
        "Lat": "-31.95",
        "Lon": "115.86",
        "Cases": 187,
        "Status": "confirmed",
        "Date": "2020-04-30T00:00:00Z"
      }, {

      ...
```

## Tech stack
- Node JS : Back end javascript runtime
- Express JS : Web application framework
- Heroku : deploy the code
- Heroku schedular : run the app 4 times a day
- AWS S3 Bucket : store covid-19 information as a JSON file