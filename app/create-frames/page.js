'use client'
import styles from './frames.module.css'
import {useEffect, useState} from "react";
const getDummyPromise = () => {
    return new Promise((r) => {
        setTimeout(() => {r()}, 300)
    })
}
async function extractFramesFromVideo(file, fps=25, filename, quality = 0.8) {

        // fully download it first (no buffering):
        let videoObjectUrl = URL.createObjectURL(file);
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
                const blob = await new Promise((resolve) =>
                    canvas.toBlob(resolve, 'image/webp', quality)
                );
                a.href = URL.createObjectURL(blob);
                a.download = `${filename}-${index.toString().padStart(3, '0')}.webp`;
                a.click();
                index++

                currentTime += interval;
                await getDummyPromise()
            }
        });

        // set video src *after* listening to events in case it loads so fast
        // that the events occur before we were listening.
        video.src = videoObjectUrl;

}

export default function AdminPage () {
    const [fps, setFps] = useState('25')
    const [filename, setFile] = useState('')
    const [quality, setQuality] = useState('0.9')
    useEffect(() => {
        setFile('frames-' + (new Date).getTime().toString(36))
    }, [])
    const onChange = (e) => {
        const file = e.target.files[0]
        extractFramesFromVideo(file, parseInt(fps), filename, parseFloat(quality))
    }
   return (
       <div className={styles.cont}>
           <h2>Create frames for scroll controlled video</h2>
           <h3>Read below to understand how to do this:</h3>
           <ul>
               <li>(Optional): remove background from the video using: https://www.media.io/remove-video-background-online.html</li>
               <li>Enter `File Name prefix`: Your image files will be downloaded with names prefixed with this value</li>
               <li>Enter 'Frames per second' i.e. how many frames you want per second to be created</li>
               <li>Enter `Quality` of image a number between 0 to 1. 0 means low quality, 1 means highest. High quality means file size will be larger. ideally 0.9 should be a good quality.</li>
               <li>upload the video and the images will start downloading one by one. Enable "allow multiple downloads" in your browser</li>
           </ul>
           <input placeholder={'File name prefix'} value={filename} onChange={(e) => setFile(e.target.value) }/>
           <input placeholder={'Frames per second'} value={fps} onChange={(e) => setFps(e.target.value) }/>
           <input placeholder={'Quality (Range: 0-1)'} value={quality} onChange={(e) => setQuality(e.target.value) }/>
           <input placeholder={'Select file'} type='file' accept='video/*' onChange={onChange} />
       </div>
   )
}