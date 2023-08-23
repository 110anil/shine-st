'use client'
import styles from './scrollSeek.module.css'
import React, {useRef, useState} from 'react'
import {useOnScreen} from "@/utils/useOnScreen"
import frames from './photoFrames'
import cs from 'classnames'
const numFrames = frames.length


const observerPercentage = 1/numFrames
const observerArray = [...new Array(numFrames)].map((x, index) => index * observerPercentage)


let options = {
    root: null,
    rootMargin: "0px",
    threshold: observerArray
}



const getClosest = (ratio) => {
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


export default () => {
    const ref = useRef(null)
    const [active, setActive] = useState(0)
    useOnScreen(ref, options, (entry) => {
        setActive(getClosest(entry.intersectionRatio))
    })

    return (
        <div ref={ref} className={styles.frameContainer}>
            {frames.map(((frame, index) => <div style={{
                '--background': `url('${frame.src}')`
            }} className={cs(styles.frame, active === index && styles.activeFrame)} key={`${frame.src}-${index}`} />))}
        </div>
    )
}