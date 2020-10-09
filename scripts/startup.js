module.exports = {
    /**
     * Retrieves the Series ID of electric power carbon dioxide emission series ID of all states and stores them in states_lookup
     */
    startup: async function () {
        var res = await fetch(`http://api.eia.gov/category/?api_key=${API_KEY}&category_id=2251609`);
        if (res.ok) {
            var json = await res.json();
            var series = json.category.childseries;

            statesLookup = new Map();

            for (var i = 0; i < series.length; i++) {
                var name = series[i].name.split('Electric power carbon dioxide emissions, coal, ');

                statesLookup.set(name[1], series[i].series_id);
            }
            console.log("Successfully retrieved states series code")
        }
        else {
            console.log('Failed to load states series code');
        }
    }
};
