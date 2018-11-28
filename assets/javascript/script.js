
$(function () {
    $("#start-date").datepicker();
});

//$(document).ready( function () {
//  $('.table').DataTable();
//} );


var config = {
    apiKey: "AIzaSyAk4L6_hNWH3em8TvuJ7H_P7qm-HlfIMBw",
    authDomain: "test-project-544df.firebaseapp.com",
    databaseURL: "https://test-project-544df.firebaseio.com",
    projectId: "test-project-544df",
    storageBucket: "test-project-544df.appspot.com",
    messagingSenderId: "599984542596"
};

firebase.initializeApp(config);

// Create a variable to reference the database.

var database = firebase.database();

var destination = "";
var frequency = "";
var trainName = "";
var trainTime = "";
var id;

$(document).on("click", "#run-submit", function () {
    event.preventDefault();

    trainName = $("#trainName").val();
    destination = $("#trainDestination").val();
    frequency = $("#frequency").val();
    trainTime = $("#trainTime").val();

    // Code for handling the push
    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        trainTime: trainTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});

function time_convert(num) {
    var hours = Math.floor(num / 60);
    var minutes = num % 60;
    return hours + ":" + minutes;
}


database.ref().on('child_added', function (snapshot) {
    console.log("Snapshot: " + snapshot.key);
    var newPost = snapshot.val();
    console.log("New Post: " + snapshot.key);

    var today = new Date();
    var a = moment([120]);
    var b = moment([1320]);
    var differences = a.diff(b, 'hours') // 1

    var format = 'hh:mm:ss'
    var time = moment("1:05", format);
    console.log("Now: " + time);


    var date1 = moment('08/10/2016', 'MM/DD/YYYY'),
        date2 = moment('08/15/2016', 'MM/DD/YYYY');

    var duration = moment.duration(date2.diff(date1));
    duration = duration.asHours();

    console.log("Duration as Hours" + duration);


    var a = moment([2007, 0, 28]);
    var b = moment([2007, 0, 29]);
    a.from(b) // "a day ago"

    console.log("difference between a and b" + a.from(b));

    console.log("TIme Convert: " + time_convert(100));
    console.log("Duration:" + differences);


    var toNow = moment([2007, 0, 29],"hh").toNow(true);

    console.log ("Train Time:" + "2010-10-20 " + newPost.trainTime );
    console.log("Momen is valid:" + moment(newPost.trainTime , 'HH:mm').isValid());

    // console.log("Prev Child Key: " + prevChildKey);
    //console.log(moment(newPost.trainTime).format("hh:mm A"));

    var trainTime = moment(newPost.trainTime , "HH:mm").format("HH:mm a");

    console.log("Train Time" + trainTime);
    var currentTime = moment().format("HH:mm a");
   // var formatCurrent = moment(currentTime,"HH:mm");
    console.log("TrainTime" + trainTime);
    console.log("formatCurrent: " + currentTime);
    console.log("Difference between Times: "  + moment.duration(trainTime).humanize());


    var timeDifference = moment().diff(moment(newPost.trainTime , "HH:mm"), "minutes");
    console.log("timeDifference" + timeDifference);
    var timeDivision = timeDifference%newPost.frequency;
    console.log("T reminder " + timeDivision);
    var minutesDifference = newPost.frequency - timeDivision;
    console.log("minutes Reminder " + minutesDifference);
    var nextTRain = moment().add(minutesDifference, "minutes").format ("hh:mm A");
    console.log("next Train " + nextTRain);

    var trainTime = moment(newPost.trainTime, "HH:mm");
    console.log("First Time: " + moment(newPost.trainTime, "HH:mm"));
    var currentTime = moment();

    var differenceInTimes = moment(trainTime).diff(currentTime, "minutes");
    console.log("differenceInTimes " + differenceInTimes);
     var minutesLeft = Math.ceil(moment.duration(differenceInTimes).asMinutes());

     console.log("Difference: " + moment.duration(differenceInTimes).asMinutes());

     console.log("Math Ceil: " + Math.ceil(moment.duration(differenceInTimes).asMinutes()) + "Round: " + Math.round(moment.duration(differenceInTimes).asMinutes()) );

     console.log("Before Minutes" + minutesLeft);

     if ((currentTime - trainTime) < 0) {
        nextTrain = snapshot.val().firstTime;
        console.log("Before First Train");
        minutesDifference = minutesLeft;
      }
      else {
        nextTrain = moment().add(minutesDifference, "minutes").format("hh:mm A");
        minutesDifference = newPost.frequency - timeDivision;
        console.log("Working");
      }


    $(".results").append("<tr><td>" + newPost.trainName + "</td>" + "<td>" + newPost.destination + "</td><td>" + newPost.frequency + "</td><td>" + nextTRain + "</td><td>" + newPost.trainTime + "</td><td> </td><td> <button> Update </button>    </td><td> <button class='delete' id=" + snapshot.key + "> Delete </button>    </td></tr>");


    // postDom(newPost, snapshot);


}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});


$(document).on("click", ".delete", function () {
    var id = $(this).attr("id");
    console.log("id: " + id);

    database.ref().child(id).remove();
    //  database().ref().update();

});

