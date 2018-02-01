function dataV(ctx,conf) {
    if(!ctx){
        console.error("ctx不能为空!");
        return;
    }
    this.context = ctx;
    var initialConfig  = {
        outerCircleWidth: 10,
        outerCircleStartColor: "#ea7875",
        outerCircleEndColor: "#fdca9d",
        outerCircleStartAngle:0.75 * Math.PI,
        outerCircleEndAngle:2.25 * Math.PI,
        outerCircleCenter:{
            x:100,
            y:100
        },
        outerCircleRadius:90,

        innerCircleCenter:{
            x:100,
            y:100
        },
        innerCircleRadius:75,
        innerCircleFillStyle : "#f9f9f9",

        innerArcRadius:55,
        minThreshold:5,
        maxThreshold:30,
        minValue:-55,
        maxValue:85,
        unit:"°",
        value:5,
        centerTextFillStyle :"red",
        centerTextFont :"30px Source Sans Pro",
        bottomText:"偏高 +2",
        bottomTextFillStyle:"white",
        bottomTextFont:"10px Source Sans Pro",
        bottomLineWidth:24,
        bottomLineStrokeStyle:"#e75e71",

        arcTextFillStyle : "#b4b4b4",
        arcTextFont :"10px Source Sans Pro"
    };
    if(conf){
        for(var s in conf){
            initialConfig[s] = conf[s];
        }
    }
    this.conf = initialConfig;
}

dataV.prototype = {
    drawOuterCircle: function () {
        this.context.beginPath();
        this.context.lineWidth = this.conf.outerCircleWidth;
        var gradient = this.context.createLinearGradient(100, 0, 0, 0);
        gradient.addColorStop("0", this.conf.outerCircleStartColor);
        gradient.addColorStop("1.0", this.conf.outerCircleEndColor);
        this.context.strokeStyle = gradient;
        this.context.arc(this.conf.outerCircleCenter.x, this.conf.outerCircleCenter.y,this.conf.outerCircleRadius, this.conf.outerCircleStartAngle, this.conf.outerCircleEndAngle);
        this.context.stroke();
    },
    drawInnerCircle: function () {
        this.context.beginPath();
        this.context.arc(this.conf.innerCircleCenter.x, this.conf.innerCircleCenter.y, this.conf.innerCircleRadius, 0, 2 * Math.PI);
        this.context.fillStyle = this.conf.innerCircleFillStyle;
        this.context.fill();
    },
    drawInnerArc: function (startAngle, endAngle, color) {
        this.context.beginPath();
        this.context.lineWidth = 5;
        this.context.strokeStyle = color;
        this.context.arc(this.conf.innerCircleCenter.x, this.conf.innerCircleCenter.y, this.conf.innerArcRadius, startAngle, endAngle);
        this.context.stroke();
    },
    drawArcText: function (text, thate) {
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = this.conf.arcTextFillStyle;
        this.context.font = this.conf.arcTextFont;
        console.log("text.length",text);
        var radius = this.conf.innerArcRadius + 3;
        var fs = 3;
        var character = null;
        var offSet = null;
        for (var i = 0, len = text.length; i < len; i++) {
            character = text.charAt(i);
            offSet = (i - len / 2) * (Math.PI / 180 * 5);
            this.context.translate(100 + (radius + fs) * Math.cos(thate + offSet), 100 + (radius + fs) * Math.sin(thate + offSet));
            this.context.rotate(Math.PI / 2 + (thate + offSet));
            this.context.fillText(character, 0, 0);
            this.context.stroke();
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
        this.context.restore();
    },
    drawCenterText: function () {
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = this.conf.centerTextFillStyle;
        this.context.font = this.conf.centerTextFont;
        this.context.textAlign = "center";
        this.context.fillText(this.conf.value + this.conf.unit, this.conf.innerCircleCenter.x, this.conf.innerCircleCenter.y+15);//字体元素的一般高度
        this.context.stroke();
    },
    drawBottomText: function () {
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = this.conf.bottomTextFillStyle;
        this.context.font = this.conf.bottomTextFont;
        this.context.textAlign = "center";
        this.context.fillText(this.conf.bottomText == "正常" ? this.conf.bottomText : this.conf.bottomText + this.conf.unit, this.conf.innerCircleCenter.x, 1.5*(this.conf.innerCircleCenter.y));
        this.context.stroke();
    },
    drawBottomLine: function () {
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(0.78*(this.conf.innerCircleCenter.x), 1.45*(this.conf.innerCircleCenter.y));
        this.context.lineTo(1.22*(this.conf.innerCircleCenter.x), 1.45*(this.conf.innerCircleCenter.y));
        this.context.closePath();
        this.context.lineWidth = this.conf.bottomLineWidth;
        this.context.strokeStyle = this.conf.bottomLineStrokeStyle;
        this.context.lineJoin = "round";
        this.context.stroke();
    },
    drawValue: function (thate) {
        console.log("thate = ",thate)
        //thate= 1.85 * Math.PI
        var harfThate = Math.PI / 180 * 5;
        var radius1 = 40;
        var radius2 = 100;
        var x = this.conf.innerCircleCenter.x + radius1 * Math.cos(thate);
        var y = this.conf.innerCircleCenter.y + radius1 * Math.sin(thate);
        var x1 = this.conf.innerCircleCenter.x + radius2 * Math.cos(thate - harfThate);
        var y1 = this.conf.innerCircleCenter.y + radius2 * Math.sin(thate - harfThate);
        var x2 = this.conf.innerCircleCenter.x + radius2 * Math.cos(thate + harfThate);
        var y2 = this.conf.innerCircleCenter.y + radius2 * Math.sin(thate + harfThate);
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.strokeStyle = "gray";
        this.context.lineWidth = 1;
        this.context.lineTo(x2, y2);
        this.context.lineTo(x1,y1);
        //this.context.arcTo(2 * radius2 * Math.cos(harfThate) * Math.sin(thate), 2 * radius2 * Math.cos(harfThate) * Math.cos(thate), x1, y1, radius2 * Math.sin(harfThate));
        this.context.lineTo(x, y);
        this.context.stroke();
        this.context.fill();
    },
    render:function(){
        this.drawOuterCircle();
        this.drawInnerCircle();

        var angleRange = this.conf.outerCircleEndAngle - this.conf.outerCircleStartAngle;
        var valueRange = this.conf.maxValue - this.conf.minValue;
        var thateMin = this.conf.outerCircleStartAngle + angleRange / valueRange * (this.conf.minThreshold - this.conf.minValue);
        var thateMax = this.conf.outerCircleStartAngle + angleRange / valueRange * (this.conf.maxThreshold - this.conf.minValue);

        this.drawInnerArc(this.conf.outerCircleStartAngle, thateMin, "#cccccc");
        this.drawInnerArc(thateMin, thateMax, "#89d5a7");
        this.drawInnerArc(thateMax, this.conf.outerCircleEndAngle, "#7a7a7a");

        this.drawArcText(this.conf.minThreshold+"", thateMin);
        this.drawArcText(this.conf.maxThreshold+"", thateMax);

        this.drawCenterText();
        this.drawBottomLine();
        this.drawBottomText();
        this.drawValue(this.conf.outerCircleStartAngle + angleRange / valueRange *(Number(this.conf.value) - this.conf.minValue))
    }
};