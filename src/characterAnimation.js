function main() {
    myCanvas.width = window.innerWidth;
    myCanvas.height = window.innerHeight;

    const pumpkin = new Pumpkin(
        myCanvas.width/2,
        myCanvas.height/2,
        Math.min(myCanvas.width, myCanvas.height)*0.5
    )

    let frameCount = 0;
    setInterval(function() {
        frameCount++;
        const openness = (Math.sin(frameCount/5)+1)/2;
        myCanvas.getContext("2d")
            .clearRect(0, 0, myCanvas.width, myCanvas.height);
        pumpkin.draw(myCanvas.getContext("2d"), openness);
    }, 100);
}