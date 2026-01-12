let tooltip = null;
let activeLink = null;
let activeVideoURL = null;
let enabled = true; // can be controlled via chrome.storage later

// Extract exact YouTube watch URL (videos + shorts)
function getExactYouTubeURL(href) {
  // /watch?v=VIDEO_ID
  if (href.startsWith("/watch")) {
    const url = new URL(href, location.origin);
    const videoId = url.searchParams.get("v");
    if (!videoId) return null;
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  // /shorts/VIDEO_ID
  if (href.startsWith("/shorts/")) {
    const videoId = href.split("/shorts/")[1]?.split("?")[0];
    if (!videoId) return null;
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  return null;
}

// Create tooltip
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
    pointerEvents: "none",
    maxWidth: "420px",
    wordBreak: "break-all"
  });

  document.body.appendChild(tooltip);
}

// Remove tooltip and reset state
function removeTooltip() {
  tooltip?.remove();
  tooltip = null;
  activeLink = null;
  activeVideoURL = null;
}

// Handle hover
document.addEventListener("mouseover", (event) => {
  if (!enabled) return;

  const a = event.target.closest("a");
  if (!a) return;

  const href = a.getAttribute("href");
  if (!href) return;

  const exactURL = getExactYouTubeURL(href);
  if (!exactURL) return;

  // 🚫 Prevent multiple tooltip creation for same video
  if (exactURL === activeVideoURL) return;

  activeLink = a;
  activeVideoURL = exactURL;

  removeTooltip();
  createTooltip(exactURL);
});

// Move tooltip with mouse
document.addEventListener("mousemove", (event) => {
  if (!tooltip) return;

  tooltip.style.left = event.clientX + 12 + "px";
  tooltip.style.top = event.clientY + 12 + "px";
});

// Remove tooltip when leaving the video link
document.addEventListener("mouseout", (event) => {
  if (!activeLink) return;

  if (!event.relatedTarget || !event.relatedTarget.closest("a")) {
    removeTooltip();
  }
});
