chrome.runtime.onMessage.addListener((msg: { op: string, value: any, complete: boolean, error: any }, sender, response) => {
    window.postMessage(msg, "*")
      //  document.dispatchEvent(new CustomEvent(msg.op, { detail: { value: msg.value, error: msg.error } }))
})



document.addEventListener('iniciarLecturaBalanza', (e: CustomEvent<{ ip: string, model: string }>) => {
    chrome.runtime.sendMessage({
        op: 'iniciarLecturaBalanza',
        value: {
            model: e.detail.model,
            ip: e.detail.ip
        }
    })
})
document.addEventListener('finalizarLecturaBalanza', () => chrome.runtime.sendMessage({ op: 'finalizarLecturaBalanza' }))

window.onbeforeunload = () => chrome.runtime.sendMessage({ op: 'finalizarLecturaBalanza' })

