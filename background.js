

chrome.webRequest.onHeadersReceived.addListener(function (details) {

    details.responseHeaders.push({ name: "Access-Control-Allow-Credentials", value: "true" });
    details.responseHeaders.push({ name: "Access-Control-Allow-Headers", value: "Authorization, Content-type" });
    details.responseHeaders.push({ name: "Access-Control-Allow-Methods", value: "POST, GET, OPTIONS, DELETE, PUT" });
    details.responseHeaders.push({ name: 'Access-Control-Allow-Origin', value: "*" }); //

    return {
        responseHeaders: details.responseHeaders
    };
    
}, { urls: ['<all_urls>'] }, ['blocking', "responseHeaders"]);
