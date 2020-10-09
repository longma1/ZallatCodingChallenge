const fetchFunction = require('./lookup');

module.exports = function (app) {
    /**
     * Returns hello world.
     * Not really relevant to the assignment
     */
    app.get('/', (req, res) => {
        res.send('Hello World!')
    });

    /**
     * Get the emission of a state of a year
     * Sample request: http://localhost:3000/emission/?state=Alabama&year=2000
     * Returns json with result which is the emission of said state during that year
     * Sample response: {"result":74.939037}
     */
    app.get('/emission', async (req, res) => {
        let year = req.query.year;
        let state = req.query.state

        if (statesLookup !== null && statesLookup.has(state) && !isNaN(year)) {
            console.log(`Lookup on an state ${state} on year ${year}`);
            const searchResult = await fetchFunction.lookupEmission(statesLookup.get(state), year);

            if (searchResult === null) {
                res.sendStatus(404);
            }
            else {
                res.json({ result: searchResult })
            }
        }
        else {
            console.log(`Invalid lookup`);
            res.sendStatus(404);
        }
    });

    /**
     * Calculates total emission of a state between a period of time
     * Sample request:  http://localhost:3000/emissionTax?state=Alabama&from=2000&to=2005
     * Returns json with total emission of said state between the years input
     * Sample response:{"result": 440.245909}
     */

    app.get('/emissionTax', async (req, res) => {
        let fromYear = req.query.from;
        let toYear = req.query.to;
        let state = req.query.state

        if (statesLookup !== null && statesLookup.has(state) && !isNaN(fromYear) && !isNaN(toYear)) {
            console.log(`Lookup on an state ${state} on year range ${fromYear} to ${toYear}`);
            const searchResult = await fetchFunction.emissionCharge(statesLookup.get(state), fromYear, toYear);

            if (searchResult === null) {
                res.sendStatus(404);
            }
            else {
                res.json({ result: searchResult })
            }
        }
        else {
            console.log(`Invalid lookup`);
            res.sendStatus(404);
        }
    });

    /**
     * Calculated the state with the highest emission between a period of time based on data in mongodb
     * Sample request: http://localhost:3000/highestEmission/?from=2000&to=2005
     * Returns the state name and total emission that is the highest between the two years
     * Sample response: {"state": "Alabama","emission": 440.245909}
     */
    app.get('/highestEmission', async (req, res) => {
        let fromYear = req.query.from;
        let toYear = req.query.to;

        if (isNaN(fromYear) || isNaN(toYear)) {
            res.sendStatus(404);
        }

        let result = await fetchFunction.queryLargestEmission(fromYear, toYear);

        res.json(result);

    });

}