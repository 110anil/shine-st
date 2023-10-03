import ImageKit from "imagekit-javascript";
import {runBatch} from "@/utils/runBatch";

let imageKit

// const publicKey = "public_OhjxwkIeAE/RJZt2J3fCav5kl4I="
// const urlEndpoint = "https://ik.imagekit.io/shinest"

const account1 = {
    publicKey: "public_/ByX9Tb7/wjtatzTatuaH9115Zw=",
    urlEndpoint: "https://ik.imagekit.io/shine110/"
}

const account2 = {
    publicKey: "public_C1W/B5zH1/q3WAGB0aZRedTqKxU=",
    urlEndpoint: "https://ik.imagekit.io/shine111/"
}

const account3 = {
    publicKey: "public_LUrXWc5fS0ssZQ5TtB3cXOBzg7k=",
    urlEndpoint: "https://ik.imagekit.io/110anil/"
}

const account4 = {
    publicKey: "public_S0w+m0H8pj2hcT6lp9tP9+8Me78=",
    urlEndpoint: "https://ik.imagekit.io/smile110/"
}

const account5 = {
    publicKey: "public_rfcRd0HCp2TfvtrNW5EqPkQ23Mg=",
    urlEndpoint: "https://ik.imagekit.io/110smile/"
}

const map = [account1, account2, account3, account4, account5]

// const temp = {publicKey, urlEndpoint}
// const accounts = [temp, temp, temp, temp, temp]

const getImageKit = function (pin) {
    let index = 0
    if (pin) {
        pin = pin.replace('/', '')
        index = parseInt(pin, 36) % 5
    }
    let obj = map[index]

    if (!obj.imageKit) {
        obj.imageKit = imageKit = new ImageKit({
            publicKey : obj.publicKey,
            urlEndpoint : obj.urlEndpoint,
            authenticationEndpoint : `${window.location.origin}/api/get-creds/${encodeURIComponent(pin)}`
        })
    }
    return obj.imageKit
}

const compress = ({objectUrl, file, timestamp, key, ext}, quality = 0.9) => {
    if (file.type && file.type.includes('image/') && !file.type.includes('gif') && quality > 0) {
        return new Promise((r) => {
            const img = new Image()
            img.onload = async function () {
                const {height, width} = this
                let canvas = document.createElement('canvas');
                canvas.width =  width;
                canvas.height = height;
                let context = canvas.getContext('2d');
                context.drawImage(img, 0, 0, width, height);
                const blob = await new Promise((resolve) =>
                    canvas.toBlob(resolve, 'image/webp', quality)
                );
                const f = new File([blob], `${key}${ext}`, { type: "image/webp" })
                r(f.size >= file.size ? file : f)
            }
            img.src = objectUrl
        })
    } else {
        return Promise.resolve(file)
    }

}

export function upload(files, {tags = [], pin, quality}) {
    pin = pin.toLowerCase()
    const timestamp = '.' + (new Date()).getTime()
    return runBatch(files.map((f) => {
        const {ext, key, newTags = []} = f
        return () => {
            return compress(f, quality).then(file => getImageKit(pin).upload({
                file,
                tags: newTags.length ? newTags : (tags.length ? tags : undefined),
                folder: `/data1/${pin}/`,
                useUniqueFileName: false,
                fileName: `${key}${timestamp}${ext}`
            }))
        }
    }))
}