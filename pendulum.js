/* pendulum vector compression

 x,y -> (double pendulum angles),(t) -> (multiplexed angles)
 fill/bi 

 licended GNU AGPL3
*/

// image to signal export -> dat file
// signal to image import 
// create floodfill colors between lines
// record dot map of floodfills


var pi = Math.PI;
function cos(x) { return Math.cos(x); }
function sin(x) { return Math.sin(x); }

var canvas = document.getElementById('pendCanvas');
var context = canvas.getContext('2d');

var center = canvas.width/2;
var jointA = [0 , 0];
var jointB = [2 , 2];

var theta = cos(0);
var r = 0;

var lineList = [];

var point = [0, 0];
var lastPoint = [0, 0];
var mouseDown = false;

var pL = center/2; // pendulum bar length

var rList = [];
var thetaList = [];

function print(message, x , y) {
    context.font = '8pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, x, y);
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function drawCircle(x, y, r){
    context.lineWidth = 1;
    context.beginPath();
    context.arc(center+x*pL, center+y*pL, r, 0, 2 * Math.PI, false);
    context.fillStyle = 'black';
    context.fill();
    context.stroke();
}

function drawLine(xA, yA, xB, yB){
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(center+xA*pL,center+yA*pL);
    context.lineTo(center+xB*pL,center+yB*pL);
    context.stroke();
    context.closePath();
}

function drawLineRaw(xA, yA, xB, yB){
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(xA,yA);
    context.lineTo(xB,yB);
    context.stroke();
    context.closePath();
}

function relativeQuadrant(a, b){
    /* ex:
           |   
      b   2|    1
      -----A----- 
           |  
          3|    4

     b = 2
     */

    if (a[0] > b[0] && a[1] > b[1])
	return 3;
    if (a[0] < b[0] && a[1] > b[1])
	return 4;
    if (a[0] < b[0] && a[1] < b[1])
	return 1;
    if (a[0] > b[0] && a[1] < b[1])
	return 2;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

function logVariables(){
    console.log("" +
		"xA :" + jointA[0] 
    		+ " , yA : " + jointA[1]	+ " " +
    		"\nxB :" + jointB[0] 
    		+ " , yB : " + jointB[1] + " " + 
		"\nxC :" + jointC[0] 
    		+ " , yC : " + jointC[1] + " " 
	       );
}

function distance(a, b){
    return Math.sqrt( (a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]) );
}

function angleBetween(a, b){
    return Math.atan2(b[1] -a [1],
		      b[0] - a[0]) * 180/pi;
    
}

function drawImage(){
    for (var i =0; i<lineList.length; i++){
	drawLine(lineList[i][0][0], lineList[i][0][1], 
		 lineList[i][1][0], lineList[i][1][1]);
    }
}

function drawPendulum(){
    drawLine(jointB[0], jointB[1],
	     jointA[0], jointA[1]);
}

function graphSignals(){
    for (var x = 1; x < thetaList.length-1; x+=2){

	drawLineRaw(30+x, 350, 30+x, 
		    350 + thetaList[x]*.2);

	drawLineRaw(30+x, 450, 30+x, 450+rList[x]*29);
    }
}

function cycleSignals(){

    var r = distance(jointA, jointB);
    var theta = angleBetween(jointA, jointB);

    rList.push(r);    

    thetaList.push(theta);
	

    if (rList.length > 300){
	rList = rList.slice(1, 300);
	thetaList = thetaList.slice(1, 300);
    }
}

function calcPendulum(){   
    drawPendulum();
    drawImage();
    graphSignals();

    if (mouseDown){
	drawPoint();
	cycleSignals();
    }	
}

function drawPoint(){
    lastPoint = clone(point);
    point = clone(jointB);
    lineList.push([clone(lastPoint), clone(point)]);
}

canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    drawGraph();

    jointB = [(mousePos.x - center)/pL, 
     	      (mousePos.y - center)/pL];

    if (distance( jointA, jointB) <= 2){
	calcPendulum();
    }
  
    print("x,y: " + jointB[0] + "," + jointB[1]
	  , 20, 20);

}, false);

canvas.addEventListener('mousedown', function(evt) {
    lastPoint = jointB;
    point = jointB;
    mouseDown = true;
    
}, false);

canvas.addEventListener('mouseup', function(evt) {
    mouseDown = false;}
);

function drawGraph(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawLine(0, 0, center, 0);
    drawLine(0, 0, 0, center);

    drawLine(0-center, 0, 0, 0);
    drawLine(0, 0-center, 0, 0);

    // print("X", 0+20, center-20);
    // print("Y", center+20, 0+50);
    drawImage();
    
}


// drawGraph();
// drawPendulum();
// print("x,y: " + jointB[0] + "," + jointB[1]
//     , 20, 20);
