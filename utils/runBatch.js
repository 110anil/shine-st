import {makeChunks} from "@/utils/makeChunks";

export const runBatch = (promises, limit = 7, timeout = 300) => {
    const chunks = makeChunks(promises, limit)
    let index = -1
    let responses = []
    const thenCaller = (data) => {
        responses = [...responses, ...data]
        index++
        let creators = chunks[index]
        if (!creators) {
            return
        }
        creators = Promise.all(creators.map(x => x()))
        return creators.then(data => {
            return new Promise((r) => {
                setTimeout(() => {
                    r(thenCaller(data))
                }, timeout)
            })
        })
    }

    return thenCaller([]).then(() => responses)
}