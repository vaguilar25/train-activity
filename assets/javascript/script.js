
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
    
    var newPost = snapshot.val();
    //Get the Train Time
    var trainTime = moment(newPost.trainTime , "HH:mm").format("HH:mm a");

   //Get the current Time
    var currentTime = moment().format("HH:mm a");
   
    
    //Get the difference from now and train time
    var timeDifference = moment().diff(moment(newPost.trainTime , "HH:mm"), "minutes");
  

    //Time left
    var timeDivision = timeDifference%newPost.frequency;
     var minutesDifference = newPost.frequency - timeDivision;
   
    //Next train 
    var nextTRain = moment().add(minutesDifference, "minutes").format ("hh:mm A");
    var trainTime = moment(newPost.trainTime, "HH:mm");
   
    var currentTime = moment();

    var differenceInTimes = moment(trainTime).diff(currentTime, "minutes");
   
    
     if ((currentTime - trainTime) < 0) {
        nextTrain = snapshot.val().firstTime;
  
        minutesDifference = Math.round(moment.duration(differenceInTimes).asMinutes());;
      }
      else {
        nextTrain = moment().add(minutesDifference, "minutes").format("hh:mm A");
        minutesDifference = newPost.frequency - timeDivision;
   
      }


    $(".results").append("<tr><td>" + newPost.trainName + "</td>" + "<td>" + newPost.destination + "</td><td>" + newPost.frequency + "</td><td>" + nextTRain + "</td><td>" + minutesDifference + "</td><td> </td><td> <button class='delete' id=" + snapshot.key + "> Delete </button>    </td></tr>");


}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});


$(document).on("click", ".delete", function () {
    var id = $(this).attr("id");
    console.log("id: " + id);

    database.ref().child(id).remove();
    

});

