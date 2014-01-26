var seriesUrlBase = "http://seriesly.hexeditreality.com/";

var ignore = {
    "device": true, "level2": true
};

var compareStep = 1000 * 60 * 30;
var detailStep = 1000 * 60 * 5;

var insideSensors = ["level0", "level1"]

function findInside(here) {
    drawInside(here, insideSensors);
}

function shouldIgnore(dbname) {
    return (!dbname) || ignore[dbname];
}

function drawInside(here, dbs) {
    var things = [];
    for (var i = 0; i < dbs.length; i++) {
        if (!shouldIgnore(dbs[i])) {
            things.push({db: dbs[i], path: "/temp", red: "avg", lbl:""+dbs[i]+" temp"});
        }
    }
    var context = seriesly.context()
        .step(detailStep)
        .size($(here).width())
        .serverDelay(1000)
        .clientDelay(1000);

    d3.select(here).selectAll(".axis")
        .data(['top'])
        .enter().append("div")
        .attr("class", function(d) { return d + " axis"; })
        .each(function(d) {
            d3.select(this).call(context.axis()
                                 .ticks(12)
                                 .focusFormat(d3.time.format("%m-%d %H:%M"))
                                 .orient(d));
        });

    d3.select(here).append("div")
        .attr("class", "rule")
        .call(context.rule());

    context.on("focus", function(i) {
        d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
    });

    var sr = context.seriesly(seriesUrlBase);

    d3.select(here).selectAll(".horizon")
        .data(things.map(function(x) {
            return sr.metric(x.db, x.path, x.red, x.lbl);
        }))
      .enter().insert("div", ".bottom")
        .attr("class", function(d, i) { return "horizon " + things[i].red; })
        .call(context.horizon().height(30).format(d3.format(".2f")));
}

var outsideSensors = ["wx"]

function findOutside(here) {
    drawOutside(here, outsideSensors);
}

function drawOutside(here, dbs) {
    var things = [];
    for (var i = 0; i < dbs.length; i++) {
        if (!shouldIgnore(dbs[i])) {
            things.push({db: dbs[i], path: "/temp", red: "avg", lbl:"temp"});
            things.push({db: dbs[i], path: "/dewp", red: "avg", lbl:"dewpoint"});
            things.push({db: dbs[i], path: "/pressure", red: "avg", lbl:"pressure"});
            things.push({db: "device", path: "/batteryVoltage", red: "avg", lbl:"wx station voltage"});
        }
    }

    var context = seriesly.context()
        .step(detailStep)
        .size($(here).width())
        .serverDelay(1000)
        .clientDelay(1000);

    d3.select(here).selectAll(".axis")
        .data(['top'])
        .enter().append("div")
        .attr("class", function(d) { return d + " axis"; })
        .each(function(d) {
            d3.select(this).call(context.axis()
                                 .ticks(12)
                                 .focusFormat(d3.time.format("%m-%d %H:%M"))
                                 .orient(d));
        });

    d3.select(here).append("div")
        .attr("class", "rule")
        .call(context.rule());

    context.on("focus", function(i) {
        d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
    });

    var sr = context.seriesly(seriesUrlBase);

    d3.select(here).selectAll(".horizon")
        .data(things.map(function(x) {
            return sr.metric(x.db, x.path, x.red, x.lbl);
        }))
      .enter().insert("div", ".bottom")
        .attr("class", function(d, i) { return "horizon " + things[i].red; })
        .call(context.horizon().height(30).format(d3.format(".2f")));
}
