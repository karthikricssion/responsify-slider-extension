// Save value to localStorage
function saveLocal(tabId, data) {
    let contentToStore = {}
    contentToStore[tabId] = data
    browser.storage.local.set(contentToStore)
}

// Check and save iFrameSetting and send it to web page
function checkAndSendMessage(tabId, isSaved, activeTabInfo, initiate, showRangeValue) {
    let iFrameSettings = {}
    iFrameSettings['title'] = activeTabInfo.title
    iFrameSettings['url'] = activeTabInfo.url
    iFrameSettings['width'] = parseInt(activeTabInfo.width)
    iFrameSettings['height'] = parseInt(activeTabInfo.height)
    iFrameSettings['initiate'] = initiate

    // Check and save if data not exsist
    if(!isSaved) {
        saveLocal(tabId, iFrameSettings)
    }

    // Send data to content script to update DOM changes
    browser.tabs.sendMessage(tabId, {iFrameSettings}).then(() => {
        showRangeValue.textContent = activeTabInfo.width
        console.log(`Message recieved successfully`)
    }, (e) => {
        console.log(`Error sending message: ${e}`)
    })
}

// Check and execute content_script to access web page DOM elements
browser.tabs.executeScript({file: "/content_scripts/responsify.js"})
.then(() => {
    let rangeInput = document.querySelector('#points');
    let showRangeValue = document.querySelector('#showRange');

    // Set default value for range MIN and Max
    rangeInput.min = 320
    rangeInput.max = 400

    // Get in-depth infromation about the active tab
    browser.tabs.query({
        active: true,
        currentWindow: true
    }).then((activeTabInfo) => {
        let tabId = activeTabInfo[0].id
        let cloneActiveTabInfo = { ...activeTabInfo[0] }
        rangeInput.value = showRangeValue.textContent = rangeInput.max = activeTabInfo[0].width
        
        // Clear browser local - For development purpose
        // browser.storage.local.clear()

        // Check and GET active tab stored iFrame Settings
        browser.storage.local.get().then((saveIFrameInfo) => {
            if(saveIFrameInfo.hasOwnProperty(activeTabInfo[0].id)) {
                cloneActiveTabInfo.width = rangeInput.value = saveIFrameInfo[activeTabInfo[0].id].width
                // activeTabInfo[0].height = saveIFrameInfo[activeTabInfo[0].height]
                checkAndSendMessage(tabId, false, cloneActiveTabInfo, true, showRangeValue)
            } else {
                checkAndSendMessage(tabId, true, cloneActiveTabInfo, false, showRangeValue)
            }

            // Listening to range onChange event and updating to view
            rangeInput.addEventListener('input', (e) => {
                // Update activeTab width to changed value
                cloneActiveTabInfo.width = rangeInput.value = e.target.value
                checkAndSendMessage(tabId, false, cloneActiveTabInfo, false, showRangeValue)
            })

            return Promise.resolve()
        }, (e) => {
            console.log(`Error getting saveIFrameInfo`, e)
            return Promise.reject()
        })

    }, (e) => {
        console.log(`Error getting in-depth information about active tab: ${e}`)
    })

    console.log('Content script connected successfully!');
}).catch((error) => {
    console.error(`Error in executing the script: ${error}`);
})
