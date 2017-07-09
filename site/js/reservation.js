/*
var reservations;
rsrvUrl = "http://localhost:8080/reservation";

$(document).ready( function () {
    $.ajaxSetup({cache: false});
    getReservations(rsrvUrl);
    fillForm();
    // table choosing
    $(".plan img").on("click", function () {
        $("#table").val(this.id);
    });

    $("#reservationForm").on("submit", function (e) {
        e.preventDefault();
        if( $("#table").val() ) {
            makeReservation(rsrvUrl, $(this).serialize());
            $("#reservationForm")[0].reset();
            getReservations(rsrvUrl);
        }
        else {
            alert("Please, choose table");
        }
    });
});

function getReservations(url) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            $(".table").addClass("free");
            for(var i = 0; i < data.length; i++) {
                var t = "#" + data[i].table;
                $(t).removeClass("free").off("click");
            }
        },
        error:  function(xhr){
            console.log(xhr.status, xhr.responseText);
        }
    });
}

function makeReservation(url, data) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function () {
            alert("Reservation completed")
        },
        error:  function(xhr){
            alert('Error: ' + xhr.responseCode);
        }
    });
}

function fillForm() {
    document.forms[0].firstName.value = "Иван";
    document.forms[0].lastName.value = "Иванов";
    document.forms[0].date.value = "2011-01-01";
    document.forms[0].time.value = "13:00";
    document.forms[0].table.value = "table2";
}
*/
function getReservations(url) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            $(".table").addClass("free");
            for(var i = 0; i < data.length; i++) {
                var t = "#" + data[i].table;
                $(t).removeClass("free").off("click");
            }
        },
        error:  function(xhr){
            console.log(xhr.status, xhr.responseText);
        }
    });
}

function makeReservation(url, data) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function () {
            alert("Reservation completed")
        },
        error:  function(xhr){
            alert('Error: ' + xhr.responseCode);
        }
    });
}

function fillForm() {
    document.forms[0].firstName.value = "Иван";
    document.forms[0].lastName.value = "Иванов";
    document.forms[0].date.value = "2011-01-01";
    document.forms[0].time.value = "13:00";
    document.forms[0].table.value = "table2";
}

exports.getReservations = getReservations;
exports.makeReservation = makeReservation;
exports.fillForm = fillForm;

