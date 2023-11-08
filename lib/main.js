// Call parent
const parent = {
    arleneStateCallbacks: [],
    arlenePersistentStateCallbacks: [],
    lastPersistentState: undefined,
    
    arleneInstanceId: Math.round(Math.random()*Math.pow(10,15)),
    
    sendMessage: (obj) => {
        obj.instanceId = parent.arleneInstanceId;
        
        //Message that go to a parent experience does not have idReferrer since that attribute 
        //i used only for comunication with children
        delete obj.idReferrer;

        window.top.postMessage({
            sender: 'arleneIframe',
            message: obj
        }, '*')
    }   
}

// Call child
const child = {
    iFrames:[],
    sendMessage: (obj) => {
        const idReferrer = obj.idReferrer;

        obj.instanceId = parent.arleneInstanceId;
        
        let selectedIframe;

        //If no idReferrer is received so the called was made directly from window.arleneFrame
        //So if there is more than one iFrame it throws an error
        if(!idReferrer) {
            if(child.iFrames.length===0) {
                throw(`Can't call window.arleneFrame since you have no webXR iFrames registered`);
            }
            if(child.iFrames.length>1) {
                throw(`Can't call window.arleneFrame directly if you have more than one webXR iFrame`);                
            }
            selectedIframe = child.iFrames[0];
        }
        else {
            selectedIframe = child.iFrames.find(crt => crt.dataset.regId === idReferrer)
        }

        selectedIframe.contentWindow.postMessage({
            sender: 'arleneChildIframe',
            message: obj
        }, '*')
    }   
}


function arleneInit() {
    function generateArleneFunctions(arleneObj, idReferrer) {

        arleneObj.arleneStateCallbacks =  []
        arleneObj.arlenePersistentStateCallbacks = []

        arleneObj.changeModel = (params,value) => {
            arleneObj.sendMessage({command:'changeModel',params,value,idReferrer})
        }

        return arleneObj;
    }
    
    generateArleneFunctions(parent);
    generateArleneFunctions(child);

    window.onmessage = function(e) {
        try {
            //if the message comes from arleneEmbeddedIframe it means that this js script is loaded in a 
            //page that is embedding a WebAR experience in an inner iframe
            if(e.data.sender === 'arleneEmbeddedIframe') {
                let message = e.data.message

                if(message.command==='registerChildIframe') {
                    const childIframe = Array.from(document.getElementsByTagName('iframe')).find(crt => crt.src===e.data.src && crt.dataset.regId===undefined)
    
                    childIframe.dataset.regId = e.data.arleneInstanceId;

                    childIframe.webxrWebAR =  {
                        child: generateArleneFunctions({sendMessage: child.sendMessage},childIframe.dataset.regId)
                    }
    
                    child.iFrames.push(childIframe);
                    return;
                }

               // const childIframe = Array.from(document.getElementsByTagName('iframe')).find(crt => crt.dataset.regId===''+e.data.arleneInstanceId)
            }

            if(e.data.sender === 'arlene' && e.data.instanceId === parent.arleneInstanceId) {
                let message = e.data.message
                
                if(message.command==='refreshState') {
                    for(let crtCallback of parent.arleneStateCallbacks) {
                        crtCallback(parent,message.state)
                    }
                }
                
                if(message.command==='refreshPersistentState') {
                    parent.lastPersistentState = message.persistentState
                    for(let crtCallback of parent.arlenePersistentStateCallbacks) {
                        crtCallback(parent,message.persistentState)
                    }
                }

                if(message.command==='isAudioPlaying') {
                    parent.tempAudioCallback(message.isAudioPlaying)
                }
            }
        }
        catch(e) {
            console.error(e)
        }
    }

    parent.sendMessage({command:'affiliateIframe'})
}

arleneInit()

window.webxrWebAR = {
    parent,
    child
}

export {
    parent,
    child
}