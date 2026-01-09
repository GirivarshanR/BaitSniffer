chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "HOVERED_VIDEO_URL") {
    document.getElementById("url").textContent = msg.url;
  }
});
