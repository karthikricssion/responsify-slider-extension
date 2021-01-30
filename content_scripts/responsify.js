// (function() {
//     if (window.hasRun) {
//         return;
//     }
//     window.hasRun = true;

//     function saveLocal(tabId, data) {
//         contentToStore = {}
//         contentToStore[tabId] = data
//         browser.storage.local.set(contentToStore)
//     }

//     browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//         console.log(sender, sendResponse)

//         if(message.type === 'message') {
//             if(message.initiate) {
                
//                 document.body.innerHTML = ''
//                 document.body.style.backgroundColor = '#eee'
    
//                 var responsiveDocument = document.createElement('iframe')
//                 responsiveDocument.setAttribute('id', 'responsify')
//                 responsiveDocument.src = message.iFrameSettings.url
//                 responsiveDocument.style.display = 'block';
//                 responsiveDocument.style.margin = 'auto';
//                 responsiveDocument.style.border = 0;
//                 responsiveDocument.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)'
//                 document.body.appendChild(responsiveDocument)
//             }
    
//             var responsify = document.querySelector('#responsify')
//             responsify.width = parseInt(message.iFrameSettings.width)
//             responsify.height = parseInt(message.iFrameSettings.height)

//             saveLocal(message.tabId, iFrameSettings)
//         } else if( message.type === 'testing') {
//             console.table(message)
//         }

//         return Promise.resolve({
//             response: 'Hi from recieving end!'
//         })
//     }, (e) => {
//         return Promise.reject({
//             response: 'Error in recieving end!'
//         })
//     });
// })();

// (function() {
//     if (window.hasRun) {
//         return;
//     }
//     window.hasRun = true;

    
// })();

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
