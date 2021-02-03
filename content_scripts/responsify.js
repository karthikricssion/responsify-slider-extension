browser.runtime.onMessage.addListener(updateIFrame)

function createIFrame(url) {
    document.body.innerHTML = ''
    document.body.style.backgroundColor = '#eee'
    let responsiveDocument = document.createElement('iframe')
    responsiveDocument.setAttribute('id', 'responsify')
    responsiveDocument.src = url
    responsiveDocument.style.display = 'block';
    responsiveDocument.style.margin = 'auto';
    responsiveDocument.style.border = 0;
    responsiveDocument.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)'
    document.body.appendChild(responsiveDocument)
}

function updateIFrame(request) {
    if(request.iFrameSettings.initiate) {
        createIFrame(request.iFrameSettings.url)
    }

    let responsify = document.querySelector('#responsify')
    if(responsify === null) {
        createIFrame(request.iFrameSettings.url)
    }

    responsify = document.querySelector('#responsify')
    responsify.width = parseInt(request.iFrameSettings.width)
    responsify.height = parseInt(request.iFrameSettings.height)
}
