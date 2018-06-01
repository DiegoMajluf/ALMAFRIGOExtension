if (!chrome) eval(` var chrome = browser; `)

chrome.webRequest.onHeadersReceived.addListener(function (details) {
    details.responseHeaders.push({ name: "Access-Control-Allow-Credentials", value: "true" });
    details.responseHeaders.push({ name: "Access-Control-Allow-Headers", value: "Authorization, Content-type" });
    details.responseHeaders.push({ name: "Access-Control-Allow-Methods", value: "POST, GET, OPTIONS, DELETE, PUT" });
    details.responseHeaders.push({ name: 'Access-Control-Allow-Origin', value: "*" }); //


    return {
        responseHeaders: details.responseHeaders
    };

}, {
        urls: ["http://www.sii.cl/*", "https://www.google.com/cloudprint/*"]
    }, ['blocking', "responseHeaders"]);


chrome.runtime.onMessage.addListener((msg: { op: string, value: any }, sender, response) => {
    switch (msg.op) {
        case 'iniciarLecturaBalanza':
            readBalanza('http://192.168.8.2:4001', 'TCS-K', sender.tab.id)
            break;
        case 'finalizarLecturaBalanza':
            xhr.abort()
            break;
    }
})

let xhr: XMLHttpRequest;
function readBalanza(ip: string, modelo: string, tabId: number) {
    xhr = new XMLHttpRequest()
    xhr.open('GET', ip, true);
    xhr.onprogress = () => {
        var last = new Date();
        var peso;
        var unidad;
        if (xhr.responseText.length < 20) return;
        switch (modelo) {
            case 'TCS-K':
                var txt = xhr.responseText.slice(-50, -1).split('\n=');
                var str = txt.slice(-2, -1)[0];
                peso = parseFloat(str.substr(0, 7));
                unidad = str.substr(8, 2);
                break;
        }
        chrome.tabs.sendMessage(tabId, { op: 'lecturaBalanza', value: { peso, unidad } })
    }
    xhr.onerror = err => {
        console.error('error', err)
        chrome.tabs.sendMessage(tabId, { op: 'lecturaBalanzaError', error: err });
    }
    xhr.onload = () => {
        console.log("finalizó la lectura de la balanza")
        chrome.tabs.sendMessage(tabId, { op: 'lecturaBalanzaComplete' });
    }
    xhr.send();
}