var isTouchSupported = 'ontouchstart' in window;
var isPointerSupported = navigator.pointerEnabled;
var isMSPointerSupported = navigator.msPointerEnabled;


var canvas = {};
canvas.el = null;
canvas.ctx = null;
canvas.isActive = false;
canvas.plots = [];
canvas.color = '#fff';
canvas.pubnub = null;
canvas.channel = null;
canvas.canDraw = true;
canvas.init = function (pubnub, channel) {
    canvas.channel = channel;
    canvas.pubnub = pubnub;
    canvas.getCanvas();
    canvas.events();
};
canvas.getCanvas = function () {
    canvas.el = document.getElementById('drawCanvas');
    canvas.ctx = canvas.el.getContext('2d');
    canvas.color = document.querySelector(':checked').getAttribute('data-color');

    canvas.ctx.strokeStyle = canvas.color;
    canvas.ctx.lineWidth = '3';
    canvas.ctx.lineCap = canvas.ctx.lineJoin = 'round';
};
canvas.events = function () {
    var downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
    var moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
    var upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));

    canvas.el.addEventListener(downEvent, canvas.startDraw, false);
    canvas.el.addEventListener(moveEvent, canvas.draw, false);
    canvas.el.addEventListener(upEvent, canvas.endDraw, false);

    document.getElementById('colorSwatch').addEventListener('click', function () {
        canvas.color = document.querySelector(':checked').getAttribute('data-color');
    }, false);
};
canvas.updateCanvas = function (data, owner) {
    var imgUrl = data.url;
    var prevImgUrl = $("#imgDiv").attr('src');
    //if (owner == undefined || !owner) {
        //canvas.clearCanvas();
    //}
    if (prevImgUrl != imgUrl) {
        $('.loaderImg').show();
        $("#imgDiv").load(function () {
            $('.loaderImg').hide();
            $(this).attr('width', $('#canvas-container').width());
            canvas.el.width = $(this).width();
            canvas.el.height = $(this).height();
        }).attr('src', imgUrl);
    }
};
canvas.drawFromStream = function (message) {
    if (!message || message.plots.length < 1)
        return;
    canvas.drawOnCanvas(message.color, message.plots);
};
canvas.drawOnCanvas = function (color, plots) {
    canvas.ctx.strokeStyle = color;
    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = '3';
    canvas.ctx.lineCap = canvas.ctx.lineJoin = 'round';
    canvas.ctx.moveTo(plots[0].x, plots[0].y);

    for (var i = 1; i < plots.length; i++) {
        canvas.ctx.lineTo(plots[i].x, plots[i].y);
    }
    canvas.ctx.stroke();
};
canvas.draw = function (e) {
    if (canvas.canDraw) {
        e.preventDefault(); // prevent continuous touch event process e.g. scrolling!
        if (!canvas.isActive) return;

        var app = $(canvas.el).offset();
        var x = isTouchSupported ? (e.targetTouches[0].pageX - app.left) : (e.offsetX || e.layerX - canvas.el.offsetLeft);
        var y = isTouchSupported ? (e.targetTouches[0].pageY - app.top) : (e.offsetY || e.layerY - canvas.el.offsetTop);
        /*
            var x = isTouchSupported ? (e.targetTouches[0].pageX - canvas.el.offsetLeft) : (e.offsetX || e.layerX - canvas.el.offsetLeft);
            var y = isTouchSupported ? (e.targetTouches[0].pageY - canvas.el.offsetTop) : (e.offsetY || e.layerY - canvas.el.offsetTop);
            */
        canvas.plots.push({ x: (x << 0), y: (y << 0) }); // round numbers for touch screens

        canvas.ctx.lineWidth = '3';
        canvas.ctx.lineCap = canvas.ctx.lineJoin = 'round';
        canvas.drawOnCanvas(canvas.color, canvas.plots);
    }
};
canvas.startDraw = function (e) {
    if (canvas.canDraw) {
        e.preventDefault();
        //if (!canvas.canDraw) return false;
        canvas.isActive = true;
    }
};
canvas.endDraw = function (e) {
    if (canvas.canDraw) {
        e.preventDefault();
        //if (!canvas.canDraw) return false;
        canvas.isActive = false;
        if (canvas.pubnub) {
            canvas.pubnub.publish({
                channel: canvas.channel,
                message: {
                    color: canvas.color,
                    plots: canvas.plots
                }
            });
        }
        canvas.plots = [];
    }
};
canvas.clearCanvas = function () {
    canvas.ctx.clearRect(0, 0, canvas.el.width, canvas.el.height);
}