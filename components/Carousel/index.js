'use client'

import styles from './carousel.module.css'
import React, {useEffect, useRef, useState} from 'react'
import classNames from "classnames";
import ControlArrow from '../../icons/carouselControl'
import fs from './icons/fs.png'
import pause from './icons/pause.png'
import play from './icons/play.png'
import restart from './icons/restart.png'
import thumb from './icons/thumb.png'
import cs from 'classnames'

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}
const Legends = ({children, onClick, active, legendStyles = {}, legendClass = ''}) => {
    return (
        <div className={cs(styles.legendContainer, 'legend-container')}><div className={styles.cont}>
            {
                children.map((item, index) => (
                    <div className={cs(styles.legend, active === index && styles.active, legendClass)} style={legendStyles} key={index} onClick={() => onClick(index)}>{item}</div>
                ))
            }
        </div></div>
    )
}
const Carousel = ({legendClass, legendStyles = {}, showBtns = false, showLegends = false, children, autoPlay = false, showControls = false, showBullets = false, activeId = 0}) => {

    const ref = useRef(null)
    const [active, setActive] = useState(activeId)
    const [isAutoPlay, setAutoPlay] = useState(autoPlay)
    const [isShowLegends, toggleLegends] = useState(false)

    const btns = [{icon: thumb, text: 'legends', onClick: () => toggleLegends(!isShowLegends)},{
        icon: isAutoPlay ? pause : play,
        text: 'autoPlay', onClick: () => setAutoPlay(!isAutoPlay)}, {icon: fs, text: 'fullScreen', onClick: () => {
            toggleFullScreen()
        }}, {icon: restart, text: 'restart', onClick: () => {
            setActive(0)
        }}]

    useEffect(() => {
        ref.current && clearTimeout(ref.current)
        ref.current = null

        if (isAutoPlay) {
            ref.current = setTimeout(() => {
                setActive((active + 1) % children.length)
            }, 2500)
        }

        return () => {
            ref.current && clearTimeout(ref.current)
            ref.current = null
        }

    }, [children.length, active, isAutoPlay])

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
                {showLegends && isShowLegends && <Legends legendClass={legendClass} legendStyles={legendStyles} active={active} onClick={setActive}>{children}</Legends>}
                {showBtns && (
                    <ol className={styles.btns}>
                        {btns.map(({text, icon, onClick}, index) => {
                            return (
                                <li key={`carousel-btns-${index}`} onClick={onClick} style={{
                                    '--bg': `url('${icon.src}')`
                                }} className={classNames(styles.carouselBtns)} />
                            )
                        })}
                    </ol>
                )}
            </div>
        </div>
    )
}

export default Carousel