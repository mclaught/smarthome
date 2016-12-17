var initParams = {};

function setts_update(){
    $$.get('http://boiler.kotbegemot/json_db.php',{nc: Math.random()},function(jsonText){
        console.log("JSON got");
        
        var sliders = {
//            SET0: {
//                min: 50,
//                max: 100
//            }
        };
        
        var settsList = myApp.virtualList('#setts-list', {
            items: [],
            renderItem: function(index, item){
                
                var tp = item.type;
                var min = 0;
                var max = 100;
                if(item.name in sliders){
                    console.log(item.name+' in sliders');
                    tp = 'slider';
                    min = sliders[item.name].min;
                    max = sliders[item.name].max;
                }else{
                    console.log(item.name+' not in sliders');
                }
                
                switch(tp){
                    case 'num':
                        return '<li><div class="item-content">' +
                          '<div class="item-inner">' +
                              '<div class="item-title floating-label" style="width: 80%">' + item.descr + '</div>' +
                              '<div class="item-input" style="width: 20%"><input type="number" class="param-elem" id="'+item.name+'" name="'+item.name+'" value="'+item.value+'"></div>' +
                          '</div>' +
                       '</div></li>';
                    case 'bool':
                        return '<li><div class="item-content">' +
                          '<div class="item-inner">' +
                              '<div class="item-title floating-label" style="width: 80%">' + item.descr + '</div>' +
                              '<div class="item-input" style="width: 20%"><label class="label-switch"><input type="checkbox" class="param-elem" id="'+item.name+'" name="'+item.name+'" value="checkbox" '+
                              (item.value==1 ? 'checked' : '') +
                              '><div class="checkbox"></div></label></div>' +
                          '</div>' +
                       '</div></li>';
                    case 'selprm':
                        return '<li><div class="item-content">' +
                          '<div class="item-inner">' +
                              '<div class="item-title floating-label" style="width: 80%">' + item.descr + '</div>' +
                              '<div class="item-input" style="width: 20%"><select class="param-elem" id="'+item.name+'" name="'+item.name+'">' +
                                '<option value="1">Котел</option>' +
                                '<option value="2">Обратка</option>' +
                                '<option value="3">Система</option>' +
                              '</select></div>' +
                          '</div>' +
                       '</div></li>';
                    case 'slider':
                        return '<li><div class="item-content">' +
                          '<div class="item-inner">' +
                              '<div class="item-title label">' + item.descr + '</div>' +
                              '<div class="item-input"><div class="range-slider"><input type="range" min="'+min+'" max="'+max+'" value="'+item.value+'" step="1"></div></div>' +
                          '</div>' +
                       '</div></li>';
                    default:   
                        return '<li class="item-content">' +
                          '<div class="item-inner">' +
                              '<div class="item-title">' + item.descr + '</div>' +
                              '<div class="item-after">' + item.type + '</div>' +
                          '</div>' +
                       '</li>';
                }
                
            }
        });

        var obj = JSON.parse(jsonText);
        
        var replace = false;
        if(settsList.items.length > 0)
            replace = true;
        
        var N = 0;    
        if(Array.isArray(obj.boiler)){
            for(var i=0; i<obj.boiler.length; i++){
                if(obj.boiler[i].name.substring(0,3) == 'SET'){
                    
                    if(replace)
                        settsList.replaceItem(N++,obj.boiler[i]);
                    else
                        settsList.appendItem(obj.boiler[i]);
                }
            }
        }
        myApp.pullToRefreshDone('#ptr_settings');
        
        initParams = myApp.formToData('#settings-form');
    
        $$('.param-elem').on('change',function(e){
            var prm = e.target.id;
            var val = e.target.value;
            if(val == 'checkbox')
                val = e.target.checked ? 1 : 0;
            console.log(prm+' = '+val);
            $$.get("http://boiler.kotbegemot/write_settings_db.php",{setname: prm, val: val},function(data){
                myApp.addNotification({
                    title: 'Установка параметра',
                    message: data,
                    closeOnClick: true,
                    onClose: function(){
                        setts_update();
                    }
                });
            });
        });
    });
}

myApp.onPageInit('settings',function(page){
//    myApp.alert("Settings");
    cur_page = 'settings';
    setts_update();
    
//    $$('.btn-set-params').on('click',function(){
//        var params = myApp.formToData('#settings-form');
//        
//        var changed = [];
//        for(var field in initParams){
//            console.log('Field: '+field);
//            if(initParams.hasOwnProperty(field)){
//                console.log('  exists');
//                if(initParams[field] != params[field]){
//                    console.log('  changed');
//                    changed[field] = params[field];
//                }
//            }
//        }
//        
//        alert(JSON.stringify(changed));
//    });  
});

$$(document).on('refresh','#ptr_settings',function(e){ 
    setTimeout(function(){ 
        setts_update();
    },500); 
});
