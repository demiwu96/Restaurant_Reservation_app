// add reservation
$("#submit").on("click", function (event) {
    event.preventDefault();
    let newCustomer = {
        firstName: $("#firstName").val().trim(),
        lastName: $("#lastName").val().trim(),
        number: $("#phone").val().trim(),
        people: $("#people").val().trim()
    };

    $.post("/api/reservationlist", newCustomer)
        .then(function (data) {
            console.log(data);

            if (data == true) {
                alert("Reserved!!");
            } else if (data == false) {
                alert("You are on the waitlist");
            };

            $("#firstName").val("");
            $("#lastName").val("");
            $("#phone").val("");
            $("#people").val("");
        });
});

// Check table functions
$.get("/api/reservationlist", data => {
    renderReservationList(data);
});

$.get("/api/waitlist", data => {
    renderWaitlist(data);
});

$(document).on('click', '.cancel-reservation', function () {
    alert("Are you sure you want to cancel the reservation?");
    let index = $(this).attr("data-index");
    let indexData = {
        index: index
    };
    $.post("/api/cancelreservation", indexData)
        .then(() => {
            location.reload();
        });
})


$(document).on("click", '.cancel-waitlist', function () {
    alert("Are you sure you want to cancel the reservation?");
    let index = $(this).attr("data-index");
    let indexData = {
        index: index
    };
    $.post("/api/cancelwaitlist", indexData)
        .then(() => {
            location.reload();
        });
})

$("#clear").click(() => {
    alert("Are you sure you want to clear all reservations?");
    $.get("/api/clearall")
        .then(res => {
            location.reload();
        });
});

const renderReservationList = function (arr) {
    let collectionDiv = $('<ul class="collection collection-table">');
    $("#reservationDiv").append(collectionDiv);

    for (var i = 0; i < arr.length; i++) {
        let collectionItem = $('<li class="collection-item avatar">');
        let icon = $('<i class="material-icons circle indigo darken-4">');
        let btn = $('<a class="waves-effect waves-light indigo darken-4 btn right" style="margin: 10px">');
        btn.addClass("cancel-reservation");
        collectionItem.append(icon.text("filter_" + (i + 1)).css("font-size", "25px"));
        collectionItem.append($("<h4>").text(arr[i].firstName + " " + arr[i].lastName).css("margin-top", "5px"));
        collectionItem.append(btn.text("Cancel").attr("data-index", i));
        collectionItem.append($("<h5>").text("Phone number: " + arr[i].number));
        collectionItem.append($("<h5>").text("People: " + arr[i].people));
        collectionDiv.append(collectionItem);
    };
}

const renderWaitlist = function (arr) {
    let collectionDiv = $('<ul class="collection collection-waitlist">');
    $("#waitlistDiv").append(collectionDiv);

    for (var i = 0; i < arr.length; i++) {
        let collectionItem = $('<li class="collection-item avatar">');
        let icon = $('<i class="material-icons circle indigo darken-4">');
        let btn = $('<a class="waves-effect waves-light indigo darken-4 btn right" style="margin: 10px">');
        btn.addClass("cancel-waitlist");
        collectionItem.append(icon.text("star_border").css("font-size", "25px"));
        collectionItem.append($("<h4>").text(arr[i].firstName + " " + arr[i].lastName).css("margin-top", "5px"));
        collectionItem.append(btn.text("Cancel").attr("data-index", i));
        collectionItem.append($("<h5>").text("Phone number: " + arr[i].number));
        collectionItem.append($("<h5>").text("People: " + arr[i].people));
        collectionDiv.append(collectionItem);
    }
}