// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train - then update the html + update the database
// 3. Create a way to retrieve train from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
// Initialize Firebase
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAOjWo4zYkhzVnHyX2n8rR3HIbXaKDAZmc",
    authDomain: "train-1ca0a.firebaseapp.com",
    databaseURL: "https://train-1ca0a.firebaseio.com",
    projectId: "train-1ca0a",
    storageBucket: "train-1ca0a.appspot.com",
    messagingSenderId: "804241712242"
};
firebase.initializeApp(config);
let database = firebase.database()
let tsRef = database.ref('/timesheet')


$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    tsRef.push({
        name: document.querySelector('#tname-input').value,
        destination : document.querySelector('#destination-input').value,
        start_time: document.querySelector('#time-input').value,
        frequency: document.querySelector('#frequency-input').value
    })
});

tsRef.on("child_added", function(snapshot, prevChildKey) {

    var childData = snapshot.val();

    var begin = moment(childData.start_time, "HH:mm").format("HH:mm")
    var today = moment().format("HH:mm")

    var minDiff =  moment(today, "HH:mm").diff(moment(begin, "HH:mm"), 'minutes')   
    var minAway = childData.frequency - (minDiff % childData.frequency)
    var nextArrival = moment().add(minAway, 'minutes').format("h:mm A")

        console.log('min diff: ' + minDiff)
        console.log('min Away: ' + minAway)
        console.log('nextArrival: ' + nextArrival)

    $("#train-table > tbody").append(`
        <tr data='${childData.start_time}'>
            <td>${childData.name}</td>
            <td>${childData.destination}</td>
            <td>${childData.frequency}</td>
            <td>${nextArrival}</td>
            <td>${minAway}</td>
        </tr>`
    )
})

var myVar = setInterval(myTimer, 6000);

function myTimer() {
    var numTrains = $('tbody > tr').length
    console.log("# of trains: " + numTrains)

    var today = moment().format("HH:mm")
    var begin 
    var frequency

    for(i = 0; i < numTrains; i++){
        frequency = $('tbody > tr').eq(i).children('td').eq(2).html()
        begin = $('tbody > tr').eq(i).attr('data')
        console.log("frequency " + frequency)
        console.log("begin " + begin)

        var minDiff =  moment(today, "HH:mm").diff(moment(begin, "HH:mm"), 'minutes')   
        var minAway = frequency - (minDiff % frequency)
        var nextArrival = moment().add(minAway, 'minutes').format("h:mm A")


        $('tbody > tr').eq(i).replaceWith(`
            <tr data='${begin}'>
                <td>${$('tbody > tr').eq(i).children('td').eq(0).html()}</td>
                <td>${$('tbody > tr').eq(i).children('td').eq(1).html()}</td>
                <td>${frequency}</td>
                <td>${nextArrival}</td>
                <td>${minAway}</td>
            </tr>`
        );
    }
}
