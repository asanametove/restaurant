var rsrvUrl = "http://localhost:8080/reservation";
var menuUrl = "http://localhost:8080/menu";
var eventsUrl = "http://localhost:8080/events";

$(document).ready(function () {
    $.ajaxSetup({cache: false});
    $("#datePicker").datepicker();
    initTimePicker($("#timePicker"));

                    // SLIDER
    var slider = new Slider($("#mainSlider"));
    slider.start(2000);

                    // RESERVATION
    //fillForm();
    getFile("reservation", rsrvUrl, showReservations);

    $("#reservationForm").on("submit", function (e) {
        e.preventDefault();
        if( $("#table").val() ) {
            makeReservation(rsrvUrl, $(this).serialize());
            $("#reservationForm")[0].reset();
        }
        else {
            alert("Please, choose table");
        }
    });

                  // MENU
    getFile("menu", menuUrl, showMenu, $("#menuSection .menuItems"));

                // EVENTS
    getFile("events", eventsUrl, showEvents, $("#eventsSection .eventsWrapper"));

                // MAP
    $("body").append("<script src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyCndrFlZ8SaPRtfArycbpGbDszOVQLszWk&callback=initMap\"></script>");
    
});

function makeReservation(url, data) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (res) {
            alert(res);
        },
        error:  function(res){
            alert(res.responseText || "Reservation fail");
        }
    });
    setTimeout( function () {
        getFile("reservation", rsrvUrl, showReservations)
        }, 500 );
}

function fillForm() {
    document.forms[0].firstName.value = "Иван";
    document.forms[0].lastName.value = "Иванов";
    document.forms[0].date.value = "01/01/2017";
    document.forms[0].time.value = "13:00";
    document.forms[0].table.value = "table2";
}

function getFile(description, url, func, $element) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            func(data, $element);
        },
        error:  function(){
            alert("Failed to load data: " + description);
        }
    });
}

function Sort() {
    function setSortKeys($element, $select, $list) {
        // $element - block, which contains keys to sort
        // select - block to choose sort key
        // $list - sorting list
        for(var i = 0; i < $element.children().length; i++) {
            $("<option/>").text($element.children()[i].className).appendTo($select)
        }
        sort($list, $select.val(), true);
        $select.on("change", function (e) {
            sort($list, this.value, true);
            // move to first page if pagination exists
            var $paginControl = $list.parent().siblings(".paginControl");
            if( $paginControl.length > 0) {
                $paginControl.find("a")[0].click();
            }
        });
    }

    function sort($list, key, asc) {
        // item - item to sort
        // key - key element selector
        // asc - true UP, false DOWN
        var $elements = $list.children("li");
        key = "." + key;

        $elements.sort(function (a, b) {
            var an = $(key, a).text(),
                bn = $(key, b).text();
            if (an && bn) {
                var res = an.toUpperCase().localeCompare(bn.toUpperCase());
                return asc ? res : -res;
            }
            return 0;
        });
        $elements.detach().appendTo($list);
    }

    return {
        setKeys: setSortKeys,
        sort: sort
    }
}

function initMap() {
    var uluru = {lat: 50.5, lng: 30.5};
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

function showEvents(data, $div) {
    var $ul = $("<ul/>")
    for(var i = 0; i < data.length; i++) {
        var $li = $("<li/>");
        var $divInfo = $("<div/>").addClass("eventInfo");
        $li.append(
            $("<img/>", {src : data[i].imageUrl})
        );
        for(var prop in data[i]) {
            if(prop !== "imageUrl") {
                $("<p/>")
                    .addClass(prop)
                    .text(prop.charAt(0).toUpperCase() + prop.substr(1) + ": " + data[i][prop])
                    .appendTo($divInfo);
            }
        }
        $li.append($divInfo).appendTo($ul);
    }
    $ul.appendTo($div);
}

function showMenu(data, $div) {
    var $ul = $("<ul/>")
    for(var i = 0; i < data.length; i++) {
        var $li = $("<li/>");
        var $divInfo = $("<div/>").addClass("menuItemInfo");
        $li.append(
            $("<img/>", {src : data[i].imageUrl})
        );
        for(var prop in data[i]) {
            if(prop !== "imageUrl") {
                $("<p/>")
                    .addClass(prop)
                    .text(prop + ": " + data[i][prop])
                    .appendTo($divInfo);
            }
        }
        $li.append($divInfo).appendTo($ul);
    }
    $ul.appendTo($div);
    var pagin = new Pagination();
    pagin.init($ul, 3);
    var mySort = new Sort();
    mySort.setKeys($divInfo, $("#menuSortKey"), $ul);
}

function showReservations(data) {
    $(".plan img").on("click", function () {
        $("#table").val(this.id);
    });

    $(".table").addClass("free");
    for(var i = 0; i < data.length; i++) {
        var t = "#" + data[i].table;
        $(t).removeClass("free").off("click");
    }
}

function initTimePicker($element) {
    $.widget("ui.timespinner", $.ui.spinner, {
        options: {
            // seconds
            step: 60 * 1000,
            // hours
            page: 60
        },

        _parse: function (value) {
            if (typeof value === "string") {
                // already a timestamp
                if (Number(value) == value) {
                    return Number(value);
                }

                return +Globalize.parseDate(value);
            }
            return value;
        },

        _format: function (value) {
            return Globalize.format(new Date(value), "t");
        }

    });
    Globalize.culture("de-DE");
    $("#timePicker").timespinner();
    $("#timePicker").on("keypress", function (e) {
        var ch = getChar(e);
        if(!ch) return true;
        return (ch >= '0' && ch <= '9') || ch === ":";
    }).on("blur", function (e) {
        $(this).timespinner("stepUp", 1).timespinner("stepDown", 1);
    });

    function getChar(event) {
        if (event.which == null) { // IE
            if (event.keyCode < 32) return null; // спец. символ
            return String.fromCharCode(event.keyCode)
        }

        if (event.which != 0 && event.charCode != 0) { // все кроме IE
            if (event.which < 32) return null; // спец. символ
            return String.fromCharCode(event.which); // остальные
        }

        return null; // спец. символ
    }
}

function Slider($element) {
    // current image number
    var currentImg = 0;
    var intervalId;
    // images array
    var images = $("img", $element);

    $(".prev", $element).click( function () {
        if(intervalId)
            clearInterval(intervalId);
        prev();
    });
    $(".next", $element).click( function () {
        if(intervalId)
            clearInterval(intervalId);
        next();
    });

    function prev() {
        images[currentImg].className = "";
        currentImg = currentImg == 0 ? images.length-1 : currentImg-1;
        images[currentImg].className = "showed";
    }
    function next() {
        images[currentImg].className = "";
        currentImg = currentImg == images.length-1 ? 0 : currentImg+1;
        images[currentImg].className = "showed";
    }

    function start(interval) {
        intervalId = setInterval(next, interval);
    }

    function stop() {
        clearInterval(intervalId);
    }

    return {
        prev: prev,
        next: next,
        start: start,
        stop: stop
    }
}

function Pagination() {
    function makePagination($element, n) {
        // n - number of items on page
        // element - contains items for pagination
        var itemsCount = $element.children().length;
        var pagesCount = Math.ceil(itemsCount / n);
        var $paginControl = $("<ul class='paginControl'/>");
        $element.parent().parent().append($paginControl);
        var anchor = "#" + $paginControl.parent().attr("id");

        // hide all pages except first
        for(var i = n; i < itemsCount; i++) {
            $($element.children()[i]).hide();
        }
        // navigation buttons and handlers
        for(var i = 0; i < pagesCount; i++) {
            $("<li/>").append(
                $("<a/>")
                    .text(i+1)
                    .attr("href", anchor)
                    .on("click", function (e) {
                        $(activePage).removeClass("active");
                        activePage = this;
                        $(activePage).addClass("active");
                        var page = +e.target.innerHTML;
                        // hide all items
                        for (var i = 0; i < itemsCount; i++) {
                            $($element.children()[i]).hide();
                        }
                        // show current page
                        for (var i = (page - 1) * n; i < page * n; i++) {
                            $($element.children()[i]).show();
                        }
                    })).appendTo($paginControl);
        }
        var activePage = $paginControl.find("a")[0];
        $(activePage).addClass("active");
    }

    return {
        init: makePagination
    }
}
