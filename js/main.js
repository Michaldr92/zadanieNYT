$(document).ready(function() {
	
    var myVar = setInterval(myTimer, 1000);
    function myTimer() {
        var d = new Date();
        document.getElementById("current_time").innerHTML = d.toLocaleTimeString() + " | " + d.toLocaleDateString();
    }
	
	$( "#startYear").datepicker( {
        changeYear: true,
        showButtonPanel: true,
		showOn: "button",
		buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
        buttonImageOnly: true,
		buttonText: "Select date",
		dateFormat: 'yy',
        onClose: function(dateText, inst) { 
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year));
        }
	});
	$( "#endYear" ).datepicker( {
        changeYear: true,
        showButtonPanel: true,
		showOn: "button",
		buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
        buttonImageOnly: true,
		buttonText: "Select date",
		dateFormat: 'yy',
        onClose: function(dateText, inst) { 
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year));
        }
	});
	
    var content = document.getElementById('content');
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': "5269a4451a634d6690fb3874e8fe9741"
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(result) {
        nytArticles(result);
        console.log(result);
    }).fail(function(err) {
        throw err;
    });

    function nytArticles(data) {
        var nytArticlesResult = '';
        var nytResult = data.response.docs;
        for (var j = 0; j < nytResult.length; j++) {
            nytArticlesResult += '<div class="block">' + '<p>' + nytResult[j].pub_date.substring(0, 10) + '</p>' + '<p>' + '<a href=' + nytResult[j].web_url + ' class="nyt_link">' + nytResult[j].headline.main + '</a>' + '</p>' + '</div>';
        }
        content.innerHTML = nytArticlesResult;
    }

    /*
     * Klucz API - a95da46f5d1d40fbbc17a8a6f5f2d121
     */
    var apiKey = "a95da46f5d1d40fbbc17a8a6f5f2d121";

    var queryTerm = "";
    var numResults = 0;
    var startYear = 0;
    var endYear = 0;

    var URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + apiKey + "&q=";

    // Zerowanie 
    var counterArticles = 0;

    function runQuery(numArticles, queryURL) {

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function(NYTData) {

                console.log("URL: " + queryURL);
                console.log("#############################")
                console.log(NYTData);

                // Pętla - liczba artykułów
                for (var i = 0; i < numArticles; i++) {

                    counterArticles++;

                    // Tworzenie sekcji i dodanie artykułów
                    var wellSection = $("<div>");
                    wellSection.addClass('well');
                    wellSection.attr('id', 'articleWell-' + counterArticles)
                    $('#wellSection').append(wellSection);

                    // Jeśli artykuł posiada nagłówek to dołącz do HTML
                    if (NYTData.response.docs[i].headline != "null") {
                        $("#articleWell-" + counterArticles).append('<h3><span class="label label-success">' +
                            counterArticles + '</span><strong>   ' + NYTData.response.docs[i].headline.main + "</strong></h3>");
                        console.log(NYTData.response.docs[i].headline.main);
                    }

                    if (NYTData.response.docs[i].byline && NYTData.response.docs[i].byline.hasOwnProperty("original")) {
                        $("#articleWell-" + counterArticles).append('<h5>' +
                            NYTData.response.docs[i].byline.original + "</h5>");
                        console.log(NYTData.response.docs[i].byline.original);
                    }

                    // Wyświetlenie wyników na stronie
                    $("#articleWell-" + counterArticles).append('<h5>Section: ' +
                        NYTData.response.docs[i].section_name + "</h5>");
                    $("#articleWell-" + counterArticles).append('<h5>' +
                        NYTData.response.docs[i].pub_date + "</h5>");
                    $("#articleWell-" + counterArticles).append("<a href='" +
                        NYTData.response.docs[i].web_url + "'>" + NYTData.response.docs[i].web_url + "</a>");

                    // Logi
                    console.log(NYTData.response.docs[i].pub_date);
                    console.log(NYTData.response.docs[i].section_name);
                    console.log(NYTData.response.docs[i].web_url);
                }
            });

    }

    // Akcje on-click
    $('#runSearch').on('click', function() {

        counterArticles = 0;

        $("#wellSection").empty();
        var searchTerm = $('#searchTerm').val().trim();
        queryURL = URL + searchTerm;
        numResults = $("#numRecordsSelect").val();
        startYear = $('#startYear').val().trim();
        endYear = $('#endYear').val().trim();

        if (parseInt(startYear)) {
            queryURL = queryURL + "&begin_date=" +
                startYear + "0101";
        }
        if (parseInt(endYear)) {
            queryURL = queryURL + "&end_date=" +
                endYear + "0101";
        }

        runQuery(numResults, queryURL);

        return false;
    });

    // Czyszczenie sekcji
    $('#clearAll').on('click', function() {
        counterArticles = 0;
        $("#wellSection").empty();
    })

});