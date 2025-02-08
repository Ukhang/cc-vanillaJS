class Microphone {
    constructor() {
      this.initialized = false;
      this.volume = 0;
  
      // Attempt to access the microphone using the Web Audio API
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
  
            this.microphoneSource = this.audioContext.createMediaStreamSource(stream);
            this.microphoneSource.connect(this.analyser);
  
            this.initialized = true;
          })
          .catch((err) => {
            console.error("Microphone initialization failed:", err);
          });
      }
    }
  
    // Method to get the microphone volume
    getVolume() {
      if (this.initialized) {
        this.analyser.getByteFrequencyData(this.dataArray);
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
          sum += this.dataArray[i];
        }
        this.volume = sum / this.dataArray.length;
      }
  
      // Scale down the volume even further to make the mouth smaller
      return this.volume * 0.05; // Further reduce the scaling factor for a smaller mouth
    }
  }
  