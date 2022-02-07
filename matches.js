
function loadMatches() {
    const body = document.querySelector('.body');
    const teams = "https://api.football-data.org/v2/competitions/PL/teams";
    const matches = "https://api.football-data.org/v2/competitions/PL/matches";
    const standings = "https://api.football-data.org/v2/competitions/PL/standings";

    Promise.all([
        fetch(teams, {
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
        }),
        fetch(standings, {
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
        const teamsData = data[0];
        const matchesData = data[1];
        const standingsData = data[2];
        console.log(matchesData.matches);

        const competitionName = matchesData.competition.name;
        const matches = matchesData.matches;
        pageTitle(competitionName);
        switchClicked(matches, teamsData)

    }).catch(function (error) {
        console.log(error);
    });
};

function pageTitle(name) {
    const pageTitle = document.querySelector('.competition-title');
    
    pageTitle.innerHTML = `<h1>${name}</h1>`;
}; 

function switchClicked(matches, teamsData) {
    matchesArray = [];
    matchesArray.push(matches);
    let scheduledContainer = document.querySelector('.content-table');
    let resultsContainer = document.querySelector('.results-table');
    let toggleTableContainer = document.querySelectorAll('.toggle-table-container p');
    scheduledContainer.style.display = 'none';
    
    document.addEventListener('click', e => {
        const item = e.target;

        if (item.innerText == 'Fixtures') {
            resultsContainer.style.display = 'none';
            scheduledContainer.style.display = 'block';
            toggleTableContainer.forEach(el => {
                el.classList.remove('active-table-toggle')
            });
            item.classList.add('active-table-toggle');

        }
        if (item.innerText == 'Results') {
            scheduledContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            toggleTableContainer.forEach(el => {
                el.classList.remove('active-table-toggle')
            });       
            item.classList.add('active-table-toggle');

        }
    })
    
    sMatches = matchesArray[0].filter(function(match){
        return match.status === 'SCHEDULED';

    })
    finishedMatches = matchesArray[0].filter(function(match){
        return match.status === 'FINISHED';

    })


    populate(sMatches, teamsData, scheduledContainer)
    populate(finishedMatches, teamsData, resultsContainer)

}


function populate(scheduledMatches, teamsData, contentContainer) {

    if (scheduledMatches == 0) {
        contentContainer.innerText = 'no matches available'

    }
    else {
        scheduledMatches.reverse()
        console.log(scheduledMatches[0].status)

        function formulateDate(date) {
            let day = date.slice(8,10);
            let month = date.slice(5,7);
            let year = date.slice(0,4);
            let monthName = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
    
            return(`${day} ${monthName[parseInt(month-1)]} ${year}`)
    
        }

        createDates(scheduledMatches);
    
        function createDates(scheduledMatches) {
            console.log(scheduledMatches);
     
            matchDates = [];
            scheduledMatches.forEach(el => {
                let timeAndDate = el.utcDate;
                let matchDate = timeAndDate.slice(0,10);
                matchDates.push(matchDate);
            });

            const uniqueDates = [...new Set(matchDates.map(x => x))];
            function datesOnload() {
                for (i = 0; i < 5; i++) {
                    let dateContainer = document.createElement('div');
                    dateContainer.classList.add('match-row');
                
                    dateContainer.innerHTML = `<div class="match-date">${formulateDate(uniqueDates[i]) }</div></div class="matches-container"></div>`;
                
                    contentContainer.appendChild(dateContainer);
                    addMatches(uniqueDates[i], dateContainer, scheduledMatches)
                    
    
                }

            }
            datesOnload()

            function infinetescroll() {
                let newI = i+5

                for (i; i < newI; i++) {
                    if (i == uniqueDates.length) {
                        break;
                    }

                    let dateContainer = document.createElement('div');
                    dateContainer.classList.add('match-row');
                
                    dateContainer.innerHTML = `<div class="match-date">${formulateDate(uniqueDates[i]) }</div></div class="matches-container"></div>`;
                
                    contentContainer.appendChild(dateContainer);
                    addMatches(uniqueDates[i], dateContainer, scheduledMatches)

                }   
                newI = i+5
             
            
            }

            window.onscroll = function() {
                if ((window.innerHeight + window.scrollY ) >= document.body.scrollHeight) {
                  // you're at the bottom of the page
                  infinetescroll()
                }

            };


        };
        
        function addMatches(date, dateContainer, scheduledMatches) {
    
            scheduledMatches.forEach(match => {
                findCrests(match)
                let editedHomeTeamName = match.homeTeam.name.replaceAll("FC", '');
                let editedAwayTeamName = match.awayTeam.name.replaceAll("FC", '');
                let homeTeam = editedHomeTeamName;
                let awayTeam = editedAwayTeamName;
                let matchData;
                let timeAndDate = match.utcDate;
                let matchDate = timeAndDate.slice(0,10);
                let matchTime = timeAndDate.slice(11,16);
                let homeTeamId = match.homeTeam.id;
                let awayTeamId = match.awayTeam.id;

                if (scheduledMatches[0].status == 'FINISHED') {
                    let homeData = match.score.fullTime.homeTeam
                    let awayData = match.score.fullTime.awayTeam
                    matchData = `${homeData}-${awayData}`;
                }
                else {
                    matchData = `${matchTime}`;
                }
    
                let row = document.createElement('div');
        
                if (matchDate === date) {
                    row.innerHTML = `<div class="match-info"><div class="team-crests-container"><img src="${homeCrest}" alt="" class="team-crests home-crest"></div><div class="home-team"id="${homeTeamId}"> ${homeTeam} </div><div class="match-time"> ${matchData} </div><div class="away-team" id="${awayTeamId}"> ${awayTeam} </div><img src="${awayCrest}" alt="" class="team-crests away-crest">`;
                    dateContainer.appendChild(row);
        
                };
        
            });
                
        }
    
        function findCrests(match) {
            const foundHome = teamsData.teams.find(function(team) {
              if(team.id == match.homeTeam.id)
                return team;
            });
            const foundAway = teamsData.teams.find(function(team) {
              if(team.id == match.awayTeam.id)
                return team;
            });
            homeCrest = foundHome.crestUrl;
            awayCrest = foundAway.crestUrl;
        };
    
    }
    //matchStatsWindow(teamsData, standingsData);
};

/*
function matchStatsWindow(teamsData, standingsData) {
    const wrapper = document.querySelector('.wrapper');
    contentTable = document.querySelector('.content-table');
    statsWindow = document.querySelector('.stats-window');
    closer = document.querySelector('.close-container');

    window.addEventListener('click', e => {
        const item = e.target;
        if(item.classList.contains("match-info")){
            wrapper.style.display = "flex";
            statsWindow.style.display = "block";
            closer.style.display = "block";
            let homeId = item.children[1].id;
            let awayId = item.children[3].id;
            matchIds(homeId, awayId);

        };
        if(item.classList.contains("close-container")){
            console.log('clicked');
            wrapper.style.display = "none";
            statsWindow.style.display = "none";
            closer.style.display = "none";
        };
    });

    function matchIds(id1, id2) {
        console.log(id1, id2);
        const homeTeamData = teamsData.teams.find(function(team) {
            if(id1 == team.id) {
                return team;
            };
        });
        const awayTeamData = teamsData.teams.find(function(team) {
            if(id2 == team.id) {
                return team;
            };
        });

        const homeTableData = standingsData.standings[0].table.find(function(teams) {
            if(id1 == teams.team.id) {
                return teams;
            };
        });

        const awayTableData = standingsData.standings[0].table.find(function(teams) {
            if(id2 == teams.team.id) {
                return teams;
            };
        });

        populateStatsWindow(homeTeamData, awayTeamData, homeTableData, awayTableData);
        
    };

    function populateStatsWindow(homeTeamData, awayTeamData, homeTableData, awayTableData) {
        console.log(homeTeamData);
        let editedHomeTeamName = homeTeamData.name.replaceAll("FC", '');
        let editedAwayTeamName = awayTeamData.name.replaceAll("FC", '');

        statsWindow.innerHTML = `
        <div class="stats-header">
                <div class="teams"><img src="${homeTeamData.crestUrl}" alt="" class="team-crests"><h3>${editedHomeTeamName}</h3></div></th>
                <th></th>
                <th><div class="teams"><h3>${editedAwayTeamName}</h3><img src="${awayTeamData.crestUrl}" alt="" class="team-crests"></div>

        </div>
        <table class="mini-table">
            
            <tr>
                <td>${homeTableData.position}</td>
                <td>Position</td>
                <td>${awayTableData.position}</td>
            </tr>
            <tr>
                <td>${homeTableData.form}</td>
                <td>Form</td>
                <td>${awayTableData.form}</td>
            </tr>
            <tr>
                <td>${homeTableData.won}</td>
                <td>Won</td>
                <td>${awayTableData.won}</td>
            </tr>
            <tr>
                <td>${homeTableData.draw}</td>
                <td>Drew</td>
                <td>${awayTableData.draw}</td>
            </tr>
            <tr>
                <td>${homeTableData.lost}</td>
                <td>Lost</td>
                <td>${awayTableData.lost}</td>
            </tr>
            <tr>
                <td>${homeTableData.goalDifference}</td>
                <td>Goal Difference</td>
                <td>${awayTableData.goalDifference}</td>
            </tr>
            <tr>
                <td>${homeTableData.goalsAgainst}</td>
                <td>Goals Aginst</td>
                <td>${awayTableData.goalsAgainst}</td>
            </tr>
            <tr>
                <td>${homeTableData.goalsFor}</td>
                <td>Goals For</td>
                <td>${awayTableData.goalsFor}</td>
            </tr>
        </table>`
        
    };

};
*/

window.addEventListener('load', loadMatches);
