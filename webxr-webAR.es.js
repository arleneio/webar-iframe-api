const s = {
  arleneStateCallbacks: [],
  arlenePersistentStateCallbacks: [],
  lastPersistentState: void 0,
  arleneInstanceId: Math.round(Math.random() * Math.pow(10, 15)),
  sendMessage: (n) => {
    n.instanceId = s.arleneInstanceId, delete n.idReferrer, window.top.postMessage({
      sender: "arleneIframe",
      message: n
    }, "*");
  }
}, r = {
  iFrames: [],
  sendMessage: (n) => {
    const e = n.idReferrer;
    n.instanceId = s.arleneInstanceId;
    let a;
    if (e)
      a = r.iFrames.find((t) => t.dataset.regId === e);
    else {
      if (r.iFrames.length === 0)
        throw "Can't call window.arleneFrame since you have no webXR iFrames registered";
      if (r.iFrames.length > 1)
        throw "Can't call window.arleneFrame directly if you have more than one webXR iFrame";
      a = r.iFrames[0];
    }
    a.contentWindow.postMessage({
      sender: "arleneChildIframe",
      message: n
    }, "*");
  }
};
function i() {
  function n(e, a) {
    return e.arleneStateCallbacks = [], e.arlenePersistentStateCallbacks = [], e.changeModel = (t, d) => {
      e.sendMessage({ command: "changeModel", params: t, value: d, idReferrer: a });
    }, e;
  }
  n(s), n(r), window.onmessage = function(e) {
    try {
      if (e.data.sender === "arleneEmbeddedIframe" && e.data.message.command === "registerChildIframe") {
        const t = Array.from(document.getElementsByTagName("iframe")).find((d) => d.src === e.data.src && d.dataset.regId === void 0);
        t.dataset.regId = e.data.arleneInstanceId, t.webxrWebAR = {
          child: n({ sendMessage: r.sendMessage }, t.dataset.regId)
        }, r.iFrames.push(t);
        return;
      }
      if (e.data.sender === "arlene" && e.data.instanceId === s.arleneInstanceId) {
        let a = e.data.message;
        if (a.command === "refreshState")
          for (let t of s.arleneStateCallbacks)
            t(s, a.state);
        if (a.command === "refreshPersistentState") {
          s.lastPersistentState = a.persistentState;
          for (let t of s.arlenePersistentStateCallbacks)
            t(s, a.persistentState);
        }
        a.command === "isAudioPlaying" && s.tempAudioCallback(a.isAudioPlaying);
      }
    } catch (a) {
      console.error(a);
    }
  }, s.sendMessage({ command: "affiliateIframe" });
}
i();
window.webxrWebAR = {
  parent: s,
  child: r
};
export {
  r as child,
  s as parent
};
