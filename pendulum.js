/* pendulum vector compression

 x,y -> (double pendulum angles),(t) -> (multiplexed angles)
 fill/bi 

 licended GNU AGPL3
*/

// get relative x,y coords canvas -> display
// draw pendulum /calc angles from x,y coords
// record angles by step for draw sequence
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
var jointC = [1 , 1];

var angleA = cos(0);
var angleB = cos(0);

var lineList = [];

var point = [0, 0];
var lastPoint = [0, 0];
var mouseDown = false;

var pL = center/2; // pendulum bar length

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
    context.moveTo(center+xA*pL,center+yA);
    context.lineTo(center+xB,center+yB);
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

function drawImage(){
    for (var i =0; i<lineList.length; i++){
	drawLine(lineList[i][0][0], lineList[i][0][1], 
		 lineList[i][1][0], lineList[i][1][1]);
    }
}

function drawPendulum(){
    jointA = [0, 0];
    
    drawCircle(jointA[0], jointA[1], 3);
    print("A", jointA[0]*pL+center+20, jointA[1]*pL+center-20);

    drawCircle(jointB[0], jointB[1], 3);
    print("B", jointB[0]*pL+center+20, jointB[1]*pL+center-20);

    drawCircle(jointC[0], jointC[1], 3);
    print("C", jointC[0]*pL+center+20, jointC[1]*pL+center-20);
    
    drawLine(jointA[0], jointA[1],
	     jointC[0], jointC[1]);
    drawLine(jointB[0], jointB[1],
	     jointC[0], jointC[1]);

}

function calcPendulum(){

    //drawGraph();

    jointA = [0, 0];
    found = false;
    for (a = -2*pi; a< (2*pi); a += (pi/50) ){
	
	cPosB = [jointB[0] + cos(a), 
		 jointB[1] + sin(a)];

	for (b = 2*pi; b>(-2*pi); b-=(pi/30)){
	    cPosA = [jointA[0] + cos(b), jointA[1]+ sin(b)];

	    if (distance( cPosA, cPosB) <= .5){
		jointC[0] = jointA[0] - cos(a);
		jointC[1] = jointA[1] - sin(a);	
		
		found = true;
		if (mouseDown)
		    drawPoint();
		break;
	    }
	}
	if (found)
	    break;
    }
    drawPendulum();
    drawImage();
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
    jointA = [0, 0];

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
