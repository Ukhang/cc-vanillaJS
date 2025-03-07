// backArrow functionality
document.getElementById("backArrow").addEventListener("click", function () {
  if (document.referrer === "") {
    // If no referrer, redirect to index.html
    window.location.href = "index.html";
  } else {
    // Go back to the previous page in history
    window.history.back();
  }
});
