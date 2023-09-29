const getDummyPromise = () => {
    return new Promise((r) => {
        setTimeout(() => {r()}, 300)
    })
}
async function extractFramesFromVideo(videoUrl, fps=25) {
    return new Promise(async (resolve) => {

        // fully download it first (no buffering):
        let videoBlob = await fetch(videoUrl).then(r => r.blob());
        let videoObjectUrl = URL.createObjectURL(videoBlob);
        let video = document.createElement("video");


        let seekResolve;
        video.addEventListener('seeked', async function() {
            setTimeout(() => {
                if(seekResolve) seekResolve();
            }, 400)
        });

        video.addEventListener('loadeddata', async function() {

            let [w, h] = [video.videoWidth, video.videoHeight]


            let interval = 1 / fps;
            let currentTime = 0;
            let duration = video.duration;
            let index = 1

            while(currentTime < duration) {
                video.currentTime = currentTime;
                await new Promise(r => seekResolve=r);
                const a = document.createElement("a");
                let canvas = document.createElement('canvas');
                canvas.width =  w;
                canvas.height = h;
                let context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, w, h);
                let base64ImageData = canvas.toDataURL();
                a.href = base64ImageData;
                a.download = `ezgif-frame-${index.toString().padStart(3, '0')}.png`;
                a.click();
                index++

                currentTime += interval;
                await getDummyPromise()
            }
        });

        // set video src *after* listening to events in case it loads so fast
        // that the events occur before we were listening.
        video.src = videoObjectUrl;

    });
}

extractFramesFromVideo('http://localhost:3000/2.webm')