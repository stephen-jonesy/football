const body = document.querySelector('.body');
const standings = "https://api.football-data.org/v2/competitions/PL/teams"
const matches = "https://api.football-data.org/v2/competitions/PL/matches";

Promise.all([
	fetch(standings, {
    method: "GET",
        headers: {
        "X-Auth-Token": "ef72570ff371408f9668e414353b7b2e"
        }
    }),
	fetch(matches, {
    method: "GET",
      headers: {
      "X-Auth-Token": "ef72570ff371408f9668e414353b7b2e"
      }
    })
]).then(function (responses) {
	// Get a JSON object from each of the responses
	return Promise.all(responses.map(function (response) {
		return response.json();
	}));
}).then(function (data) {
	// Log the data to the console
	// You would do something with both sets of data here

  standingsData = data[0];
  matchesData = data[1];
  console.log(matchesData)

  doesStuff()

}).catch(function (error) {
	// if there's an error, log it
	console.log(error);
});



/*
function doesStuff() {
  console.log(standingsData.teams);
  console.log(matchesData.matches);

  matchesData.matches.forEach(match => {
    findCrests(match)
    const foundHome = standingsData.teams.find(function(team) {
    if(team.id == match.homeTeam.id)
        return team;
    });
    const foundAway = standingsData.teams.find(function(team) {
      if(team.id == match.awayTeam.id)
          return team;
      });
    
    homeCrest = foundHome.crestUrl;
    awayCrest = foundAway.crestUrl;

    matchesContainer = document.createElement('div');
    body.appendChild(matchesContainer);
    matchesContainer.innerHTML = `<div class="match"><img src="${homeCrest}" alt=""><p>${match.homeTeam.name}</p><img src="${awayCrest}" alt=""><p>${match.awayTeam.name}</p></div>`

  });

};

function findCrests(match) {
  const foundHome = standingsData.teams.find(function(team) {
    if(team.id == match.homeTeam.id)
        return team;
    });
  const foundAway = standingsData.teams.find(function(team) {
    if(team.id == match.awayTeam.id)
      return team;
    });
    homeCrest = foundHome.crestUrl;
    awayCrest = foundAway.crestUrl;
};

*/

