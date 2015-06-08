var exportCount = 1;

function formatExport(itemDelim, vectorDelim, bracket){
    brackets = bracket ? ["[", "]"] : ["", ""];
    return brackets[0] + rList.join(itemDelim) + brackets[1] + 
	   vectorDelim +
	   brackets[0] + rList.join(itemDelim) + brackets[1];
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

