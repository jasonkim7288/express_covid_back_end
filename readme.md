# Covid back-end

## Link
### Github link : https://github.com/jasonkim7288/express_covid_back_end

## Description
Covid API(https://documenter.getpostman.com/view/10808728/SzS8rjbc) offers daily covid-19 statistics. However the number of access per hour or day is quite small. This covid back-end app gets the data from Covid API 4 times a day, and store it into the remote storage so that my another covid app (inside of 'OK Jason' app) can access this information frequently.


## Tech stack
- Node JS : Back end javascript runtime
- Express JS : Web application framework
- Heroku : deploy the code
- Heroku schedular : run the app 4 times a day
- AWS S3 Bucket : store covid-19 information as a JSON file