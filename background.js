function Background() {
    throw new Error('This is a static class');
}

//像素跨度
Background.Step = 100;
Background.Zoom = 1;
Background.StrokeColor0 = "#000000";
Background.StrokeColor1 = "#999999";
Background.StrokeColor2 = "#E0E0E0";
Background.BackgroundColor = "#FFFFFF";
Background.Canvas = null;
Background.OffsetX = 0;
Background.OffsetY = 0;
Background.Width = 0;
Background.Height = 0;
Width = 0;
Height = 0;

Background.getColor = function (r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

Background.bindCanvas = function (id) {
    if (this.Canvas != null) {
        this.Canvas.removeEventListener("mousedown", doMouseDown, false);
        this.Canvas.removeEventListener("mousemove", doMouseMove, false);
        this.Canvas.removeEventListener("mouseup", doMouseUp, false);
    }
    this.Canvas = document.getElementById(id);
    if (this.Canvas != null) {
        this.Canvas.addEventListener("mousedown", doMouseDown, false);
        this.Canvas.addEventListener("mousemove", doMouseMove, false);
        this.Canvas.addEventListener("mouseup", doMouseUp, false);
        this.Canvas.addEventListener("mousewheel", doMouseWheel, false);
    }
}

Background.setCanvasSize = function (width, height) {
    this.Canvas.width = width;
    this.Canvas.height = height;
}

Background.updateData = function () {
    var rect = this.Canvas.getBoundingClientRect();
    this.Width = rect.width;
    this.Height = rect.height;
    Width = rect.width;
    Height = rect.height;
    this.OffsetX = Math.floor(this.OffsetX);
    this.OffsetY = Math.floor(this.OffsetY);
}

Background.updateCanvas = function () {
    this.updateData();
    if (this.Canvas.width != this.Width) {
        this.Canvas.width = this.Width;
    }
    if (this.Canvas.height != this.Height) {
        this.Canvas.height = this.Height;
    }
    this.clearCanvas();
    this.drawBackground();
}

Background.setOriginToScreenCenter = function () {
    this.OffsetX = Math.floor(Width / 2);
    this.OffsetY = Math.floor(Height / 2);
    this.updateCanvas();
}

Background.drawBackground = function () {
    this.drawGrid(this.StrokeColor2, 1, this.Step / 5 * this.Zoom);
    this.drawGrid(this.StrokeColor1, 2, this.Step * this.Zoom);
    this.drawCoordinateAxis(this.StrokeColor0, 3);
}

Background.drawGrid = function (strokeColor, strokeWidth, step) {
    offsetX = this.OffsetX % step;
    offsetY = this.OffsetY % step;
    //console.log("OffsetX=" + this.OffsetX + ",OffsetY=" + this.OffsetY);
    var ctx = this.Canvas.getContext("2d");
    ctx.strokeStyle = strokeColor;
    ctx.strokeWidth = strokeWidth;
    ctx.beginPath();
    for (x = 0.5 + offsetX; x < Width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, Height);
        ctx.stroke();
    }
    for (y = 0.5 + offsetY; y < Height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(Width, y);
        ctx.stroke();
    }
    ctx.closePath();
}

Background.drawCoordinateAxis = function (strokeColor, strokeWidth) {
    var ctx = this.Canvas.getContext("2d");
    ctx.strokeStyle = strokeColor;
    ctx.strokeWidth = strokeWidth;
    ctx.beginPath();
    //y
    ctx.moveTo(this.OffsetX, 0);
    ctx.lineTo(this.OffsetX, Height);
    ctx.stroke();
    //x
    ctx.moveTo(0, this.OffsetY);
    ctx.lineTo(Width, this.OffsetY);
    ctx.stroke();
    ctx.closePath();
}

Background.clearCanvas = function () {
    var ctx = this.Canvas.getContext("2d");
    ctx.clearRect(0, 0, this.Width, this.Height);
}

lastX = 0;
lastY = 0;
isDown = false;
function doMouseDown(e) {
    isDown = true;
    lastX = e.clientX;
    lastY = e.clientY;
}

function doMouseMove(e) {
    if (isDown) {
        offsetX = e.clientX - lastX;
        offsetY = e.clientY - lastY;
        Background.OffsetX += offsetX;
        Background.OffsetY += offsetY;
        Background.clearCanvas();
        Background.drawBackground();
        lastX = e.clientX;
        lastY = e.clientY;
    }
}

function doMouseUp(e) {
    isDown = false;
}

function doMouseWheel(e) {
    if (e.altKey) {
        Background.Zoom -= e.deltaY * 0.001;
        if (Background.Zoom > 2) {
            Background.Zoom = 2;
        }
        if (Background.Zoom < 0.7) {
            Background.Zoom = 0.7;
        }
    } else if (e.shiftKey) {
        Background.OffsetX -= Math.floor(e.deltaY * Background.Zoom);
    } else {
        Background.OffsetY -= Math.floor(e.deltaY * Background.Zoom);
    }
    Background.updateCanvas();
}