'use client'

import styles from './carousel.module.css'
import React, {Fragment, useEffect, useRef, useState} from 'react'
import classNames from "classnames";
import ControlArrow from '../../icons/carouselControl'
const Carousel = ({children, autoPlay = false, showControls = false, showBullets = false, activeId = 0}) => {

    const ref = useRef(null)
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

    return (

        <div className={styles.carousel}>
            <div className={styles.carouselInner}>
                {children.map((item, index) => {
                   return (
                           <div key={`carousel-items-${index}`} className={classNames(styles.carouselItem, active === index && styles.carouselItemActive)}>
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