function main() {
    myCanvas.width = window.innerWidth;
    myCanvas.height = window.innerHeight;

    const pumpkin = new Pumpkin(
        myCanvas.width/2,
        myCanvas.height/2,
        Math.min(myCanvas.width, myCanvas.height)*0.5
    )
    pumpkin.draw(myCanvas.getContext("2d"));
}