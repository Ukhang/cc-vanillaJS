document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const brushSize = document.getElementById("brushSize");
  const sizeValue = document.getElementById("sizeValue");
  const eraserBtn = document.getElementById("eraser");
  const penBtn = document.getElementById("pen");
  const clearBtn = document.getElementById("clear");
  const saveBtn = document.getElementById("save");
  const colorOptions = document.querySelectorAll(".color-option");

  let isDrawing = false;
  let currentColor = "#000000";
  let lastX = 0;
  let lastY = 0;
  let isEraser = false;

  // Set initial canvas background to white
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update brush size display
  brushSize.addEventListener("input", function () {
    sizeValue.textContent = `${this.value}px`;
  });

  // Color selection
  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      currentColor = this.getAttribute("data-color");
      document.querySelector(".color-option.active").classList.remove("active");
      this.classList.add("active");
      isEraser = false;
    });
  });

  // Eraser mode
  eraserBtn.addEventListener("click", function () {
    isEraser = true;
  });

  // Pen mode
  penBtn.addEventListener("click", function () {
    isEraser = false;
  });

  // Clear canvas - Fixed to work without confirmation
  clearBtn.addEventListener("click", function () {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  // Save drawing
  saveBtn.addEventListener("click", function () {
    const link = document.createElement("a");
    link.download = "my-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // Drawing functionality
  function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
  }

  function draw(e) {
    if (!isDrawing) return;

    const [currentX, currentY] = getCoordinates(e);

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = brushSize.value;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);

    if (isEraser) {
      ctx.strokeStyle = "white";
    } else {
      ctx.strokeStyle = currentColor;
    }

    ctx.stroke();

    [lastX, lastY] = [currentX, currentY];
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.type.includes("touch")
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;
    const y = e.type.includes("touch")
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;
    return [x, y];
  }

  // Event listeners for mouse
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  // Event listeners for touch devices
  canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    startDrawing(e);
  });
  canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    draw(e);
  });
  canvas.addEventListener("touchend", stopDrawing);

  // Prevent scrolling when touching the canvas
  canvas.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
    },
    { passive: false },
  );
  canvas.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false },
  );
});
