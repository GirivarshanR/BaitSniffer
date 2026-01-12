document.addEventListener("DOMContentLoaded", () => {
  const tgbtn = document.getElementById("tg");

  function render(modeValue) {
    if (modeValue === 0) {
      tgbtn.classList.add("on");
      tgbtn.textContent = "Start";
    } else {
      tgbtn.classList.remove("on");
      tgbtn.textContent = "Stop";
    }
  }

  chrome.storage.local.get(["modeValue"], (res) => {
    render(res.modeValue ?? 1);
  });

  tgbtn.addEventListener("click", () => {
    chrome.storage.local.get(["modeValue"], (res) => {
      const next = (res.modeValue ?? 1) === 0 ? 1 : 0;
      chrome.storage.local.set({ modeValue: next }, () => {
        render(next);
      });
    });
  });
});
