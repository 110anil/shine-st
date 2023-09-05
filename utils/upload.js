import ImageKit from "imagekit-javascript";
import {runBatch} from "@/utils/runBatch";

let imageKit

const getImageKit = function () {
    if (!imageKit) {
        imageKit = new ImageKit({
            publicKey : "public_OhjxwkIeAE/RJZt2J3fCav5kl4I=",
            urlEndpoint : "https://ik.imagekit.io/shinest",
            authenticationEndpoint : `${window.location.origin}/api/get-creds`
        })
    }
    return imageKit
}

export function upload(files, {title, pin}) {
    return runBatch(files.map(({file, ext, key, newTags = []}) => {
        return () => getImageKit().upload({
            file,
            tags: newTags.length ? newTags : (title ? [title] : undefined),
            folder: `/data1/${pin}/`,
            useUniqueFileName: false,
            fileName: `${key}${ext}`
        })
    }))
}