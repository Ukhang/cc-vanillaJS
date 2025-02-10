function main() {
  myCanvas.width = window.innerWidth;
  myCanvas.height = window.innerHeight;

  const pumpkin = new Pumpkin(
    myCanvas.width / 2,
    myCanvas.height / 2,
    Math.min(myCanvas.width, myCanvas.height) * 0.5
  );

  const microphone = new Microphone(8192);

  setInterval(function () {
    if (microphone.initialized) {
      const openness = microphone.getVolume() * 1;
      myCanvas
        .getContext("2d")
        .clearRect(0, 0, myCanvas.width, myCanvas.height);
      pumpkin.draw(myCanvas.getContext("2d"), openness);
    }
  }, 100);
}
