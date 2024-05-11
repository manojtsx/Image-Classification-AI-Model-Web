// More API functions here:
      // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

      // the link to your model provided by Teachable Machine export panel
      const URL = "https://teachablemachine.withgoogle.com/models/Lm6zCseUD/";

      let model, webcam, labelContainer, maxPredictions;

      let webcamContainer = document.getElementById("webcam-container");
      labelContainer = document.getElementById("label-container");
      // Load the image model and setup the webcam
      async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        webcamContainer.innerHTML = "";
        webcamContainer.appendChild(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
          // and class labels
          labelContainer.appendChild(document.createElement("div"));
        }
      }

      // close or open  the webcam
      let button = document.getElementById("btn1");
      button.addEventListener("click", () => {
        console.log("Hello");
        if (button.innerText === "Start") {
          init();
          button.innerHTML = "Stop";
        } else {
          webcam.stop();
          webcamContainer.innerHTML = "";
          button.innerHTML = "Start";
        }
      });

      async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
      }

      // run the webcam image through the image model
      async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        let maxProbability = -1;
        let predictedClass = "";
        for (let i = 0; i < maxPredictions; i++) {
          if (prediction[i].probability > maxProbability) {
            maxProbability = prediction[i].probability;
            predictedClass = prediction[i].className;
          }
          const classPrediction = predictedClass;
          labelContainer.innerHTML = classPrediction;
        }
      }