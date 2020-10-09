async function fetchData(seriesId) {
    // could probably cache results here
    var res = await fetch(`http://api.eia.gov/series/?api_key=${API_KEY}&series_id=${seriesId}`);
    if (res.ok) {
        var json = await res.json();
        var seriesData = json.series[0];
        return seriesData.data
    }
    else {
        console.log('Failed to load states series code');
        return null
    }
}


module.exports = {
    lookupEmission: async function (seriesId, year) {
        /**
         * Retrieves the Series ID of electric power carbon dioxide emission series ID of all states and stores them in states_lookup
         */

        let fetchedData = await fetchData(seriesId);
        if (fetchedData !== null) {
            for (var i = 0; i < fetchedData.length; i++) {
                if (fetchedData[i][0] === year) {
                    console.log('Successfully loaded carbon emmission data for the year requested');
                    return fetchedData[i][1]
                }
            }

            console.log('Unable to find the year requested');
            return null;
        }
    },

    emissionCharge: async function (seriesId, fromYear, toYear) {
        let fetchedData = await fetchData(seriesId);
        if (fetchedData !== null) {
            let sum = 0;
            for (var i = 0; i < fetchedData.length; i++) {
                if (fetchedData[i][0] >= fromYear && fetchedData[i][0] <= toYear) {
                    sum = sum + fetchedData[i][1];
                }
            }
            return sum;
        }
    },

    queryLargestEmission: async function (fromYear, toYear) {
        const pipeline = [
            {
                '$unwind': { 'path': "$data" }
            },
            {
                '$skip': 1
            },
            {
                '$project': {
                    '_id': 0,
                    'name': 1,
                    'year': {
                        '$toInt': {
                            '$arrayElemAt': ["$data", 0]
                        }
                    },
                    'between': {
                        '$cond': {
                            'if': {
                                '$and': [
                                    {
                                        '$gte': [
                                            {
                                                '$toInt': {
                                                    '$arrayElemAt': ["$data", 0]
                                                }
                                            },
                                            parseInt(fromYear)
                                        ]
                                    },
                                    {
                                        '$lte': [
                                            {
                                                '$toInt': {
                                                    '$arrayElemAt': ["$data", 0]
                                                }
                                            },
                                            parseInt(toYear)
                                        ]
                                    }]
                            },
                            'then': 1,
                            'else': 0
                        }
                    },
                    'emission': {
                        '$arrayElemAt': ["$data", 1]
                    }
                }
            }, {
                '$match': {
                    'between': 1
                }
            },
            {
                '$group': {
                    '_id': "$name",
                    'amt': {
                        '$sum': "$emission"
                    }
                }
            },
            {
                '$sort': {
                    "amt": -1
                }
            },
            {
                '$limit': 1
            }
        ]

        const aggCursor = mongoclient.db("project0").collection("emissions").aggregate(pipeline);

        res = await aggCursor.next();

        await aggCursor.close();

        let titleSplit = res._id.split('Electric power carbon dioxide emissions, coal, ');

        let result = { state: titleSplit[1], emission: res.amt }

        return result;
    }

}