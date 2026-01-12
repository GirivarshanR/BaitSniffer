document.addEventListener("DOMContentLoaded", () => {
  const tgbtn = document.getElementById("tg");

  function render(value) {
    if (value === 1) {
      tgbtn.classList.add("on");
      tgbtn.textContent = "Start";
    } else {
      tgbtn.classList.remove("on");
      tgbtn.textContent = "Stop";
    }
  }
  chrome.storage.local.get(["clickedValue"], (result) => {
    const value = result.clickedValue ?? 0;
    render(value);
  });

  tgbtn.addEventListener("click", () => {
    chrome.storage.local.get(["clickedValue"], (result) => {
      let clickedValue = result.clickedValue ?? 0;
      clickedValue = clickedValue === 0 ? 1 : 0;

      chrome.storage.local.set({ clickedValue }, () => {
        render(clickedValue);
      });
    });
  });
});






