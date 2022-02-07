//const loader = document.querySelector('.lds-default')
//loader.style.display = 'none';

function loadTable() {
  const pageTitle = document.querySelector('.competition-title')
  const regularTable = document.querySelector('.regular-league-table');
  const HomeTable = document.querySelector('.home-league-table');
  const awayTable = document.querySelector('.away-league-table');

  const url = "https://api.football-data.org/v2/competitions/PL/standings";
    //scorers https://api.football-data.org/v2/competitions/PL/scorers
  fetch(url, {
    method: "GET",
    headers: {
      "X-Auth-Token": "ef72570ff371408f9668e414353b7b2e"
    }
  })
  .then(resp => resp.json())
  .then(function(data) {
    console.log('data:', data);
    const competitionName = data.competition.name;

    let competitionData = data.standings[0].table;
    //let homeData = data.standings[1].table;
    //let awayData = data.standings[2].table;

    rowKeys = Object.keys(competitionData[0]);

    console.log('row-keys:',rowKeys);
    console.log('standings:', competitionData);
    
    //sortGD(competitionData);
    competitionTitle(competitionName);

    createTableHead(regularTable, rowKeys, competitionData);
    createTable(regularTable, competitionData);

    createTableHead(HomeTable, rowKeys, homeData);
    createTable(HomeTable, homeData);

    createTableHead(awayTable, rowKeys, awayData);
    createTable(awayTable, awayData);

    tableToggle() 
  })
  .catch(error => {
    console.log('error');
    console.error(error);
  });

  function competitionTitle(name) {
    pageTitle.innerHTML = `<h1>${name}</h1>`
  }

  function tableToggle() {
    let toggleTableContainer = document.querySelectorAll('.toggle-table-container p');
    console.log(toggleTableContainer)

    toggleTableContainer.forEach(el => {
      el.addEventListener('click', function(){
        console.log(el)
        let isActive = document.querySelector('.active-table-toggle');

        if(el.innerText === 'Regular') {
          regularTable.style.display = 'flex';
          HomeTable.style.display = 'none';
          awayTable.style.display = 'none';
          isActive.classList.remove('active-table-toggle')
          this.classList.add('active-table-toggle');

        }

        if(el.innerText === 'Home') {
          HomeTable.style.display = 'flex';
          regularTable.style.display = 'none';
          awayTable.style.display = 'none';
          isActive.classList.remove('active-table-toggle')
          this.classList.add('active-table-toggle');

        }

        if(el.innerText === 'Away') {
          awayTable.style.display = 'flex';
          regularTable.style.display = 'none';
          HomeTable.style.display = 'none';
          isActive.classList.remove('active-table-toggle')
          this.classList.add('active-table-toggle');

        }

      }) 
    })
  }

  function createTableHead(table, rowKeys, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    let headerArray = [
      '',
      'team',
      'MP',
      'Form',
      'W',
      'D',
      'L',
      'P',
      'GF',
      'GA',
      'GD'

    ];
    let homeAwayheaderArray = [...headerArray];
    homeAwayheaderArray.splice(3, 1)
    homeAwayheaderArray.splice(10, 1, '')

    let thisKey;
    console.log(rowKeys)

    rowKeys.forEach((el, index) => {
        let th = document.createElement('th');        
        row.appendChild(th);
        if (table === regularTable) {
          th.innerText = headerArray[index];

        }
        else {
          console.log(homeAwayheaderArray)
          th.innerText = homeAwayheaderArray[index];

        }

        
        th.addEventListener('click', function() {
          console.log('clicked');
          thisKey = el;
          sortGD(data);

        });
    });

    function sortGD() {
      data.sort(function(a, b){return b.goalsAgainst - a.goalsAgainst});
      console.log(data);
      console.log(thisKey);
      return data;
    }
  }

  function createTable(table, data) {
    data.forEach(el => {
        if (table === regularTable) {
          console.log('yep')
          let greenForm = document.createElement('div');
          greenForm.innerText = `<div class="win-circle"></div>`;

          let grayForm = document.createElement('div');
          grayForm.innerText = `<div class="draw-circle"></div>`;
          let redForm = document.createElement('div');
          redForm.innerText = `<div class="lose-circle"></div>`;
          let formCircles = el.form;
          if (el.form != null) {
            let formCircles = el.form.replaceAll("W", `${greenForm.innerText}`).replaceAll("D", `${grayForm.innerText}`).replaceAll("L", `${redForm.innerText}`).replaceAll(",", "");
            return formCircles;
          }
          
          

          let editedTeamName = el.team.name.replaceAll("FC", '');

          let row = table.insertRow();
          let position = row.insertCell(0);
          position.innerHTML = el.position;
          let teamName = row.insertCell(1);
          teamName.innerHTML = `<img src="${el.team.crestUrl}" class="team-crests"> <div class="team-text">${editedTeamName}</div>`;
          let playedGames = row.insertCell(2);
          playedGames.innerHTML = el.playedGames;
          let form = row.insertCell(3);
          form.innerHTML = formCircles;
          let won = row.insertCell(4);
          won.innerHTML = el.won;
          let draw = row.insertCell(5);
          draw.innerHTML = el.draw;
          let lost = row.insertCell(6);
          lost.innerHTML = el.lost;
          let points = row.insertCell(7);
          points.innerHTML = el.points;
          let goalsFor = row.insertCell(8);
          goalsFor.innerHTML = el.goalsFor;
          let goalsAgainst = row.insertCell(9);
          goalsAgainst.innerHTML = el.goalsAgainst;
          let goalDifference = row.insertCell(10);
          goalDifference.innerHTML = el.goalDifference;
          teamName.classList.add('teams-container');
          form.classList.add('form-container');

        } else {
          let row = table.insertRow();
          let position = row.insertCell(0);
          position.innerHTML = el.position;
          let teamName = row.insertCell(1);
          teamName.innerHTML = `<img src="${el.team.crestUrl}" class="team-crests"> <div class="team-text">${el.team.name}</div>`;
          let playedGames = row.insertCell(2);
          playedGames.innerHTML = el.playedGames;
          let won = row.insertCell(3);
          won.innerHTML = el.won;
          let draw = row.insertCell(4);
          draw.innerHTML = el.draw;
          let lost = row.insertCell(5);
          lost.innerHTML = el.lost;
          let points = row.insertCell(6);
          points.innerHTML = el.points;
          let goalsFor = row.insertCell(7);
          goalsFor.innerHTML = el.goalsFor;
          let goalsAgainst = row.insertCell(8);
          goalsAgainst.innerHTML = el.goalsAgainst;
          let goalDifference = row.insertCell(9);
          goalDifference.innerHTML = el.goalDifference;
          teamName.classList.add('teams-container');


        }
        
      });
  }
}

window.addEventListener('load', loadTable);

/* 
        TODO:
           
          - Make table sortable

*/
