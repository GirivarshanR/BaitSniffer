let hoveredVideoURL = null;

document.addEventListener("mouseover", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href || !href.startsWith("/watch")) return;

  hoveredVideoURL = new URL(href, location.origin).href;

  chrome.runtime.sendMessage({
    type: "HOVERED_VIDEO_URL",
    url: hoveredVideoURL
  });
});
