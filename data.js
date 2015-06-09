var exportCount = 1;
var fileBuffer;

function formatExport(itemDelim, vectorDelim, bracket){
    brackets = bracket ? ["[", "]"] : ["", ""];
    return brackets[0] + rList.join(itemDelim) + brackets[1] + 
	   vectorDelim +
	   brackets[0] + thetaList.join(itemDelim) + brackets[1];
}

function exportSignal(){

    var output = formatExport(
	"%0D%0A",
	"%0D%0A,%0D%0A%0D%0A",
	true);
    
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
    
    var d = data.split("\n");

    newR = d.slice(0, 400).map(parseFloat);
    newTheta = d.slice(0, 400).map(parseFloat);

    // theta not loading correctly

    rList = newR;
    thetaList = newTheta;

    console.log(rList);
    console.log(thetaList);

    calcVectorFromSignal();
}
