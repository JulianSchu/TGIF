localStorage.getItem("data")

/////////////////////////////////////////////////
// Statistics


let statistics = {
    totalMembers: 0,
    sumOfBelow: 0,
    parties: [{
            partyName: 'Republican',
            noMember: 0,
            vwp_avg: 0
        },
        {
            partyName: 'Democrat',
            noMember: 0,
            vwp_avg: 0
        },
        {
            partyName: 'Independent',
            noMember: 0,
            vwp_avg: 0
        }
             ],
    stats: [
    ['la', []],
    ['ma', []],
    ['ll', []],
    ['ml', []]
    ]
}

const dataResults = data.results[0];
const people = dataResults.members;

let Rs = [];
let Ds = [];
let Is = [];

for (i = 0; i < people.length; i++) {

    if (people[i].party === 'R') {
        Rs.push(people[i])
    } else if (people[i].party === 'D') {
        Ds.push(people[i])
    } else if (people[i].party === 'I') {
        Is.push(people[i])
    }

}

statistics.parties[0].noMember = Rs.length;
statistics.parties[1].noMember = Ds.length;
statistics.parties[2].noMember = Is.length;
statistics.totalMembers = people.length;
statistics.sumOfBelow = Rs.length + Ds.length + Is.length

statistics.parties[0].vwp_avg = votesWithParty(Rs) + "%";
statistics.parties[1].vwp_avg = votesWithParty(Ds) + "%";
statistics.parties[2].vwp_avg = votesWithParty(Is) + "%"

function votesWithParty(p) {

    let sumOfVotes = 0;
    let sumOfVotesWithParty = 0;

    for (i = 0; i < p.length; i++) {
        sumOfVotes = sumOfVotes + p[i].total_votes;
        sumOfVotesWithParty = sumOfVotesWithParty + p[i].total_votes * p[i].votes_with_party_pct / 100;
    }
    return (sumOfVotesWithParty / sumOfVotes * 100).toFixed(1)
}

function glanceTable(a) {

    let tbody = document.createElement('tbody');
    let table = document.getElementById('glance')

    a.forEach(function (each) {

        let tr = document.createElement('tr');
        let inputs = [each.partyName, each.noMember, each.vwp_avg];

        for (i = 0; i < inputs.length; i++) {
            let td = document.createElement('td');
            let cell = document.createTextNode(inputs[i]);

            td.appendChild(cell);
            tr.appendChild(td);
        };

        tbody.appendChild(tr);
    });
    table.appendChild(tbody)
    let tfoot = document.createElement('tfoot');
    let noteRow = document.createElement('tr');
    let note = document.createElement('td');
    note.setAttribute('colspan', '3');
    note.setAttribute('class', 'text-left')
    let small = document.createElement('small');
    let noteText = document.createTextNode('*% voted with party as weighted average');

    small.appendChild(noteText);
    note.appendChild(small);
    noteRow.appendChild(note);
    tfoot.appendChild(noteRow);
    table.appendChild(tfoot);
}

glanceTable(statistics.parties);


/////////////////////////////////////////////////
// 10% part


let aaa = '.missed_votes_pct'
let bbb = people[0].missed_votes_pct;
let ccc = people[0].votes_with_party_pct
console.log(ccc)

function getLA(a, b) {

    if (a.length === 0) {
        b = people
    } else {
        b = people.filter(function (re) {
            return re.missed_votes_pct < a[0].missed_votes_pct
        });
    };

    a[0] = b[0];
    for (i = 0; i < (b.length); i++) {
        x = b[i].missed_votes_pct;
        y = a[0].missed_votes_pct;
        if (x > y) {
            a[0] = b[i];
        }
    };
    return [a, b];
}

function getMA(a, b) {

    if (a.length === 0) {
        b = people
    } else {
        b = people.filter(function (re) {
            return re.missed_votes_pct > a[0].missed_votes_pct
        });
    };

    a[0] = b[0];
    for (i = 0; i < (b.length); i++) {
        x = b[i].missed_votes_pct;
        y = a[0].missed_votes_pct;
        if (x < y) {
            a[0] = b[i];
        }
    };
    return [a, b];
}

function getLL(a, b) {

    if (a.length === 0) {
        b = people
    } else {
        b = people.filter(function (re) {
            return re.votes_with_party_pct > a[0].votes_with_party_pct
        });
    };

    a[0] = b[0];
    for (i = 0; i < (b.length); i++) {
        x = b[i].votes_with_party_pct;
        y = a[0].votes_with_party_pct;
        if (x < y) {
            a[0] = b[i];
        }
    };
    return [a, b];
}

function getML(a, b) {

    if (a.length === 0) {
        b = people
    } else {
        b = people.filter(function (re) {
            return re.votes_with_party_pct < a[0].votes_with_party_pct
        });
    };

    a[0] = b[0];
    for (i = 0; i < (b.length); i++) {
        x = b[i].votes_with_party_pct;
        y = a[0].votes_with_party_pct;
        if (x > y) {
            a[0] = b[i];
        }
    };
    return [a, b];
}

let functions = [getLA, getMA, getLL, getML];

statistics.stats.forEach(function (each) {
    let i = statistics.stats.indexOf(each);
    
    /////////////////////////////////////////// calculation of the statistics needed 
    var least, bottoms, x, y, z, rest, restBtms, keepOnSearching, func;
    least = [];
    bottoms = [];
    rest = [];
    func = functions[i];
    keepOnSeaching = true;

    if (i === 0 || i === 1) {

        while (keepOnSeaching) {
            keepOnSeaching = false;

            var inBetween = func(least, rest);

            least = inBetween[0];
            rest = inBetween[1];

            restBtms = rest.filter(function (each) {
                return each.missed_votes_pct === least[0].missed_votes_pct;
            })

            bottoms = bottoms.concat(restBtms)
            z = bottoms.length / people.length;
            if (z < 0.1) {
                keepOnSeaching = true;
            } else {
                statistics.stats[i][1] = bottoms.map(function (each) {
                    return [each.first_name + " " + (each.middle_name || "") + " " + each.last_name, each.missed_votes, each.missed_votes_pct + "%",
                        each.url]
                });
            }
        }

    } else {

        while (keepOnSeaching) {
            keepOnSeaching = false;

            var inBetween = func(least, rest);

            least = inBetween[0];
            rest = inBetween[1];

            restBtms = rest.filter(function (each) {
                return each.votes_with_party_pct === least[0].votes_with_party_pct;
            })

            bottoms = bottoms.concat(restBtms)
            z = bottoms.length / people.length;
            if (z < 0.1) {
                keepOnSeaching = true;
            } else {
                statistics.stats[i][1] = bottoms.map(function (each) {
                    return [each.first_name + " " + (each.middle_name || "") + " " + each.last_name, each.total_votes, each.votes_with_party_pct + "%", each.url]
                });
            }
        }
    } 
    
    /////////////////////////////////////////// create table accordingly
    
    let table = document.getElementById(i);
    let tbody = document.createElement('tbody');

    if (table != null) {

        each[1].forEach(function (single) {
            let tr = document.createElement('tr');
            let a = document.createElement('a');
            a.setAttribute('href', single[single.length - 1]);
            a.setAttribute('class', 'text-decoration-none')
            a.innerHTML = single[0];
            let td = document.createElement('td');
            td.appendChild(a);
            tr.appendChild(td);

            for (n = 1; n < single.length - 1; n++) {
                let col = document.createElement('td');
                col.setAttribute('class', single[n])
                let content = document.createTextNode(single[n]);
                col.appendChild(content);
                tr.appendChild(col);
            }
            tbody.appendChild(tr);
        })
        table.appendChild(tbody);

        let tfoot = document.createElement('tfoot');
        let noteRow = document.createElement('tr');
        let note = document.createElement('td');
        note.setAttribute('colspan', '3');
        note.setAttribute('class', 'text-left')
        let small = document.createElement('small');
        let noteText = document.createTextNode('*ranking based on %');

        small.appendChild(noteText);
        note.appendChild(small);
        noteRow.appendChild(note);
        tfoot.appendChild(noteRow);
        table.appendChild(tfoot);
    }    
});


