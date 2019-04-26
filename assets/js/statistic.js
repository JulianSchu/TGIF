let url = document.getElementById('source').textContent;

var vm = new Vue({
    el: '#statistic',
    data: {
        users: [],
        parties: [],
        la: [],
        ma: [],
        ll: [],
        ml: []
    },
    methods: {
        fetchData() {
            fetch(url, {
                    headers: {
                        'X-API-Key': 'bkE5mazR6CC9BBNdkHiTlHZBTzivfvrq4eWkam6g' //'SWQPv9Ilwk8bHWdt9rlgn7xuEzmbjq3kAxhd5ogr'        
                    }
                })
                .then(res => res.json())
                .then(data => {
                    const dataResults = data.results[0];
                    const people = dataResults.members;
                    people.forEach(function (each) {
                        if (each.middle_name === null) {
                            each.fullname = each.first_name + ' ' + each.last_name;
                        } else {
                            each.fullname = each.first_name + ' ' + each.middle_name + ' ' + each.last_name;
                        }
                    });
                    this.users = people;
                    this.parties = getSum(people);
                    let result = tenPercent(people);
                    this.la = result[0][1];
                    this.ma = result[1][1];
                    this.ll = result[2][1];
                    this.ml = result[3][1];
                })
                .catch(function (err) {
                    console.log(err);
                    alert('Sorry! Something went really wrong. No data will be displayed. There is no response from the source. Maybe they are undergoing a major update. I mean who knows. Everything is possible. So... Please try again later and by later I mean tomorrow or never. BTW I really don\'t like this pop out alert box. But I am too lazy to do anything about it. Have a nice day and may god protect you and your family.')
                })
        }
    },
    mounted() {
        this.fetchData();
    }
})

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

    let parties = [
        {
            partyName: 'Republican'
        },
        {
            partyName: 'Democrat'
        },
        {
            partyName: 'Independent'
        },
        {
            partyName: 'Total'
        }
    ]

    parties.forEach(function (each) {
        let i = parties.indexOf(each);
        each.noMember = generalInfo[i].length;
        avvwp = votesWithParty(generalInfo[i])
        if (avvwp === 'n/a') {
            each.vwp_avg = votesWithParty(generalInfo[i])
        } else {
            each.vwp_avg = votesWithParty(generalInfo[i]) + "%";
        }
    });

    return parties
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

function tenPercent(c) {
    let stats = [
        ['la', []],
        ['ma', []],
        ['ll', []],
        ['ml', []]
        ]

    stats.forEach(function (each) {
        let i = stats.indexOf(each);
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
                    stats[i][1] = bottoms;
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
                    stats[i][1] = bottoms;
                }
            }
        }
    });
    return stats
}

let sortBtns = document.getElementsByClassName('fas fa-sort');

for (i = 0; i < sortBtns.length; i++) {
    sortBtns[i].addEventListener('click', sortTable)
}

function sortTable() {
    var n, links, switching, rows, i, x, y, shouldSwitch, dir, switchcount, heading, tbody
    n = this.getAttribute('id');
    switching = true;
    dir = 'asc';
    switchcount = 0;
    tbody = this.parentNode.parentNode.parentNode.parentElement.parentElement.children[2]
    rows = tbody.childNodes;
 
    while (switching) {
        switching = false;
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            if (n == 0) {
                x = rows[i].childNodes[0].childNodes[0];
                y = rows[i + 1].childNodes[0].childNodes[0];
            } else {
                x = rows[i].childNodes[n-2];
                y = rows[i + 1].childNodes[n-2];
            }
            if (dir === "asc") {
                if (n == 3) {
                    if (+x.innerHTML > +y.innerHTML) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            } else if (dir === "desc") {
                if (n == 3) {
                    if (+x.innerHTML < +y.innerHTML) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
        }
        if (shouldSwitch) {
            if (n == 0) {
                let nameNode = x.parentNode;
                let nameRow = nameNode.parentNode;
                let nameNode1 = y.parentNode;
                let nameRow1 = nameNode1.parentNode;
                nameRow.parentNode.insertBefore(nameRow1, nameRow);
                switching = true;
                switchcount++
            } else {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++
            }
        } else {
            if (switchcount == 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
