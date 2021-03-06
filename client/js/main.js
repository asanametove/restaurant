var rsrvUrl = "/reservation";
var menuUrl = "/menu";
var eventsUrl = "/events";

$(document).ready(function () {
    $.ajaxSetup({cache: false});

    $("#datePicker").datepicker();
    initTimePicker($("#timePicker"));

    // SLIDER
    var slider = new Slider($("#mainSlider"));
    slider.start(2000);

    // RESERVATION
    var rsrv = new Reservation(rsrvUrl, $("#reservationSection"));

    // MENU
    getFile("menu", menuUrl, showMenu, $("#menuSection .menuItems"));

    // EVENTS
    getFile("events", eventsUrl, showEvents, $("#eventsSection .eventsWrapper"));

    // PAGES
    Pages($("header nav > ul > li > a"));


    // MAP
    $("body").append("<script src=\"https://maps.googleapis.com/maps/api/js?key=AIzaSyCndrFlZ8SaPRtfArycbpGbDszOVQLszWk&callback=initMap\"></script>");
    
});

function Pages($navLinks) {
    // $nav links - navigation menu links
    // current page;
    var $current;
        $(document).scroll( function (e) {
            var top = $(this).scrollTop();
            if($current)
                $current.removeClass("current");
            for(var i = $navLinks.length - 1; i >= 0; i--) {
                var id = $($navLinks[i]).attr("href");
                var topOffset = parseInt($(id).offset().top) - parseInt($(id).css("padding-top"));
                if( top >= topOffset) {
                    $current = $($navLinks[i].parentNode);
                    $current.addClass("current");
                    break;
                }
            }
        });
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
            console.error("Failed to load data: " + description);
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
                    .text(capitalize(prop) + ": " + data[i][prop])
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
                    .text(capitalize(prop) + ": " + capitalize(data[i][prop]))
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

function Reservation(url, $section) {
    var $form = $("form[name=reservationForm]", $section);
    function makeReservation() {
        var data = $form.serialize();
        if(!data) {
            throw Error("Reservation form not found");
        }
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function (res) {
                console.error(res);
            },
            error:  function(res){
                console.error(res.responseText || "Reservation fail");
            }
        });
        setTimeout( function () {
            showReservations()
        }, 500 );
    }
    function showReservations() {
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function(data) {
                setTables(data)
            },
            error:  function(res){
                console.error(res.responseText || "Failed to load reservations");
            }
        });
        function setTables(data) {

            // mark all tables as free
            $(".table", $section)
                .addClass("free")
                .on("click", function () {
                    $("input[name=table]", $form).val(this.id);
                });

            // mark reserved tables
            for(var i = 0; i < data.length; i++) {
                var t = "#" + data[i].table;
                $(t).removeClass("free").off("click");
            }
        }
    }
    $form.on("submit", function (e) {
        e.preventDefault();
        if( $("input[name=table]", $form).val() ) {
            makeReservation();
            this.reset();
        }
        else {
            alert("Please, choose table");
        }
    });
    showReservations();

    return {
        make: makeReservation,
        show: showReservations
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}

/*
function fillForm() {
    document.forms[0].firstName.value = "Иван";
    document.forms[0].lastName.value = "Иванов";
    document.forms[0].date.value = "01/01/2017";
    document.forms[0].time.value = "13:00";
    document.forms[0].table.value = "table2";
}
*/
