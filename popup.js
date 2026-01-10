<<<<<<< HEAD
const psBtn = document.getElementById("ps");

let isRunning = true; // because button initially shows "Pause"

psBtn.addEventListener("click", () => {
  if (isRunning) {
    psBtn.innerText = "Start ▶";
  } else {
    psBtn.innerText = "Pause ⏸";
  }

  isRunning = !isRunning;
});
=======
const tgbtn = document.getElementById('tg');
tgbtn.addEventListener("click", (event) => {
    event.target.classList.toggle("on");
});    
>>>>>>> 9a0a54aafe7de7bbe3c469dc47ac85896d22a2b0
