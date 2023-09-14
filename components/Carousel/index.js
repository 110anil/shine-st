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
import {act} from "react-dom/test-utils";

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

const Legends = ({children, onClick, active, legendStyles = {}, legendContStyles = {}, legendClass = ''}) => {
    const ref = useRef(null)
    const [width, setWidth] = useState(100)
    const [containerWidth, setContainerWidth] = useState(300)
    const containerRef = useRef(null)
    useEffect(() => {
        if (ref && ref.current) {
            setWidth(ref.current.clientWidth / children.length)
        }
    }, [ref.current, children.length])

    useEffect(() => {
        if (containerRef && containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth)
        }
    }, [containerRef.current])

    const totalWidth = width * children.length
    let left = containerWidth / 2 - active * width - width / 2
    if (left > 0) {
        left = 0
    }

    if (totalWidth + left < containerWidth) {
        left = containerWidth - totalWidth
    }

    // 40 slides
    // we want to show 12 dots

    let numDots = 12
    if (numDots > children.length) {
        numDots = children.length
    }
    const factor = children.length / numDots // 3.3333
    const currentFactor = Math.floor(active / factor)

    return (
        <>
            <div ref={containerRef} className={cs(styles.legendContainer, 'legend-container')} style={legendContStyles}>
                <div ref={ref} className={styles.cont} style={legendContStyles} style={{
                    transform: `translateX(${left}px)`
                }}>
                    {
                        children.map((item, index) => (
                            <div className={cs(styles.legend, active === index && styles.active, legendClass)} style={legendStyles} key={index} onClick={() => onClick(index)}>{item}</div>
                        ))
                    }
                </div>
            </div>
            <div className={styles.dotsContainer}>
               <div> {[...new Array(numDots)].map((x, index) => <div className={cs(currentFactor === index && styles.activeDot)} onClick={() => onClick(Math.ceil(index * factor))} key={index} />)}</div>
            </div>
        </>
    )
}
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
const Carousel = ({legendContStyles, keyboard = false, legendClass, legendStyles = {}, showBtns = false, showLegends = false, children, autoPlay = false, showControls = false, showBullets = false, activeId = 0}) => {

    const ref = useRef(null)
    const keyRef = useRef(null)
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
                {showLegends && isShowLegends && <Legends legendContStyles={legendContStyles} legendClass={legendClass} legendStyles={legendStyles} active={active} onClick={setActive}>{children}</Legends>}
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