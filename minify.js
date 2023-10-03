// Usage: pass path to file name to optimize
const array = [...new Array(94)].map((x, index) => `/Users/sachinagrawal/projects/shine-st/components/ScrollSeek/photoFrames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.png`)
const tinify = require('tinify')
tinify.key = "MVD-voJnWcgTEWEtpJXoTcb_ovoEzArK"
array.forEach(file => {
    tinify.fromFile(file).toFile(file, function (err) {
        if (err) {
            return console.log(err, file)
        }
    })

})
