var request = require("request"),
    cheerio = require("cheerio"),
    url = "http://www.aruodas.lt/namu-nuoma/vilniuje/?detailed_search=&redirect_skelbiu=0&redirect_edomus=0&obj=5&FRegion=461&FDistrict=1&FBuildingType=0&FAreaOverAllMax=&FAreaOverAllMin=&FAreaLotMax=&FAreaLotMin=&FPriceMax=&FPriceMin=",

    corpus = {},
    totalResults = 0,
    resultsDownloaded = 0,
    counter = 1,
    flats = [];

var options = {
    url: "http://www.aruodas.lt/butu-nuoma/vilniuje/?detailed_search=&redirect_skelbiu=0&redirect_edomus=0&obj=4&FRegion=461&FDistrict=1&FAreaOverAllMax=&FAreaOverAllMin=&FRoomNumMax=1&FRoomNumMin=1&FFloorNumMax=&FFloorNumMin=&FFloor=0&FPriceMax=&FPriceMin=",
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
    }
};

function callback() {
    // resultsDownloaded++;
    //
    // if (resultsDownloaded !== totalResults) {
    //     console.log("empty ;/");
    //     return;
    // }
    var total = 0;

    var words = [];

    // stick all words in an array
    for (prop in corpus) {
        words.push({
            word: prop,
            count: corpus[prop]
        });
    }

    // sort array based on how often they occur
    words.sort(function (a, b) {
        return b.count - a.count;
    });

    // finally, log the first fifty most popular words
    console.log(words.slice(0, 20));
    console.log(flats);
    for (var i = 0; i < flats.length; i++) {
        total += flats[i].price;
    }
    console.log(total);
    console.log(total/flats.length);
}
request(options, aruodas);
function everyResultPage(error, response, body) {
    //console.log('lol');
    if (error) {
        console.log("Couldn’t get page because of error: " + error);
        return;
    }

    // console.log(body);

    // load the body of the page into Cheerio so we can traverse the DOM
    var $ = cheerio.load(body),
        links = $(".pagination a:last-child");

    var url = $(links[0]).attr("href");
    console.log(url);
    //console.log(url);

    // strip out unnecessary junk
    // url = url.replace("/url?q=", "").split("&")[0];

    if (typeof url !== 'undefined') {
        if (url.charAt(0) === "/") {
            url = 'http://www.aruodas.lt' + url;
        }
        counter++;
        // if (counter > 4) {
        //     callback();
        //     return;
        // }
        options.url = url;

        // this link counts as a result, so increment results
        totalResults++;

        // download that page
        request(options, function (error, response, body) {
            // console.log(body);
            if (error) {
                console.log("Couldn’t get page because of error: " + error);
                return;
            }

            // load the page into cheerio
            var $page = cheerio.load(body);
            //flats = $page("tr.list-row");
            //console.log(addresses);

            $page("tr.list-row").each(function (i, flat) {
                // console.log(cheerio.load(flat));
                // flat = cheerio.load(flat);
                // console.log(address);
                if (corpus[$(this).find('td.list-adress a').text()]) {
                    // if this address is already in our "corpus", our collection
                    // of terms, increase the count by one
                    corpus[$(this).find('td.list-adress a').text()]++;
                } else {
                    // otherwise, say that we've found one of that address so far
                    corpus[$(this).find('td.list-adress a').text()] = 1;
                }

               // console.log($(this).find('td.list-price .list-item-price').text());


                if(parseInt($(this).find('td.list-price .list-item-price').text()) > 100 && parseInt($(this).find('td.list-price .list-item-price').text()) < 1500 && $(this).find('td.list-price .list-item-price').text() !== '') {
                    var temp = {};

                    temp.address = $(this).find('td.list-adress a').text();
                    temp.price = parseInt($(this).find('td.list-price .list-item-price').text());
                    console.log(temp.price);

                    flats.push(temp);
                }
            });
            //   text = $page("body").text();

            // // throw away extra whitespace and non-alphanumeric characters
            // text = text.replace(/\s+/g, " ")
            //        .replace(/[^a-zA-Z ]/g, "")
            //        .toLowerCase();

            // // split on spaces for a list of all the words on that page and
            // // loop through that list
            // text.split(" ").forEach(function (word) {
            //   // we don't want to include very short or long words, as they're
            //   // probably bad data
            //   if (word.length < 4 || word.length > 20) {
            //     return;
            //   }


            // and when our request is completed, call the callback to wrap up!
            request(options, everyResultPage);
        });
    } else {
        callback();
    }

    // links.each(function (i, link) {
    //     // get the href attribute of each link
    // });
};

function aruodas(error, response, body) {
    var $ = cheerio.load(body);
    //     links = $(".pagination a:last-child");
    //
    // var url = $(links[0]).attr("href");
    // console.log(url);
    //console.log(url);

    // strip out unnecessary junk
    // url = url.replace("/url?q=", "").split("&")[0];


        //options.url = url;

        // this link counts as a result, so increment results
       // totalResults++;

        // download that page
        request(options, function (error, response, body) {
            // console.log(body);
            if (error) {
                console.log("Couldn’t get page because of error: " + error);
                return;
            }

            // load the page into cheerio
            var $page = cheerio.load(body);
            //flats = $page("tr.list-row");
            //console.log(addresses);

            $page("tr.list-row").each(function (i, flat) {
                // console.log(cheerio.load(flat));
                // flat = cheerio.load(flat);
                // console.log(address);
                if (corpus[$(this).find('td.list-adress a').text()]) {
                    // if this address is already in our "corpus", our collection
                    // of terms, increase the count by one
                    corpus[$(this).find('td.list-adress a').text()]++;
                } else {
                    // otherwise, say that we've found one of that address so far
                    corpus[$(this).find('td.list-adress a').text()] = 1;
                }

                // console.log($(this).find('td.list-price .list-item-price').text());

                if(parseInt($(this).find('td.list-price .list-item-price').text()) > 100 && parseInt($(this).find('td.list-price .list-item-price').text()) < 1500 && $(this).find('td.list-price .list-item-price').text() !== '') {
                    var temp = {};

                    temp.address = $(this).find('td.list-adress a').text();
                    temp.price = parseInt($(this).find('td.list-price .list-item-price').text());

                    flats.push(temp);
                }
            });
            //   text = $page("body").text();

            // // throw away extra whitespace and non-alphanumeric characters
            // text = text.replace(/\s+/g, " ")
            //        .replace(/[^a-zA-Z ]/g, "")
            //        .toLowerCase();

            // // split on spaces for a list of all the words on that page and
            // // loop through that list
            // text.split(" ").forEach(function (word) {
            //   // we don't want to include very short or long words, as they're
            //   // probably bad data
            //   if (word.length < 4 || word.length > 20) {
            //     return;
            //   }


            // and when our request is completed, call the callback to wrap up!
            //request(options, everyResultPage);
        });

    request(options, everyResultPage);
}