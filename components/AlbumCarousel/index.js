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
import Modal from '@/components/Modal'

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

const Legends = ({isMobile, isPortrait, isLandscapeView, children, onClick, active, dimensions: {h, w} = {}}) => {

    if (isMobile) {
        const height = isPortrait ? 120 : 80
            w = w * height / h
            h = height
    }


    const ref = useRef(null)
    const [width, setWidth] = useState(100)
    const [containerWidth, setContainerWidth] = useState(300)
    const containerRef = useRef(null)
    useEffect(() => {
        if (ref && ref.current) {
            setWidth(ref.current.clientWidth / children.length)
        }
    }, [children.length])

    useEffect(() => {
        if (containerRef && containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth)
        }
    }, [])

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
    if (!isLandscapeView && isMobile) {
        numDots = 6
    }
    if (numDots > children.length) {
        numDots = children.length
    }
    const factor = children.length / numDots // 3.3333
    const currentFactor = Math.floor(active / factor)
    const map = {
        200: 215,
        105: 115,
        80: 87,
        120: 127
    }
    const contStyles = {
        height: `${map[h]}px`
    }
    const legendStyles = {
        '--h': `${h + 6}px`,
        '--w': `${w + 6}px`
    }
    return (
        <>
            <div ref={containerRef} className={cs(styles.legendContainer, 'legend-container')} style={contStyles}>
                <div ref={ref} className={styles.cont} style={{
                    ...contStyles,
                    transform: `translateX(${left}px)`
                }}>
                    {
                        children.map((item, index) => (
                            <div className={cs(styles.legend, active === index && styles.active)} style={legendStyles} key={index} onClick={() => onClick(index)}>{item}</div>
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
const keyFunction = (active, setActive, images) => (e) => {
    const map = {
        ArrowLeft: -1,
        ArrowRight: 1
    }
    let value = map[e.key]
    if (value) {
        value = value + active
        if (value < 0) {
            value = 0
        } else if (value >= images.length - 1) {
            value = images.length - 1
        }
        setActive(value)
    }
}
const Carousel = ({images, isPortrait, isLandscapeView = true, keyboard = false, dimensions, windowDimensions, dimensions: {w = 1, h = 1} = {}, autoPlay = false, activeId = 2}) => {

    const ref = useRef(null)
    const keyRef = useRef(null)
    const [active, setAct] = useState(activeId)
    const [pendingFlips, setFlips] = useState([])
    const [currentShow, setCurrentShown] = useState(active)
    const [transitionStatus, setTransitionStatus] = useState('ENDED')
    const [isAutoPlay, setAutoPlay] = useState(autoPlay)
    const [isShowLegends, toggleLegends] = useState(true)
    const [showRotatePrompt, togglePrompt] = useState(true)
    const ratio = w / h

    const setActive = (id) => {
        const {to: prevTo = active} = pendingFlips[pendingFlips.length - 1] || {}
        if (id === prevTo) {
            return
        }

        // console.log(pendingFlips, {to: id, direction: id < prevTo ? 'LEFT' : 'RIGHT'})
        setFlips([...pendingFlips, {to: id, direction: id < prevTo ? 'LEFT' : 'RIGHT'}])
        setAct(id)
    }

    const {wH, wW} = windowDimensions

    const isMobile = wW <= 1100

    let height, width
    if (isMobile) {
        // if (isLandscapeView) {
            height = wH - 40 - 56 // padding and title height are subtracted

            width = height * ratio
            const f = isLandscapeView ? 50 : 40
            if (width >= wW - f) {
                width = wW - f
                height = width / ratio
            }
        // } else {
        //     height = (isShowLegends ? .55 : .75) * wH
        //     width = height * ratio
        //     if (width >= wW - 206) {
        //         width = wW - 206
        //         height = width / ratio
        //     }
        // }
    } else {
        height = (isShowLegends ? .55 : .75) * wH
        width = height * ratio
        if (width >= wW - 206) {
            width = wW - 206
            height = width / ratio
        }
    }




    const btns = [{icon: thumb, text: 'legends', onClick: () => toggleLegends(!isShowLegends)},{
        icon: isAutoPlay ? pause : play,
        text: 'autoPlay', onClick: () => setAutoPlay(!isAutoPlay)}, {icon: fs, text: 'fullScreen', onClick: () => {
            toggleFullScreen()
        }}, {icon: restart, text: 'restart', onClick: () => {
            setActive(0)
        }}]

    useEffect(() => {
            setTimeout(() => {
                togglePrompt(false)
            }, 3000)
    }, [])
    useEffect(() => {
        ref.current && clearTimeout(ref.current)
        ref.current = null

        if (isAutoPlay) {
            ref.current = setTimeout(() => {
                setActive((active + 1) % images.length)
            }, 2500)
        }

        return () => {
            ref.current && clearTimeout(ref.current)
            ref.current = null
        }

    }, [images.length, active, isAutoPlay])

    useEffect(() => {
        keyRef.current && window.removeEventListener('keydown', keyRef.current)
        keyRef.current = null
        if (keyboard) {
            const func = keyFunction(active, setActive, images)
            keyRef.current = func
            window.addEventListener('keydown', func)
        }
        return () => {
            keyRef.current && window.removeEventListener('keydown', keyRef.current)
            keyRef.current = null
        }
    }, [keyboard, images.length, active])

    const endTransition = () => {

            const [{to} = {}, ...pending] = pendingFlips
        // console.log('end', pendingFlips, pending, to)
        if (to) {
            setTransitionStatus('PENDING')
            setTimeout(() => {
                setTransitionStatus('ENDED')
            }, 500)
            setCurrentShown(to)
        }
        pendingFlips.length && setFlips(pending)
    }

    console.log(pendingFlips, transitionStatus, currentShow, 'sdfsd45345345')

    let prev = images[currentShow]
    let next = images[currentShow]

    prev = prev.url || prev
    next = next.url || next
    let flip1, flip2
    const [{direction: flipDirection} = {}] = pendingFlips
    if (transitionStatus === 'ENDED') {
        if (flipDirection === 'LEFT') {
            prev = images[currentShow - 1]
            if (prev)  {
                prev = prev.url || prev
            }
            flip1 = next
            flip2 = prev
        } else if (flipDirection === 'RIGHT') {
            next = images[currentShow + 1]
            if (next) {
                next = next.url || next
            }
            flip1 = prev
            flip2 = next
        }
    }

    prev = prev ? `url('${prev}')` : '__'
    next = next ? `url('${next}')` : '__'
    flip1 = flip1 ? `url('${flip1}')` : '__'
    flip2 = flip2 ? `url('${flip2}')` : '__'

    if (showRotatePrompt && !isPortrait && !isLandscapeView && isMobile) {
        return <Modal><div className={styles.rotate}><b>Rotate your device</b>for a better experience</div></Modal>
    }
    const children = images.map(img => <div className={styles.legendImage} style={{'--bg': `url('${img.url || img}')`}} key={img.url || img} />)
    return (

        <div className={cs(styles.carousel, isMobile && styles.mobile, isLandscapeView && styles.landscape)}>
            <div className={styles.carouselInner}>
                <div className={cs(styles.carouselItem)} style={{
                    '--h': `${height}px`,
                    '--w': `${width}px`,
                }}>
                        <div className={cs(styles.prev, styles.image)} style={{'--bg': prev}} />
                        <div className={cs(styles.next, styles.image)} style={{'--bg': next}} />
                            <div className={cs(styles.flip, flipDirection === 'LEFT' && styles.leftFlip, flipDirection && styles.flipped)} style={{
                                '--time': pendingFlips.length > 1 ? ".1s" : "1.5s"
                            }}>
                                <div onTransitionEnd={endTransition}>
                                    <div className={cs(styles.first, styles.image)} style={{'--bg': flip1}} />
                                    <div className={cs(styles.second, styles.image)} style={{'--bg': flip2}} />
                                </div>
                            </div>

                </div>
                        <label onClick={() => active > 0 && setActive(active - 1)} className={classNames(styles.carouselControl, styles.carouselControlPrev, active > 0 && styles.carouselControlActive)}><ControlArrow /></label>
                        <label onClick={() => active < images.length - 1 && setActive(active + 1)} className={classNames(styles.carouselControl, styles.carouselControlNext, active < images.length - 1 && styles.carouselControlActive)}><ControlArrow /></label>
                {isShowLegends && <Legends isPortrait={isPortrait} isMobile={isMobile} isLandscapeView={isLandscapeView} dimensions={dimensions} active={active} onClick={setActive}>{children}</Legends>}
                    <ol className={styles.btns}>
                        {btns.map(({text, icon, onClick}, index) => {
                            return (
                                <li key={`carousel-btns-${index}`} onClick={onClick} style={{
                                    '--bg': `url('${icon.src}')`
                                }} className={classNames(styles.carouselBtns)} />
                            )
                        })}
                    </ol>
            </div>
        </div>
    )
}

export default Carousel