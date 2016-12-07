var autoupdate = true;
var last_fuel_state = false;

// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    domCache: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page
//    myApp.alert('Here comes About page');
});

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
//        myApp.alert('Here comes About page');
    }
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
//    myApp.alert('Here comes About page');
});

function update(){
    console.log("Start update");
    
    $('#gaugeBoiler').jqxGauge({
        width: 340,
        min: 20,
        max: 120,
        ranges: [{ startValue: 20, endValue: 65, style: { fill: '#0080ff', stroke: '#0080ff' }, endWidth: 5, startWidth: 1 },
                 { startValue: 65, endValue: 90, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 10, startWidth: 5 },
                 { startValue: 90, endValue: 120, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 13, startWidth: 10 }],
        labels: {interval: 10},     
        ticksMinor: { interval: 1, size: '5%' },
        ticksMajor: { interval: 5, size: '9%' },
        value: 0,
        colorScheme: 'scheme04',
        animationDuration: 1200,
        caption: {value: 'Котел, °C', position: 'bottom', visible: true}
    });

    $('#gaugeBackway').jqxGauge({
        width: 340,
        min: 20,
        max: 120,
        ranges: [{ startValue: 20, endValue: 50, style: { fill: '#0080ff', stroke: '#0080ff' }, endWidth: 5, startWidth: 1 },
                 { startValue: 50, endValue: 65, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 10, startWidth: 5 },
                 { startValue: 65, endValue: 120, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 13, startWidth: 10 }],
        labels: {interval: 10},     
        ticksMinor: { interval: 1, size: '5%' },
        ticksMajor: { interval: 5, size: '9%' },
        value: 0,
        colorScheme: 'scheme04',
        animationDuration: 1200,
        caption: {value: 'Обратка, °C', position: 'bottom', visible: true}
    });

    $('#gaugeCirc').jqxGauge({
        width: 340,
        min: 0,
        max: 100,
        ranges: [{ startValue: 0, endValue: 40, style: { fill: '#0080ff', stroke: '#0080ff' }, endWidth: 5, startWidth: 1 },
                 { startValue: 40, endValue: 80, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 10, startWidth: 5 },
                 { startValue: 80, endValue: 100, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 13, startWidth: 10 }],
        labels: {interval: 10},     
        ticksMinor: { interval: 1, size: '5%' },
        ticksMajor: { interval: 5, size: '9%' },
        value: 0,
        colorScheme: 'scheme04',
        animationDuration: 1200,
        caption: {value: 'Циркуляция, %', position: 'bottom', visible: true}
    });

    $('#gaugePower').jqxGauge({
        width: 340,
        min: 0,
        max: 100,
        ranges: [{ startValue: 0, endValue: 40, style: { fill: '#0080ff', stroke: '#0080ff' }, endWidth: 5, startWidth: 1 },
                 { startValue: 40, endValue: 80, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 10, startWidth: 5 },
                 { startValue: 80, endValue: 100, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 13, startWidth: 10 }],
        labels: {interval: 10},     
        ticksMinor: { interval: 1, size: '5%' },
        ticksMajor: { interval: 5, size: '9%' },
        value: 0,
        colorScheme: 'scheme04',
        animationDuration: 1200,
        caption: {value: 'Мощность, %', position: 'bottom', visible: true}
    });

    $('#gaugeOutside').jqxLinearGauge({
        orientation: 'vertical',
        width: 100,
        height: 350,
        ticksMajor: { size: '10%', interval: 10 },
        ticksMinor: { size: '5%', interval: 2, style: { 'stroke-width': 1, stroke: '#aaaaaa'} },
        min: -40,
        max: 40,
        pointer: { size: '5%' },
        colorScheme: 'scheme05',
        labels: {position: 'both', interval: 10, formatValue: function (value, position) {
            if(value == -40 && position == 'near'){
                return '';
            }
            if (value == 40) {
                return '°C';
            }
            return value + '°';
        }
        },
    //                ranges: [
    //                { startValue: -10, endValue: 10, style: { fill: '#FFF157', stroke: '#FFF157'} },
    //                { startValue: 10, endValue: 35, style: { fill: '#FFA200', stroke: '#FFA200'} },
    //                { startValue: 35, endValue: 45, style: { fill: '#FF4800', stroke: '#FF4800'}}],
        animationDuration: 1500
    });

    $$.get('http://boiler.kotbegemot/json_db.php',{nc: Math.random()},function(jsonText){
    //    alert(jsonText);
        console.log("JSON got");

        var paramsList = myApp.virtualList('#params-list',{
            items: [],
            template: '<li class="item-content">' +
                          '<div class="item-media"><img src="images/{{icon}}"></div>' +
                          '<div class="item-inner">' +
                              '<div class="item-title">{{descr}}</div>' +
                              '<div class="item-after">{{display}}</div>' +
                          '</div>' +
                       '</li>'
        });

        var obj = JSON.parse(jsonText);
        //                alert(JSON.stringify(obj));

//        paramsList.deleteAllItems();
        var replace = false;
        if(paramsList.items.length > 0)
            replace = true;
            
        var N = 0;    
        if(Array.isArray(obj.boiler)){
            for(var i=0; i<obj.boiler.length; i++){
                if(obj.boiler[i].name.substring(0,3) == 'PRM' || obj.boiler[i].name == 'TIM'){
                    
                    if(replace)
                        paramsList.replaceItem(N++,obj.boiler[i]);
                    else
                        paramsList.appendItem(obj.boiler[i]);
                    
                    if (obj.boiler[i].name == "PRM6") {

                        var fuel_state = (obj.boiler[i].value != 0);
                        if (!last_fuel_state && fuel_state) {
                             myApp.addNotification({
                                title: 'Котел',
                                message: 'Закончилось топливо!!!'
                            });    
                            
//                            var snd = new Audio("sound/Ring.wav");
//                            snd.play();
                        }
                        last_fuel_state = fuel_state;
                    }
                    
                    //Приборы
                    if(obj.boiler[i].name == "PRM0")
                        $('#gaugeOutside').jqxLinearGauge('value', obj.boiler[i].value);

                    if(obj.boiler[i].name == "PRM1")
                    {
                        $('#gaugeBoiler').jqxGauge('value', obj.boiler[i].value);
                    }

                    if(obj.boiler[i].name == "PRM2")
                        $('#gaugeBackway').jqxGauge('value', obj.boiler[i].value);

                    if(obj.boiler[i].name == "PRM20")
                        $('#gaugeCirc').jqxGauge('value', obj.boiler[i].value);

                    if(obj.boiler[i].name == "PRM21")
                        $('#gaugePower').jqxGauge('value', obj.boiler[i].value);

                    if(obj.boiler[i].name == "TIM")
                        $('#update-time').text(obj.boiler[i].display);
                }
            }
        }
        myApp.pullToRefreshDone('#ptr_index');
    });
}

$("#btn-update").on('click',function(){
//    alert("Update");
    update();
});

$$('#ptr_index').on('refresh',function(){
    setTimeout(function(){
        update();
    },500);
});

//$$('#ptr_graph').on('refresh',function(){
//    setTimeout(function(){
//        update_graph(0,0,0,100);
//    },500);
//});

myApp.onPageInit('index', function (page) {
    // Do something here for "about" page
    update();

    setInterval(function(){
        update();
    },15000);
});

update();
