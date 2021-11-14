var IOSDebugOn = true;

btCloseDebug = document.createElement('button');
btCloseDebug.setAttribute("class", "btFechar");
btCloseDebug.innerText = "debug";

btCopyLog = document.createElement('button');
btCopyLog.setAttribute("class", "btCopyLog");
btCopyLog.innerText = "copiar LOG";

contentDebug = document.createElement('textArea');
contentDebug.setAttribute("id", "contDebug");
contentDebug.innerText = "";

var debugL = document.getElementById("debugLayer"); 
debugL.appendChild(btCloseDebug);
debugL.appendChild(btCopyLog);
debugL.appendChild(contentDebug);

var debugOpened = false;
btCloseDebug.addEventListener("click", closeDebug);
function closeDebug(e){
    debugL.style.width = debugOpened ? "10%" : "100%";
    debugL.style.height = debugOpened ? "0%" : "100%";

    debugOpened = !debugOpened;
}

btCopyLog.addEventListener("click", copyLogToCB);
function copyLogToCB(e) {

    var copyText = document.getElementById("contDebug");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
  
    document.execCommand("copy");
    
    debugLog("Log copiado :)");
}

// parent.debugLog(message, from[0=log, 1=content])
function debugLog(msg, src){
    if(src === undefined) console.log(msg);
    if(IOSDebugOn){
        contentDebug.value += src === undefined ? "# " + msg + "\n" :  msg + "\n";
    }
}