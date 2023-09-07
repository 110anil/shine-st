import ImageKit from 'imagekit'
import crypto from 'crypto'
const endpoint = "https://ik.imagekit.io/shinest/"
const privateKey = "private_jfETJAYcgdr/pGMOaB31ljVkVGI=";
const publicKey = "public_OhjxwkIeAE/RJZt2J3fCav5kl4I=";
import {runBatch} from "@/utils/runBatch";

const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint : endpoint
})


export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}

const handle = (pin, meta) => {
    return new Promise((r, j) => {
        imagekit.listFiles({
            path : `data1/${pin}`
        }, function(error, result) {
            if(error) {
                j({done: false, error})
                return
            }
            let imgs = []

            let normalFiles = result.filter(x => !(x.tags || []).includes('front') && !(x.tags || []).includes('back'))
            const front = result.find(x => (x.tags || []).includes('front'))
            const back = result.find(x => (x.tags || []).includes('back'))

            normalFiles = normalFiles.sort((x, y) => {
                try {
                    const xIndex = parseInt(((x.url.match(/\/\d+\.[a-zA-Z\d]+/) || [])[0].match(/\d+/) || [])[0])
                    const yIndex = parseInt(((y.url.match(/\/\d+\.[a-zA-Z\d]+/) || [])[0].match(/\d+/) || [])[0])

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
            const [{width, height, tags} = {}] = normalFiles
            const [title] = (tags || []).filter(tag => !['front', 'back'].includes(tag))
            r({done: true, width, height, images: imgs.map(x => meta ? ({url: x.url, id: x.fileId, tags: x.tags ? x.tags : []}) : x.url), title})
        })
    })
}

const handleData = (pin) => {
    return new Promise((r, j) => {
        imagekit.listFiles({
            path : `data1/${pin}`
        }, function(error, normalFiles) {
            if(error) {
                j({done: false, error})
                return
            }

            normalFiles = normalFiles.sort((x, y) => {
                try {
                    const xIndex = parseInt(((x.url.match(/\/\d+\.[a-zA-Z\d]+/) || [])[0].match(/\d+/) || [])[0])
                    const yIndex = parseInt(((y.url.match(/\/\d+\.[a-zA-Z\d]+/) || [])[0].match(/\d+/) || [])[0])

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

function purgeFiles (files) {
    return runBatch(files.map(f => {
        return () => new Promise((r, j) => {
            imagekit.purgeCache(f.url, function(error, result) {
                if(error) {
                    j(error)
                }
                else {
                    r(result)
                }
            });
        })
    }))
}
export function deleteFiles (req, res) {
    const {files, purge} = req.body
    imagekit.bulkDeleteFiles(files.map(x => x.fileId))
        .then((response) => {
            if (purge) {
                return purgeFiles(files).then(response => res.status(200).json({done: true, response}))
            } else {
                res.status(200).json({done: true, response})
            }
        })
        .catch(error => {
            res.status(500).json({done: false, error})
        });
}
// 1 -> 2
// 2 -> 1

// 1 -> temp_1
// temp_1 -> 2
// 2 -> temp_2
// temp_2 -> 1
export function changeTitle (req, res) {
    const {fileIds, title, oldTitle} = req.body
    let promise = Promise.resolve()
    if (oldTitle) {
        promise = imagekit.bulkRemoveTags(fileIds, [oldTitle])
    }
    promise.then(() => imagekit.bulkAddTags(fileIds, [title])).then(result => res.status(200).json({done: true, result})).catch(error => res.status(500).json({done: false, error}))
}

export function changeTags (req, res) {
    const {files} = req.body
    return runBatch(files.map(f => {
        return () => imagekit.updateFileDetails(f.fileId, {tags: f.newTags.length ? f.newTags : null})
    })).then(result => res.status(200).json({done: true, result})).catch(error => res.status(500).json({done: false, error}))

}

export function getCreds (req, res) {
    res.status(200).json(imagekit.getAuthenticationParameters())
}
export function renameFiles (req, res) {
    const {files, existingKeys = {}} = req.body

    let tempIndex = 0
    const tempFiles = []
    const temp = `temp_${(new Date()).getTime()}`
    const purgedUrls = new Set()
    let urlsToPurge = new Set()
    // 306 -> 307
    // originalKey: 306
    // key: 307
    // temp_0
    let filesToRename = files.map(({key, ...f}) => {
        purgedUrls.add(f.url)
        if (existingKeys[key] !== undefined) {
            const tempKey = `${temp}_${tempIndex++}`
            tempFiles.push({...f, key, originalKey: tempKey, purge: false, url: f.url.replace(`${f.originalKey}${f.ext}`, `${tempKey}${f.ext}`) }) // temp -> key
            return {...f, key: tempKey} // original -> temp
        }
        return {...f, key}
    })

    files.forEach( x => {
        const url = x.url.replace(`${x.originalKey}${x.ext}`, `${x.key}${x.ext}`)
        if (!purgedUrls.has(url)) {
            urlsToPurge.add(url)
        }
    })

    urlsToPurge = [...urlsToPurge].map(x => ({url: x}))

    const rename = f => {
        return () => {
            let headers = new Headers();
            const {purge = true} = f
            headers.set('Content-Type', 'application/json')
            headers.set('Authorization', 'Basic ' + Buffer.from(privateKey + ":" + "").toString('base64'))
            return fetch('https://api.imagekit.io/v1/files/rename', {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify({
                    "filePath" : '/' + f.url.replace(endpoint, ''),
                    "newFileName" : `${f.key}${f.ext}`,
                    "purgeCache": purge
                })

            })
        }
    }

    return runBatch(filesToRename.map(rename)).then(() => runBatch(tempFiles.map(rename))).then((x) => urlsToPurge.length ? purgeFiles(urlsToPurge) : x).then(response => res.status(200).json({done: true, response}))
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
    imagekit.listFiles({
        tags : [...title, req.body.title]
    }, function(error, result) {
        if(error) {
            res.status(500).json({done: false, error})
            return
        }
        const obj = {}
        result.forEach((file) => {
            let {tags, filePath} = file
            const pin = filePath.replace(/\/data1\//, '').split('/')[0]
            if (!obj[pin]) {
                obj[pin] = tags[0]
            }
        })
        res.status(200).json({done: true, result: Object.keys(obj).map(pin => ({pin, title: obj[pin], url: `/albums/${pin}`}))})
    });
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
    imagekit.listFiles({
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