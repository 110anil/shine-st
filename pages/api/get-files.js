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
export default function handler (req, res) {
    const pin = req.body.pin.toLowerCase()
    imagekit.listFiles({
        path : `data1/${pin}`
    }, function(error, result) {
        if(error) {
            res.status(500).json({done: false, error})
            return
        }
        let imgs = []
        let normalFiles = result.filter(x => !x.tags.includes('front') && !x.tags.includes('back'))
        const front = result.find(x => x.tags.includes('front'))
        const back = result.find(x => x.tags.includes('back'))

        normalFiles = normalFiles.sort((x, y) => {
            const xIndex = parseInt(((x.url.match(/\/\d+\.jpg/) || [])[0].match(/\d+/) || [])[0])
            const yIndex = parseInt(((y.url.match(/\/\d+\.jpg/) || [])[0].match(/\d+/) || [])[0])

            return xIndex < yIndex ? -1 : 1
        })
        if (front) {
            imgs.push(front)
        }
        imgs = [...imgs, ...normalFiles]
        if (back) {
            imgs.push(back)
        }
        const [{width, height, tags: [title] = []}] = normalFiles
        res.status(200).json({done: true, title, width, height, images: imgs.map(x => x.url)})
    })
}