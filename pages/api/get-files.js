import ImageKit from 'imagekit'
import crypto from 'crypto'
const endpoint = "https://ik.imagekit.io/shinest/"
const privateKey = process.env.TEMP_KEY;
const publicKey = "public_OhjxwkIeAE/RJZt2J3fCav5kl4I=";
import {runBatch} from "@/utils/runBatch";
const account1 = {
    email: "smilegarg110@gmail.com",
    publicKey: "public_/ByX9Tb7/wjtatzTatuaH9115Zw=",
    privateKey: process.env.ACCOUNT1_KEY,
    urlEndpoint: "https://ik.imagekit.io/shine110/"
}

const account2 = {
    email: "shinegarg111@gmail.com",
    publicKey: "public_C1W/B5zH1/q3WAGB0aZRedTqKxU=",
    privateKey: process.env.ACCOUNT2_KEY,
    urlEndpoint: "https://ik.imagekit.io/shine111/"
}

const account3 = {
    email: "110anilgarg@gmail.com",
    publicKey: "public_LUrXWc5fS0ssZQ5TtB3cXOBzg7k=",
    privateKey: process.env.ACCOUNT3_KEY,
    urlEndpoint: "https://ik.imagekit.io/110anil/"
}

const account4 = {
    email: "shinegarg110@gmail.com",
    publicKey: "public_S0w+m0H8pj2hcT6lp9tP9+8Me78=",
    privateKey: process.env.ACCOUNT4_KEY,
    urlEndpoint: "https://ik.imagekit.io/smile110/"
}

const account5 = {
    email: "smile@shinestudio.in",
    publicKey: "public_rfcRd0HCp2TfvtrNW5EqPkQ23Mg=",
    privateKey: process.env.ACCOUNT5_KEY,
    urlEndpoint: "https://ik.imagekit.io/110smile/"
}

const accounts = [account1, account2, account3, account4, account5]

const temp = {urlEndpoint: endpoint, privateKey, publicKey}
const imageKitMap = [temp, temp, temp, temp, temp]

const getImageKit = (pin) => {
    let index = 0
    if (pin) {
        index = parseInt(pin, 36) % 5
    }
    let obj = imageKitMap[index]
    if (!obj.imageKit) {
        obj.imageKit = new ImageKit({
            publicKey: obj.publicKey,
            privateKey: obj.privateKey,
            urlEndpoint: obj.urlEndpoint
        })
    }
    return obj
}

const initAll = () => {
    imageKitMap.forEach(obj => {
        if (!obj.imageKit) {
            obj.imageKit = new ImageKit({
                publicKey: obj.publicKey,
                privateKey: obj.privateKey,
                urlEndpoint: obj.urlEndpoint
            })
        }
    })
    return imageKitMap
}


export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}

const handle = (pin, meta) => {
    return new Promise((r, j) => {
        getImageKit(pin).imageKit.listFiles({
            path : `data1/${pin}`
        }, function(error, result) {
            if(error) {
                j({done: false, error})
                return
            }
            let imgs = []
            let song = result.find(x => x.url.includes('song'))
            if (song) {
                song = meta ? {url: song.url, id: song.fileId, tags: song.tags ? song.tags : []} : song.url
            }
            let normalFiles = result.filter(x => !(x.tags || []).includes('front') && !(x.tags || []).includes('back') && !x.url.includes('song'))
            const front = result.find(x => (x.tags || []).includes('front'))
            const back = result.find(x => (x.tags || []).includes('back'))

            normalFiles = normalFiles.sort((x, y) => {
                try {
                    let {groups: {key: xIndex}} = x.url.match(/(?<key>(\d+))(\.(?<hash>[a-zA-Z0-9]+)){0,1}\.(?<ext>[a-zA-Z0-9]+)$/) || {}
                    let {groups: {key: yIndex}} = y.url.match(/(?<key>(\d+))(\.(?<hash>[a-zA-Z0-9]+)){0,1}\.(?<ext>[a-zA-Z0-9]+)$/) || {}
                    xIndex = parseInt(xIndex)
                    yIndex = parseInt(yIndex)

                    return xIndex < yIndex ? -1 : 1
                } catch (e) {
                    return -1
                }
            })
            if (front) {
                imgs.push(front)
            }
            imgs = [...imgs, ...normalFiles]
            if (back) {
                imgs.push(back)
            }
            const [{width, height, tags} = {}] = imgs
            const t = (tags || []).filter(tag => !['front', 'back'].includes(tag))
            r({song, done: true, width, height, images: imgs.map(x => meta ? ({url: x.url, id: x.fileId, tags: x.tags ? x.tags : []}) : x.url), tags: t})
        })
    })
}

const handleData = (pin) => {
    return new Promise((r, j) => {
        getImageKit(pin).imageKit.listFiles({
            path : `data1/${pin}`
        }, function(error, normalFiles) {
            if(error) {
                j({done: false, error})
                return
            }

            normalFiles = normalFiles.sort((x, y) => {
                try {
                    let {groups: {key: xIndex}} = x.url.match(/(?<key>(\d+))(\.(?<hash>[a-zA-Z0-9]+)){0,1}\.(?<ext>[a-zA-Z0-9]+)$/) || {}
                    let {groups: {key: yIndex}} = y.url.match(/(?<key>(\d+))(\.(?<hash>[a-zA-Z0-9]+)){0,1}\.(?<ext>[a-zA-Z0-9]+)$/) || {}
                    xIndex = parseInt(xIndex)
                    yIndex = parseInt(yIndex)

                    return xIndex < yIndex ? -1 : 1
                } catch (e) {
                    return -1
                }
            })
            r(normalFiles.map(x => ({url: x.url, tags: x.tags})))
        })
    })
}

export async function getData(keys = ['topimages', 'servicethumbnails', 'scrollframes', 'featured', 'galleryimages', 'testimonials', 'bottomimages', 'logos']) {
    const data = await Promise.all(keys.map(key => handleData(key)))
    const finalData = data.reduce((res, item, index) => {
        res[keys[index]] = item
        return res
    }, {})

    if (finalData.logos) {
        const keys = ['whiteLogo', 'favicon32', 'favicon16', 'android512', 'android192', 'apple', 'mainLogo', 'icon']

        const logoMap = keys.reduce((res, key) => {
            const val = finalData.logos.find(x => (x.tags || []).includes(key))
            if (val) {
                res[key] = val.url
            }
            return res
        }, {})
        finalData.logoMap = logoMap
    }
    return finalData
}

export default function handler (req, res) {
    handle(req.body.pin.toLowerCase(), req.body.meta).then(x => res.status(200).json(x)).catch(x => res.status(500).json(x))
}

export function deleteFiles (req, res) {
    const {files, pin} = req.body
    getImageKit(pin.toLowerCase()).imageKit.bulkDeleteFiles(files.map(x => x.fileId))
        .then((response) => {
            res.status(200).json({done: true, response})
        })
        .catch(error => {
            res.status(500).json({done: false, error})
        });
}
export function changeTitle (req, res) {
    const {fileIds, tags = [], oldTags = [], pin} = req.body
    let promise = Promise.resolve()
    if (oldTags.length) {
        promise = getImageKit(pin.toLowerCase()).imageKit.bulkRemoveTags(fileIds, oldTags)
    }
    promise.then(() => getImageKit(pin.toLowerCase()).imageKit.bulkAddTags(fileIds, tags)).then(result => res.status(200).json({done: true, result})).catch(error => res.status(500).json({done: false, error}))
}
export function changeTags (req, res) {
    const {files, pin} = req.body
    return runBatch(files.map(f => {
        return () => getImageKit(pin.toLowerCase()).imageKit.updateFileDetails(f.fileId, {tags: f.newTags.length ? f.newTags : null})
    })).then(result => res.status(200).json({done: true, result})).catch(error => res.status(500).json({done: false, error}))

}
export function getCreds (req, res) {
    res.status(200).json(getImageKit(decodeURIComponent(req.query.pin).toLowerCase()).imageKit.getAuthenticationParameters())
}
export async function changePin  (req, res) {
    try {
        let {newPin, pin} = req.body
        newPin = newPin.trim().toLowerCase()
        pin = pin.trim().toLowerCase()
        if (!pin || !newPin) {
            throw new Error('Pin/New Pin Missing')
        }

        const folder = `/data1/${newPin}`
        const originalImageKit = getImageKit(pin)
        const newImageKit = getImageKit(newPin)
        const timestamp = '.' + (new Date()).getTime()

        const data = await handle(pin, true)
        const data1 = await handle(newPin, true)
        if (data1 && data1.images && data1.images.length) {
            throw new Error('Pin exists')
        }

        let files = data.images || []
        if (data.song) {
            files = [...files, data.song]
        }
        files = files.map(file => {
            const {url} = file
            let {groups: {key, ext}} = url.match(/(?<key>(\d+|song))(\.(?<hash>[a-zA-Z0-9_\-]+)){0,1}\.(?<ext>[a-zA-Z0-9]+)$/) || {}
            return {...file, key, ext}
        })

        const result = await runBatch(files.map(f => {
            return () => newImageKit.imageKit.upload({useUniqueFileName: false, fileName: `${f.key}${timestamp}.${f.ext}`, folder, file: f.url, tags: f.tags.length ? f.tags : null})
        }))

        const res2 = await originalImageKit.imageKit.bulkDeleteFiles(files.map(f => f.id))
        res.status(200).json({done: true, result})
    } catch (e) {
        res.status(500).json({done: false, error: e.message})
    }

}
export function renameFiles (req, res) {
    const {files, pin, hash} = req.body

    const rename = f => {
        return () => {
            let headers = new Headers();
            headers.set('Content-Type', 'application/json')
            headers.set('Authorization', 'Basic ' + Buffer.from(privateKey + ":" + "").toString('base64'))
            const imageKit = getImageKit(pin.toLowerCase())
            return fetch('https://api.imagekit.io/v1/files/rename', {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify({
                    "filePath" : '/' + f.url.replace(imageKit.urlEndpoint, ''),
                    "newFileName" : `${f.key}${hash}${f.ext}`,
                    "purgeCache": false
                })

            })
        }
    }

    return runBatch(files.map(rename)).then(response => res.status(200).json({done: true, response}))
}

export function findAlbum (req, res) {
    let title = req.body.title
    title = title.split(/( & | and | )/i)
    title = title.filter(x => x.length && !/(&|and| )/i.test(x)).map(x => x.charAt(0).toUpperCase() + x.slice(1))
    if (title.length > 1) {

        title = [title.join(' & '), title.reverse().join(' & ')]
    } else {
        title = [title.join(' & ')]
    }
    title = [...new Set([...title, ...title.map(x => x.toLowerCase()), ...title.map(x => x.toUpperCase())]
        .reduce((res, item) => {
            res = [...res, item, item.replace('&', 'and'), item.replace('&', 'And')]
            return res
        }, []))]
    const obj = {}
    return Promise.all(initAll().map(({imageKit}) => imageKit.listFiles({
        tags : [...title, req.body.title]
    }).then(result => {
        result.forEach((file) => {
            let {tags, filePath} = file
            const pin = filePath.replace(/\/data1\//, '').split('/')[0]
            if (!obj[pin]) {
                obj[pin] = tags[0]
            }
        })
    }))).then(() => {
        res.status(200).json({done: true, result: Object.keys(obj).map(pin => ({pin, title: obj[pin], url: `/albums/${pin}`}))})
    }).catch((error) => res.status(500).json({done: false, error}))
}

export function findServices (req, res) {
    const obj = {}
    return Promise.all(initAll().map(({imageKit}) => imageKit.listFiles({
        tags: ['service_tag']
    }).then(result => {
        result.forEach((file) => {
            let {tags, filePath} = file
            const {groups: {pin} = {}} = filePath.match(/\/data1\/services\/(?<pin>(.)+)\/.+\..+$/) || {}
            if (!obj[pin]) {
                obj[pin] = tags[1]
            }
        })
    }))).then(() => {
        res.status(200).json({done: true, result: Object.keys(obj).map(pin => ({key: pin, text: obj[pin], url: `/edit-services/${pin}`}))})
    }).catch((error) => res.status(500).json({done: false, error}))
}



const keys = {
    publicKey: '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCuWRg7+PmOgA2BrqODmM48MGh+\n' +
        'yqdvKCp7+jPR6TuFuE/OnF72dd+Zt8cOoOsNuX0zwptC/fJjIpajg6HO06LnweQ9\n' +
        'gKAl+oAjTKt3/dgrVEpie7QGrAK24H6aKS9jB9Cjf3w/uGBLWg7YmUw/ti0+pAws\n' +
        'aZhZQn+l9CyOzNXsHwIDAQAB\n' +
        '-----END PUBLIC KEY-----\n',
    privateKey: '-----BEGIN PRIVATE KEY-----\n' +
        'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAK5ZGDv4+Y6ADYGu\n' +
        'o4OYzjwwaH7Kp28oKnv6M9HpO4W4T86cXvZ135m3xw6g6w25fTPCm0L98mMilqOD\n' +
        'oc7ToufB5D2AoCX6gCNMq3f92CtUSmJ7tAasArbgfpopL2MH0KN/fD+4YEtaDtiZ\n' +
        'TD+2LT6kDCxpmFlCf6X0LI7M1ewfAgMBAAECgYBbMp17mXOot5DZGenMR1zxnPy7\n' +
        '/fNxMJhwe2Mp1Q9elheg4qjF0MiilsAYBdKOPk2gipY+h6mHc6tKYut7zbZzGIPw\n' +
        'wqDUmNnXg3hwGD//m8Dj4rVixBrus4Wiio0T3SPx30xUYWiq9SFi8Y54UJ58R471\n' +
        'ckkA5TEI2DlXOK1WMQJBAOSKAetcscdzeKiq4p2nBRFcyC72H6Df73ICdCpYXRjl\n' +
        'Ue5tapRtt799nQMZTTNj3Ok9IIdS9W58z0JEft3H7kkCQQDDTCOfWRI5xGJQTgME\n' +
        'zTmt5izRpG8jd8UyAlHrRwVCcmEVKtqQXPk5xLyk0VK3bYt5SvzZfj9kT1KPRRs7\n' +
        'd6cnAkEAkvh1l4i7A4ss0ztiFQSt66aBTkIVwP2CHQ2a6wh8hmAjOnO/EMkmW81K\n' +
        'Rg3laeEU1iHrY1tkXrOBDhrCg5npkQJAS5k4nOFk3bm4eO+J2Zz7u+ZC6TAm2Wru\n' +
        'iao+Pb4zOgJ+tCvviTyEOSmAAKkKxPiBqgUuFZ76OQE/qzgMD5wEtwJAHXxjuY4H\n' +
        'X2CEgGt18w4q2mLK5NViIm7yrZjhEmjaZaP7RPq6aR4XQV+qOloXOwmytvt6PlCq\n' +
        'vV1oOWwB+YHOqA==\n' +
        '-----END PRIVATE KEY-----\n'
}

const createToken = ({username, password}) => {
    const signerObject = crypto.createSign("RSA-SHA256");
    signerObject.update(`${username}-${password}`);
    return signerObject.sign({key:keys.privateKey,padding:crypto.constants.RSA_PKCS1_PSS_PADDING}, "base64");
}

const verifyToken = ({username, password, token}) => {
    const verifierObject = crypto.createVerify("RSA-SHA256");
    verifierObject.update(`${username}-${password}`);
    return verifierObject.verify({key:keys.publicKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING}, token, "base64");
}
// const signExample = (str) => {
//     crypto.generateKeyPair('rsa', {
//         modulusLength: 1024,
//         publicKeyEncoding: {
//             type: 'spki',
//             format: 'pem'
//         },
//         privateKeyEncoding: {
//             type: 'pkcs8',
//             format: 'pem'
//         }
//     }, (err, publicKey, privateKey) => {
//
//         console.log(publicKey, privateKey)
//         // sign String
//         // var signerObject = crypto.createSign("RSA-SHA256");
//         // signerObject.update(str);
//         // var signature = signerObject.sign({key:privateKey,padding:crypto.constants.RSA_PKCS1_PSS_PADDING}, "base64");
//         // console.info("signature: %s", signature);
//         // //verify String
//         // var verifierObject = crypto.createVerify("RSA-SHA256");
//         // verifierObject.update(str);
//         // var verified = verifierObject.verify({key:publicKey, padding:crypto.constants.RSA_PKCS1_PSS_PADDING}, signature, "base64");
//         // console.info("is signature ok?: %s", verified);
//     });
// }

export function login (req, res) {
    const {username: uname, password, token: t} = req.body
    const {username = uname, token} = t ? JSON.parse(Buffer.from(t, 'base64').toString('ascii')) : {}
    getImageKit('usermanagement').imageKit.listFiles({
        path : `data1/usermanagement`,
        tags : [username]
    }, function(error, result) {
        if(error) {
            res.status(500).json({done: false, error})
            return
        }
        const user = result.filter(({tags}) => {
            const [uName, pWord] = tags || []
            if (username === uName) {
                if (token) {
                    return verifyToken({username, password: pWord, token})
                }
                if (password === pWord) {
                    return true
                }
            }
            return false
        }).map(({tags: [username, password, role] = []}) => ({username, password, role}))[0]
        if (!user) {
            res.status(200).json({done: false, error: new Error('User Not Found')})
            return
        }
        const newToken = t || Buffer.from(JSON.stringify({username, token: createToken(user)})).toString('base64')
        res.status(200).json({done: true, token: newToken, role: user.role, username: user.username})
    })
}