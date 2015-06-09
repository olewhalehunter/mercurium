var exportCount = 1;
var fileBuffer;

function formatExport(itemDelim, vectorDelim, bracket){
    brackets = bracket ? ["[", "]"] : ["", ""];

    return dataLength.toString() + itemDelim +
	brackets[0] + rList.join(itemDelim) + brackets[1] +
	vectorDelim +
	brackets[0] + thetaList.join(itemDelim) + brackets[1];
}

function exportSignal(){

    var output = formatExport(
	"%0D%0A",
	"%0D%0A",
	false);
    
    var a         = document.createElement('a');
    a.href        = 'data:attachment/dat,' + output;
    a.target      = '_blank';
    a.download    = 'mercurium' + exportCount.toString() + '_.dat';
    exportCount++;

    document.body.appendChild(a);
    a.click();
}

function importSignal(evt) {
    var tgt = evt;
    files = tgt.files;

    if (FileReader && files && files.length > 0) {
        var fr = new FileReader();

        fr.onload = function () {
            fileBuffer = fr;
	    processImport(fr.result);
        }
        fr.readAsBinaryString(files[0]);

    } else { 
	alert("File API not supported on this browser.");
    }
}

function processImport(data){
    merciumMode = "write";
    importDelim = "\n";

    var d = data.split(importDelim);
    console.log(d);
    dataLength = parseFloat(d[0]);
    newR = d.slice(1, dataLength).map(parseFloat);
    newTheta = d.slice(dataLength, (dataLength*2)-1).map(
	function (x) { 
	    return parseFloat(x)/180*pi; }
    );

    rSum = 0; thetaSum = 0;
    for (var r in newR){ 
	rSum += newR[r];
    }
    
    for (var t in newTheta){ 
	thetaSum += newTheta[t];
	console.log(t);
    }

    thetaAverage = thetaSum/newTheta.length;
    rAverage = rSum/newR.length;

    rList = newR; 
    thetaList = newTheta;

    console.log(rList);
    console.log(thetaList);

    calcVectorsFromSignal();
    drawGraph();
    
}
