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
    }, ['blocking', "responseHeaders", "extraHeaders"]);


chrome.runtime.onMessage.addListener((msg: { op: string, value: any }, sender, response) => {
    switch (msg.op) {
        case 'iniciarLecturaBalanza':
            readBalanza(msg.value.ip, msg.value.model, sender.tab.id)
            break;
        case 'finalizarLecturaBalanza':
            xhr && xhr.abort()
            break;
    }
})


chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
    switch (msg.op) {
        case 'printDocs':
            printDocs(msg.value, sender.tab.id)
                .then(resp => sendResponse(resp))
            return true;
    }
});

interface gpRequestData {
    titulo: string
    jobid: string
    ticket: string,
    printerId: string
    token: string
    base64Content: string
}

function printDocs(req: gpRequestData, tabId: number) {
    console.log(req)
    return fetch(req.base64Content)
        .then(res => res.blob())
        .then(b => {
            let q = new FormData();
            q.append('xsrf', req.token);
            q.append('printerid', req.printerId);
            q.append('jobid', req.jobid || '');
            q.append('title', req.titulo);
            q.append('contentType', b.type);
            q.append('ticket', req.ticket);
            q.append('content', b)
            return q
        })
        .then(body => fetch('https://www.google.com/cloudprint/submit', {
            method: 'POST',
            headers: [['Authorization', 'Bearer ' + req.token]],
            body
        }))
        .then(res => res.json())
        .then(json => ({ status: 'OK', response: json }))
        .catch(err => ({ status: 'ERROR', response: err }))



}



let xhr: XMLHttpRequest;
function readBalanza(ip: string, modelo: string, tabId: number) {
    xhr = new XMLHttpRequest()
    xhr.open('GET', ip, true);
    xhr.onprogress = () => {
        let val = balanzas[modelo](xhr.responseText)
        if (val == null) return
        chrome.tabs.sendMessage(tabId, { op: 'lecturaBalanza', value: val })
    }
    xhr.onerror = err => chrome.tabs.sendMessage(tabId, { op: 'lecturaBalanzaError', error: err })
    xhr.onload = () => chrome.tabs.sendMessage(tabId, { op: 'lecturaBalanzaComplete' })
    xhr.send();
}





let balanzas: { [model: string]: (t: string) => any } = {
    'TCS-K': (t: string) => {
        if (xhr.responseText.length < 20) return;
        let txt = t.slice(-50, -1).split('\n=');
        let str = txt.slice(-2, -1)[0];
        try {
            return {
                peso: parseFloat(str.substr(0, 7)),
                unidad: str.substr(8, 2)
            }
        } catch (e) {
            return
        }
    },
    'GS-JZC': (t: string) => {
        if (t = '') return;
        if (t.toUpperCase().indexOf(' G') == -1) return;

        var list = t.toUpperCase().split(' G');   //sacar una lectura
        if (list != null)
            if (list.length > 3) {
                var s = list[list.length - 2].replace(/\s/g, '')
                var i = s.indexOf('GS,') // verificar que la lectura es ok
                return {
                    peso: parseFloat(s.substring(i + 3)),
                    unidad: 'g',
                    estable: s.indexOf('ST') != -1
                }
            }

    }
}
