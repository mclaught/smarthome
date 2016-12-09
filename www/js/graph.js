var graph_params = {
    fltN: 0,
    graphselect: ['0','1','2','3','4','5','6'],
    period: 2
};

function update_graph(tm_min, tm_max, t_min, t_max) {
    
    console.log("Start graph");

    var new_height = $(window).height()-100;
    if(new_height < 300)
        new_height = 300;
    $("#placeholder").height(new_height);

    var fltN = graph_params.fltN;
    var period = graph_params.period;
    var visible = 0;
    for(var i=0; i<graph_params.graphselect.length; i++){
        visible |= (1 << graph_params.graphselect[i]);
    }

    $.get('http://boiler.kotbegemot/graph_data_db.php', {fltN: fltN, period: period, nc: Math.random(), visible: visible}, function (jsonText) {
        
        console.log("Graph JSON got");
        
        var data = JSON.parse(jsonText);//xhr.responseText

        var pos_min = (t_min - 0) / 100 * 60 - 30;
        var pos_max = (t_max - 0) / 100 * 60 - 30;

        var options = {
            grid: {
                color: "#fff",
                backgroundColor: {colors: ["#aaa", "#444"]},
                borderWidth: {
                    top: 1,
                    right: 1,
                    bottom: 2,
                    left: 2
                }
            },
            xaxis: {
                mode: "time",
                timezone: "browser"
            },
            yaxes: [
                {min: t_min, max: t_max, position: "right"},
                {min: pos_min, max: pos_max}
            ],
            legend: {
                position: "nw",
                backgroundColor: "#444"
            },
            selection: {
                mode: "xy"
            }
        };

        if (tm_min > 0) {
            options.xaxis.min = tm_min;
            options.xaxis.max = tm_max;
        }

        var plot = $.plot("#placeholder", data, options);

        myApp.pullToRefreshDone('#ptr_graph');
        myApp.hidePreloader();
    });
};

$$(document).on('refresh','#ptr_graph',function(e){ 
    setTimeout(function(){ 
        update_graph(0,0,0,100);
    },500); 
});

myApp.onPageInit('graph', function (page) {
    
    myApp.showPreloader();
    
    // Do something here for "about" page
    graph_params = JSON.parse(localStorage.getItem('graph_params'));
    if(graph_params === null){
        graph_params = {
            fltN: 0,
            graphselect: ['0','1','2','3','4','5','6'],
            period: 2
        };
    }
//    alert(JSON.stringify(graph_params));
    myApp.formFromData('#graph-params',graph_params);
    
    update_graph(0,0,0,100);

    setInterval(function(){
        update_graph(0,0,0,100);
    },60000);
});

$$('.set-graph-params').on('click',function(){
    graph_params = myApp.formToData('#graph-params');
    localStorage.setItem('graph_params', JSON.stringify(graph_params));
    update_graph(0,0,0,100);
    myApp.closePanel();
//    alert(JSON.stringify(graph_params));
});

$(window).on('resize',function(){
    update_graph(0,0,0,100);
});
