'use client'

import styles from './carousel.module.css'
import React, {useEffect, useRef, useState} from 'react'
import classNames from "classnames";
import ControlArrow from '../../icons/carouselControl'

const keyFunction = (active, setActive, children) => (e) => {
    const map = {
        ArrowLeft: -1,
        ArrowRight: 1
    }
    let value = map[e.key]
    if (value) {
        value = value + active
        if (value < 0) {
            value = 0
        } else if (value >= children.length - 1) {
            value = children.length - 1
        }
        setActive(value)
    }
}
const Carousel = ({keyboard = false,  children, autoPlay = false, showControls = false, showBullets = false, activeId = 0}) => {

    const ref = useRef(null)
    const keyRef = useRef(null)
    const [active, setActive] = useState(activeId)

    useEffect(() => {
        ref.current && clearTimeout(ref.current)
        ref.current = null

        if (autoPlay) {
            ref.current = setTimeout(() => {
                setActive((active + 1) % children.length)
            }, 2500)
        }

        return () => {
            ref.current && clearTimeout(ref.current)
            ref.current = null
        }

    }, [children.length, active, autoPlay])

    useEffect(() => {
        keyRef.current && window.removeEventListener('keydown', keyRef.current)
        keyRef.current = null
        if (keyboard) {
            const func = keyFunction(active, setActive, children)
            keyRef.current = func
            window.addEventListener('keydown', func)
        }
        return () => {
            keyRef.current && window.removeEventListener('keydown', keyRef.current)
            keyRef.current = null
        }
    }, [keyboard, children.length, active])

    return (

        <div className={styles.carousel}>
            <div className={styles.carouselInner}>
                {children.map((item, index) => {
                   return (
                           <div key={`carousel-items-${index}`} className={classNames(styles.carouselItem, active === index && styles.carouselItemActive, isShowLegends && styles.legendShown)}>
                               {item}
                           </div>
                   )
                })}
                {showControls && (
                    <>
                        <label onClick={() => active > 0 && setActive(active - 1)} className={classNames(styles.carouselControl, styles.carouselControlPrev, active > 0 && styles.carouselControlActive)}><ControlArrow /></label>
                        <label onClick={() => active < children.length - 1 && setActive(active + 1)} className={classNames(styles.carouselControl, styles.carouselControlNext, active < children.length - 1 && styles.carouselControlActive)}><ControlArrow /></label>
                    </>
                )}
                {showBullets && (
                    <ol className={styles.carouselIndicators}>
                        {children.map((item, index) => {
                            return (
                                <li key={`carousel-bullet-${index}`}>
                                    <label onClick={() => setActive(index)} className={classNames(styles.carouselBullet, index === active && styles.carouselBulletActive)}>•</label>
                                </li>
                            )
                        })}

                    </ol>
                )}
            </div>
        </div>
    )
}

export default Carousel