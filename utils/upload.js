import ImageKit from "imagekit-javascript";
import {runBatch} from "@/utils/runBatch";

let imageKit

const publicKey = "public_OhjxwkIeAE/RJZt2J3fCav5kl4I="
const urlEndpoint = "https://ik.imagekit.io/shinest"

const temp = {publicKey, urlEndpoint}
const map = [temp, temp, temp, temp, temp]

const getImageKit = function (pin) {
    let index = 0
    if (pin) {
        index = parseInt(pin, 36) % 5
    }
    let obj = map[index]

    if (!obj.imageKit) {
        obj.imageKit = imageKit = new ImageKit({
            publicKey : obj.publicKey,
            urlEndpoint : obj.urlEndpoint,
            authenticationEndpoint : `${window.location.origin}/api/get-creds/${pin}`
        })
    }
    return obj.imageKit
}

export function upload(files, {title, pin}) {
    pin = pin.toLowerCase()
    return runBatch(files.map(({file, ext, key, newTags = []}) => {
        return () => getImageKit(pin).upload({
            file,
            tags: newTags.length ? newTags : (title ? [title] : undefined),
            folder: `/data1/${pin}/`,
            useUniqueFileName: false,
            fileName: `${key}${ext}`
        })
    }))
}