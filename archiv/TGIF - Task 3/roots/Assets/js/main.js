localStorage.getItem("data")


/////////////////////////////////////////////////////
// get needed data for each member from the dataset
function retrievData(Array) {
    const dataResults = Array.results[0];
    const people = dataResults.members;
    let membersInfo = people.map(function (member) {
        return [member.first_name + ' ' + (member.middle_name || '') + ' ' + member.last_name, member.party, member.state, member.seniority, member.votes_with_party_pct + '%', member.url]
    })

    return membersInfo
}

let membersInfo = retrievData(data)



/////////////////////////////////////////////////////
// create the table based on the retrieved data
function createTable() {

    //set people as an array of member information

    let tbody = document.createElement('tbody');

    for (i = 0; i < membersInfo.length; i++) {
        let row = document.createElement('tr');
        let cols = membersInfo[i];

        let a = document.createElement('a');
        a.setAttribute('href', cols[cols.length - 1]);
        a.setAttribute('class', 'text-decoration-none')
        a.innerHTML = cols[0];
        let colName = document.createElement('td');
        colName.appendChild(a);
        row.appendChild(colName);

        for (n = 1; n < cols.length - 1; n++) {
            let col = document.createElement('td');
            let content = document.createTextNode(cols[n]);
            col.setAttribute('class', cols[n]);
            col.appendChild(content)
            row.appendChild(col);
        };
        tbody.appendChild(row);
    }

    let table = document.getElementById('members-data');
    table.appendChild(tbody);

    // header of the table

    let tableHead = ['Senator ', 'Party Affilication ', 'State ', 'Seniority ', 'Party Votes ']

    let header = document.createElement('thead')
    header.setAttribute('class', 'thead-dark')
    let headRow = document.createElement('tr')

    for (i = 0; i < tableHead.length; i++) {
        let th = document.createElement('th');
        th.setAttribute('scope', 'col');
        let headContent = document.createTextNode(tableHead[i]);
        th.appendChild(headContent);

        //<button type="button" class="btn btn-sm bg-dark border-secondary"><i class="fas fa-caret-square-down text-white"></i></button>

        let btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'btn btn-sm bg-dark border-secondary btn-sort');

        let arrow = document.createElement('i')
        arrow.setAttribute('class', 'fas fa-caret-square-down text-white');
        arrow.setAttribute('id', i);

        btn.appendChild(arrow);
        th.appendChild(btn);

        headRow.appendChild(th);
    }

    header.appendChild(headRow);

    table.insertBefore(header, tbody)

}

createTable()



/////////////////////////////////////////////////////
// create onchange for the filter of the checkbox and filter function based on not-selected value - to hide
let parties = document.getElementsByName('Party')

for (p = 0; p < parties.length; p++) {
    parties[p].addEventListener('change', filterOutParty)
}

function filterOutParty() {
    let partiesSelected = []
    let partiesNotSelected = [];
    for (i = 0; i < parties.length; i++) {
        if (parties[i].checked) {

            partiesSelected.push(parties[i].value[0]);

        } else {
            partiesNotSelected.push(parties[i].value[0]);
        }
    };

    if (partiesSelected.length === 0) {
        partiesSelected = ['R', 'D', 'I']
    };

    if (partiesNotSelected.length === 3) {
        partiesNotSelected = []
    };

    partiesNotSelected.forEach(function (not) {
        let partyNot = document.getElementsByClassName(not);
        for (i = 0; i < partyNot.length; i++) {
            partyNot[i].parentNode.setAttribute('class', 'hide')
        };
    });

    partiesSelected.forEach(function (yes) {
        let partyYes = document.getElementsByClassName(yes);
        for (i = 0; i < partyYes.length; i++) {
            partyYes[i].parentNode.setAttribute('class', 'show')
        };
    });

    nullTable()

}



/////////////////////////////////////////////////////
// function to check if the table is empty after user filter. If yes, it will return note message.
function nullTable() {
    let tbody = document.getElementsByTagName('tbody')[0];
    let tr = tbody.childNodes;

    let trHide = []

    for (i = 0; i < tr.length; i++) {
        if (tr[i].className === 'hide' || tr[i].getAttribute('type') === 'hide') {
            trHide.push(tr[i])
        }
    };

    if (trHide.length === membersInfo.length) {

        let tfootP = document.getElementById('null-table-text');
        tfootP.innerHTML = 'Sorry. There is no members that fit your filter criterien.'
    } else {
        let tfootP = document.getElementById('null-table-text');
        tfootP.innerHTML = ''
    };
}



/////////////////////////////////////////////////////
// create unique state list and append them to the dropdown list - appendChild
function getState() {
    let states = [];
    membersInfo.forEach(function (member) {
        states.push(member[2]);
    })
    let unique = [];
    for (a = 0; a < states.length; a++) {
        if (states[a] = states[a + 1]) {
            if (unique.indexOf(states[a]) < 0) {
                unique.push(states[a])
            }
        }
    }

    return unique.sort().reverse();

}

getState()

let unique = getState()

function pushOptions() {
    unique.forEach(function (st) {
        let opt = document.createElement('option');
        opt.setAttribute('value', st)
        let state = document.createTextNode(st);
        opt.appendChild(state);
        opt.setAttribute('value', st)
        opt.setAttribute('id', st)
        let opt1 = document.getElementById('all');
        opt1.parentNode.insertBefore(opt, opt1.nextSibling);
    })
}

pushOptions()



/////////////////////////////////////////////////
// create onchange for the filter of the dropdown and filter function based on not-selected value - to hide

let states = document.getElementById('state')

states.addEventListener('change', filterByState)

function filterByState() {

    let optIndex = states.selectedIndex;

    if (states[optIndex].value === 'All') {
        let allTr = document.getElementsByTagName('tr');
        for (i = 0; i < allTr.length; i++) {
            allTr[i].setAttribute('type', 'show')
        }
    } else {

        unique.forEach(function (st) {
            let tdState = document.getElementsByClassName(st)
            for (s = 0; s < tdState.length; s++) {
                tdState[s].parentNode.setAttribute('type', 'hide')
            }
        })

        let stateYes = document.getElementsByClassName(states[optIndex].value);

        for (i = 0; i < stateYes.length; i++) {
            stateYes[i].parentNode.setAttribute('type', 'show')
        };
    };

    nullTable()

}



/////////////////////////////////////////////////
// sort table by click
let sortBtns = document.getElementsByClassName('fa-caret-square-down');

for (i = 0; i < sortBtns.length; i++) {
    sortBtns[i].addEventListener('click', sortTable)
}

function sortTable() {
    var n, links, switching, rows, i, x, y, shouldSwitch
    n = this.getAttribute('id');
    switching = true;

    if (n == 0) {
        while (switching) {
            rows = showTable();
            switching = false;
            for (i = 0; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].childNodes[0].childNodes[0];
                y = rows[i + 1].childNodes[0].childNodes[0];

                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                let nameNode = x.parentNode;
                let nameRow = nameNode.parentNode;
                let nameNode1 = y.parentNode;
                let nameRow1 = nameNode1.parentNode;
                nameRow.parentNode.insertBefore(nameRow1, nameRow);
                switching = true;
            }
        }
    } else {
        while (switching) {
            switching = false;
            rows = showTable();
            for (i = 0; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                if (n == 3) {
                    x = rows[i].getElementsByTagName('td')[n];
                    y = rows[i + 1].getElementsByTagName('td')[n];

                    if (+x.innerHTML > +y.innerHTML) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    x = rows[i].getElementsByTagName('td')[n];
                    y = rows[i + 1].getElementsByTagName('td')[n];

                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }
}


// The following function lets sortTable only goes through the rows that are shown
function showTable() {
    let tbody = document.getElementsByTagName('tbody')[0];
    let tr = tbody.childNodes;

    let trShow = []

    for (i = 0; i < tr.length; i++) {
        if (tr[i].className != 'hide' && tr[i].getAttribute('type') != 'hide') {
            trShow.push(tr[i])
        }
    };

    return trShow
    console.log(trShow)
}
