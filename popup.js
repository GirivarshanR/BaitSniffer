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
