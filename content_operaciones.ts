
if (!chrome) eval(` var chrome = browser; `)

chrome.runtime.onMessage.addListener((msg: { op: string, value: any, complete: boolean, error: any }, sender, response) => {
    console.log(msg)
    document.dispatchEvent(new CustomEvent('lecturaBalanza', { detail: msg }))
})



document.addEventListener('iniciarLecturaBalanza', () => chrome.runtime.sendMessage({ op: 'iniciarLecturaBalanza' }))
document.addEventListener('finalizarLecturaBalanza', () => chrome.runtime.sendMessage({ op: 'finalizarLecturaBalanza' }))

console.log('se ha iniciado la lectura de la balanza')
document.dispatchEvent(new CustomEvent('iniciarLecturaBalanza'))

setTimeout(() => {
    console.log('finalizó la lectura')
    document.dispatchEvent(new CustomEvent('finalizarLecturaBalanza'))
}, 10000)

