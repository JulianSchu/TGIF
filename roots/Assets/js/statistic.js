localStorage.getItem("data")

let url = document.getElementById('source').textContent;
let myHeader = {
    headers: {
        'X-API-Key': 'SWQPv9Ilwk8bHWdt9rlgn7xuEzmbjq3kAxhd5ogr'
    }
}

fetch(url, myHeader)
    .then(res => res.json())
    .then(function (data) {
        const dataResults = data.results[0];
        const people = dataResults.members;
        getSum(people);
        tenPercent(statistics, people);
        createStatsTable(statistics);
    })
    .catch(function (err) {
        console.log(err);
        alert('Sorry! Something went really wrong. No data will be displayed. There is no response from the source. Maybe they are undergoing a major update. I mean who knows. Everything is possible. So... Please try again later and by later I mean tomorrow or never. BTW I really don\'t like this pop out alert box. But I am too lazy to do anything about it. Have a nice day and may god protect you and your family.')
    })

///////////////////////////////////////////////////
//// Statistics

let statistics = {
    totalMembers: 0,
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
        },
        {
            partyName: 'Total',
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

function getSum(obj) {

    let rs = [],
        ds = [],
        is = [],
        generalInfo = [rs, ds, is, obj]

    for (i = 0; i < obj.length; i++) {
        if (obj[i].party === 'R') {
            rs.push(obj[i])
        } else if (obj[i].party === 'D') {
            ds.push(obj[i])
        } else if (obj[i].party === 'I') {
            is.push(obj[i])
        }
    }

    statistics.totalMembers = rs.length + ds.length + is.length;

    statistics.parties.forEach(function (each) {
        let i = statistics.parties.indexOf(each);
        each.noMember = generalInfo[i].length;
        avvwp = votesWithParty(generalInfo[i])
        if (avvwp === 'n/a') {
            each.vwp_avg = votesWithParty(generalInfo[i])
        } else {
            each.vwp_avg = votesWithParty(generalInfo[i]) + "%";}
    })
}

function votesWithParty(p) {
    let sumOfVotes = 0;
    let sumOfVotesWithParty = 0;
    for (i = 0; i < p.length; i++) {
        sumOfVotes = sumOfVotes + p[i].total_votes;
        sumOfVotesWithParty = sumOfVotesWithParty + p[i].total_votes * p[i].votes_with_party_pct / 100;
    }
    if (sumOfVotes != 0) {
        return (sumOfVotesWithParty / sumOfVotes * 100).toFixed(1)
    } else {
        return 'n/a'
    }
}

//////////////////////////////////////////////////
// 10% part

function getLA(a, b, c) {
    if (a.length === 0) {
        b = c
    } else {
        b = c.filter(function (re) {
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

function getMA(a, b, c) {
    if (a.length === 0) {
        b = c
    } else {
        b = c.filter(function (re) {
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

function getLL(a, b, c) {
    if (a.length === 0) {
        b = c
    } else {
        b = c.filter(function (re) {
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

function getML(a, b, c) {
    if (a.length === 0) {
        b = c
    } else {
        b = c.filter(function (re) {
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

function tenPercent(statistics, c) {
    statistics.stats.forEach(function (each) {
        let i = statistics.stats.indexOf(each);
        var least, bottoms, x, y, z, rest, restBtms, keepOnSearching, func;
        least = [];
        bottoms = [];
        rest = [];
        func = functions[i];
        keepOnSeaching = true;
        if (i === 0 || i === 1) {
            while (keepOnSeaching) {
                keepOnSeaching = false;
                var inBetween = func(least, rest, c);
                least = inBetween[0];
                rest = inBetween[1];
                restBtms = rest.filter(function (each) {
                    return each.missed_votes_pct === least[0].missed_votes_pct;
                })
                bottoms = bottoms.concat(restBtms)
                z = bottoms.length / c.length;
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
                var inBetween = func(least, rest, c);
                least = inBetween[0];
                rest = inBetween[1];
                restBtms = rest.filter(function (each) {
                    return each.votes_with_party_pct === least[0].votes_with_party_pct;
                })
                bottoms = bottoms.concat(restBtms)
                z = bottoms.length / c.length;
                if (z < 0.1) {
                    keepOnSeaching = true;
                } else {
                    statistics.stats[i][1] = bottoms.map(function (each) {
                        return [each.first_name + " " + (each.middle_name || "") + " " + each.last_name, each.total_votes, each.votes_with_party_pct + "%", each.url]
                    });
                }
            }
        }
    });
}

///////////////////////////////////////////////
//create table

function createStatsTable(statistics) {
    let glance = ['glance', []]

    glance[1] = statistics.parties.map(function (one) {
        return [one.partyName, one.noMember, one.vwp_avg, '#']
    })

    let tableInputs = statistics.stats.concat([glance]);
    tableInputs.forEach(function (each) {
        let i = tableInputs.indexOf(each);
        let table = document.getElementById(i);
        let tbody = document.createElement('tbody');
        if (table != null) {
            each[1].forEach(function (single) {
                let tr = document.createElement('tr');
                tr.setAttribute('class', single[0])
                if (i != 4) {
                    let a = document.createElement('a');
                    a.setAttribute('href', single[single.length - 1]);
                    a.setAttribute('class', 'text-decoration-none')
                    a.innerHTML = single[0];
                    let td = document.createElement('td');
                    td.appendChild(a);
                    tr.appendChild(td);
                } else {
                    let td = document.createElement('td');
                    td.innerHTML = single[0];
                    tr.appendChild(td)
                };
                for (n = 1; n < single.length - 1; n++) {
                    let col = document.createElement('td');
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
            let noteText
            if (i != 4) {
                noteText = document.createTextNode('*ranking based on %');
            } else {
                noteText = document.createTextNode('*weighted average')
            };
            small.appendChild(noteText);
            note.appendChild(small);
            noteRow.appendChild(note);
            tfoot.appendChild(noteRow);
            table.appendChild(tfoot);
        }
    })
}
