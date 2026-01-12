console.log("BaitSniffer content.js loaded");

let tooltip = null;
let activeLink = null;
let activeVideoURL = null;
let modeValue = 1; // OFF by default

// Load initial state
chrome.storage.local.get(["modeValue"], (res) => {
  modeValue = res.modeValue ?? 1;
});

// Listen for toggle changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.modeValue) {
    modeValue = changes.modeValue.newValue;
    if (modeValue === 1) removeTooltip();
  }
});

function getExactYouTubeURL(href) {
  if (href.startsWith("/watch")) {
    const url = new URL(href, location.origin);
    const id = url.searchParams.get("v");
    return id ? `https://www.youtube.com/watch?v=${id}` : null;
  }

  if (href.startsWith("/shorts/")) {
    const id = href.split("/shorts/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/watch?v=${id}` : null;
  }

  return null;
}

function extractVideoId(url) {
  try {
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
}

function createTooltip(text) {
  tooltip = document.createElement("div");
  tooltip.textContent = text;

  Object.assign(tooltip.style, {
    position: "fixed",
    background: "rgba(0,0,0,0.85)",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontFamily: "monospace",
    zIndex: "999999",
    pointerEvents: "none"
  });

  document.body.appendChild(tooltip);
}

function removeTooltip() {
  tooltip?.remove();
  tooltip = null;
  activeLink = null;
  activeVideoURL = null;
}

// ✅ SAFE MESSAGE SENDER
function safeSendMessage(message) {
  try {
    chrome.runtime.sendMessage(message);
  } catch (err) {
    console.warn("⚠️ Extension context invalidated. Stopping listener.");
    document.removeEventListener("mouseover", handleHover);
  }
}

// ✅ SINGLE HOVER HANDLER
function handleHover(e) {
  if (modeValue !== 0) return;

  const a = e.target.closest("a");
  if (!a) return;

  const exactURL = getExactYouTubeURL(a.getAttribute("href") || "");
  if (!exactURL || exactURL === activeVideoURL) return;

  activeLink = a;
  activeVideoURL = exactURL;

  removeTooltip();
  createTooltip(exactURL);

  const videoId = extractVideoId(exactURL);
  if (!videoId) return;

  console.log("🎯 Hovered video:", videoId);

  safeSendMessage({
    type: "FETCH_COMMENTS",
    videoId
  });
}

// Attach listener
document.addEventListener("mouseover", handleHover);

// Tooltip follow mouse
document.addEventListener("mousemove", (e) => {
  if (!tooltip) return;
  tooltip.style.left = e.clientX + 12 + "px";
  tooltip.style.top = e.clientY + 12 + "px";
});

// Remove tooltip when leaving link
document.addEventListener("mouseout", (e) => {
  if (!activeLink) return;
  if (!e.relatedTarget || !e.relatedTarget.closest("a")) {
    removeTooltip();
  }
});
