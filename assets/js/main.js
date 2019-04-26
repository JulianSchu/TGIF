let url = document.getElementById('source').textContent

var vm = new Vue({
    el: '#members-data',
    data: {
        users: [],
        parties: [],
        states: [],
        selectedState: '',
        footer: false,
        search: ''
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
                    people.forEach(function(each){
                        if(each.middle_name === null) {
                            each.fullname = each.first_name + ' ' + each.last_name;
                        } else {
                            each.fullname = each.first_name + ' ' + each.middle_name + ' ' + each.last_name;     
                            }
                    });
                this.users = people;
                    this.states = getState(people)
                })
                .catch(function (err) {
                    console.log(err);
                    alert('Sorry! Something went really wrong. No data will be displayed. There is no response from the source. Maybe they are undergoing a major update. I mean who knows. Everything is possible. So... Please try again later and by later I mean tomorrow or never. BTW I really don\'t like this pop out alert box. But I am too lazy to do anything about it. Have a nice day and may god protect you and your family.')
                })
        },
        nullTable: function () {
            let tbody = this.filteredUsers;
            if (tbody.length === 0) {
                this.footer = true;
            } else {
                this.footer = false;
            }
        }
    },
    computed: {
        filteredUsers: function () {
            let pArray = this.parties;
            let sStr = this.selectedState;
            let nStr = this.search;
            if (this.parties.length === 0) {
                return this.users.filter(function (user) {
                    if (user.state.match(sStr) && user.fullname.match(nStr)) return true;
                })
            } else {
                return this.users.filter(function (user) {
                    if (pArray.indexOf(user.party) != -1 && user.state.match(sStr) && user.fullname.match(nStr)) return true;
                });
            };
        }
    },
    mounted() {
        this.fetchData();
    }
})

//// create unique state list and append them to the dropdown list - appendChild
function getState(obj) {
    let states = [];
    obj.forEach(function (member) {
        states.push(member.state);
    })
    let unique = [];
    for (a = 0; a < states.length; a++) {
        if (states[a] = states[a + 1]) {
            if (unique.indexOf(states[a]) < 0) {
                unique.push(states[a])
            }
        }
    }
    return unique.sort();
}

//// sort table by click
let sortBtns = document.getElementsByClassName('fas fa-sort');

for (i = 0; i < sortBtns.length; i++) {
    sortBtns[i].addEventListener('click', sortTable)
}

function sortTable() {
    var n, links, switching, rows, i, x, y, shouldSwitch, dir, switchcount, tbody
    n = this.getAttribute('id');
    switching = true;
    dir = 'asc';
    switchcount = 0;
    while (switching) {
        tbody = document.getElementsByTagName('tbody')[0];
        rows = tbody.childNodes;
        switching = false;
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            if (n == 0) {
                x = rows[i].childNodes[0].childNodes[0];
                y = rows[i + 1].childNodes[0].childNodes[0];
            } else {
                x = rows[i].getElementsByTagName('td')[n];
                y = rows[i + 1].getElementsByTagName('td')[n];
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