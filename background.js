const API_KEY = "YOUR_YOUTUBE_API_KEY";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "FETCH_COMMENTS") {
    fetchComments(msg.videoId);
  }
});

async function fetchComments(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/commentThreads
    ?part=snippet
    &videoId=${videoId}
    &maxResults=50
    &key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const comments = data.items.map(item =>
      item.snippet.topLevelComment.snippet.textDisplay
    );

    console.log("💬 Comments:", comments);
  } catch (err) {
    console.error("Error fetching comments", err);
  }
}
