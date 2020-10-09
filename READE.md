# Zallat coding excercise

Express js app that takes data from the US energy information registery and process it into an user friendly format.
Requires api key from the US energy information registery.

To run the application, run node app.js in the directory

Requires an .env file with the following attributes:
- PORT: port the experss app will be run on
- API_KEY: API key from the US energy information registery
- DB_USER: Mongodb user id
- DB_PASSWORD: password of the mongodb user
- DB_NAME: Name of the mongodb database being used

### Api documentation
> /emission

returns emission of a state on a specific year, requires query variables state and year

> /emissionTax

return the emission of a state between a year range, requires query variables state, from and to.

> /highestEmission

returns the state with the highest emission between a year range. requires query variables from and to.