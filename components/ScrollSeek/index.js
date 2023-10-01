'use client'
import styles from './scrollSeek.module.css'
import React, {useMemo, useRef, useState} from 'react'
import {useOnScreen} from "@/utils/useOnScreen"
import cs from 'classnames'

const getClosest = (ratio, observerArray) => {
    let closestIndex = 0
    let diff = Math.abs(observerArray[closestIndex] - ratio)

    for (let index = 0; index < observerArray.length; index++) {
        const val = observerArray[index]
        const diff2 = Math.abs(val - ratio)
        if (diff > diff2) {
            diff = diff2
            closestIndex = index
        }
    }
    return closestIndex
}


const ScrollSeek = ({scrollframes}) => {
    const ref = useRef(null)
    const [active, setActive] = useState(0)


    const {frames, backgroundLeft} = useMemo(() => {
        let bgLeft
        const framesTemp =  scrollframes.map(({url, tags}) => {
            const [timesToRepeat = 1, bg] = tags || []
            if (bgLeft === undefined && bg !== undefined && bg.length) {
                bgLeft = bg
            }
            return [...new Array(parseInt(timesToRepeat))].map(() => url)
        }).flat()
        if (bgLeft === undefined) {
            bgLeft = 34
        }
        return {backgroundLeft: bgLeft, frames: framesTemp}
    }, [scrollframes.length])



    const numFrames = frames.length

    const options = useMemo(() => {
        if (numFrames > 0) {
            const observerPercentage = 1/numFrames
            const observerArray = [...new Array(numFrames)].map((x, index) => index * observerPercentage)
            return {
                root: null,
                rootMargin: "0px",
                threshold: observerArray
            }
        }
    }, [numFrames > 0])


    useOnScreen(ref, options, (entry, options) => {
        const {threshold} = options || {}
        setActive(getClosest(entry.intersectionRatio, threshold))
    })



    return (
        <div ref={ref} className={styles.frameContainer} style={{
            '--bgLeft': `${backgroundLeft}%`
        }}>
            <div className={styles.bg} />
            {frames.map(((url, index) => <div style={{
                '--background': `url('${url}')`
            }} className={cs(styles.frame, active === index && styles.activeFrame)} key={`${url}-${index}`} />))}
        </div>
    )
}

export default ScrollSeek