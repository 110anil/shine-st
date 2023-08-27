import ImageKit from 'imagekit'

var imagekit = new ImageKit({
    publicKey : "public_OhjxwkIeAE/RJZt2J3fCav5kl4I=",
    privateKey : "private_jfETJAYcgdr/pGMOaB31ljVkVGI=",
    urlEndpoint : "https://ik.imagekit.io/shinest/"
})


export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}

const handle = (pin) => {
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
            r({done: true, width, height, images: imgs.map(x => x.url), title})
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
            let imgs = []

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

export async function getData(keys = ['topImages', 'serviceThumbnails', 'scrollFrames', 'featured', 'galleryImages', 'testimonials', 'bottomImages', 'logos']) {
    const data = await Promise.all(keys.map(key => handleData(key)))
    const finalData = data.reduce((res, item, index) => {
        res[keys[index]] = item
        return res
    }, {})

    if (finalData.logos) {
        const keyMap = {
            whiteLogo: 'white',
            favicon32: 'favicon-32x32',
            favicon16: 'favicon-16x16',
            'andChr512': 'android-chrome-512x512',
            'andChr192': 'android-chrome-192x192',
            appTouchIcon: 'apple-touch-icon',
            logo: 'mainLogo',
            icon: 'icon'
        }

        const logoMap = Object.keys(keyMap).reduce((res, key) => {
            const val = finalData.logos.find(x => x.url.includes(keyMap[key]))
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
    handle(req.body.pin.toLowerCase()).then(x => res.status(200).json(x)).catch(x => res.status(500).json(x))
}