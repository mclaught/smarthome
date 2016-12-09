
function drawGauge(holder, options){

    function valToAngle(val){
        var a = (val-options.min)/(options.max-options.min)*(options.endAngle-options.startAngle)+options.startAngle; 
//        console.log("val = "+val+" a = "+a);
        return a/180*Math.PI;
    }
    
    function drawTicks(ctx, d, sz){
        for(var v = options.min; v <= options.max; v += d){

            var a = valToAngle(v);

            ctx.moveTo(x0 + Math.cos(a)*(r-5),  y0 + Math.sin(a)*(r-5));
            ctx.lineTo(x0 + Math.cos(a)*(r-5-sz), y0 + Math.sin(a)*(r-5-sz));
        }
    }
    
    if(options.endAngle < options.startAngle)
        options.endAngle += 360;
    
    console.log("Holder: " + holder[0].id);
    console.log("HTML: " + holder.html());
    
    holder.empty();
    holder.html('<canvas></canvas>');
    console.log("HTML: " + holder.html());

    var $canv = holder.children().first();
    var width = holder.width();
    var height = holder.height();
    $canv.attr('width',width);
    $canv.attr('height',height);//holder.height()
    console.log("Width: " + $canv.width());
    console.log("Height: " + $canv.height());
    
    var canvas = $canv[0];
    console.log("Canvas: " + canvas.tagName);
    
    var r = Math.min(width,height)/2-options.margin;
    var x0 = width/2;
    var y0 = height/2;

    var img = new Image();
    img.onload = function(){
        var ctx = canvas.getContext('2d');
    //    ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'black';

        ctx.strokeStyle = 'white';
    //    var grd = ctx.createLinearGradient(0,0,width,height);    
    //    grd.addColorStop(0,'#1e5799');
    //    grd.addColorStop(1,'#7db9e8');
        var ptr = ctx.createPattern(img,'repeat');
        ctx.fillStyle = ptr; 
        
        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.arc(x0,y0,r,0,2*Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;

        ctx.beginPath();
        drawTicks(ctx, options.ticksMajor, 10);
        drawTicks(ctx, options.ticksMinor, 5);

        //Text
    //    ctx.beginPath();
        ctx.font = '10pt Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle='white';
        for(var v = options.min; v <= options.max; v += options.labels){

            var a = valToAngle(v);
            var x = x0 + Math.cos(a)*(r-30);
            var y = y0 + Math.sin(a)*(r-30);
            ctx.fillText(v,x,y);
        }

        ctx.stroke();

        //Handle
        var a1 = valToAngle(options.value);
        var a2 = a1 + Math.PI*2/3;
        var a3 = a1 + Math.PI*4/3;

        var x1 = x0 + Math.cos(a1)*(r-30);
        var y1 = y0 + Math.sin(a1)*(r-30);
        var x2 = x0 + Math.cos(a2)*10;
        var y2 = y0 + Math.sin(a2)*10;
        var x3 = x0 + Math.cos(a3)*10;
        var y3 = y0 + Math.sin(a3)*10;

        var grd = ctx.createLinearGradient(x2,y2,x1,y1);    
        grd.addColorStop(0,'gray');
        grd.addColorStop(1,'white');
        ctx.fillStyle=grd;

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'black';

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.lineTo(x1,y1);
        ctx.stroke();
        ctx.fill();
    }
    img.src = '../images/metall62.jpg';
}
