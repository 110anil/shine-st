'use client'
import Carousel from "@/components/Carousel";
import Modal from "@/components/Modal";
import cs from 'classnames'
import styles from './albumRenderer.module.css'
import {useEffect, useState} from "react";
import Loader from "@/components/Loader";

const defaultOnClose = () => window.location.href = '/albums'
const AlbumRenderer = ({title, images = [], height: h, width: w, logoMap, onClose = defaultOnClose}) => {
    const [data, setData] = useState(h && w ? {height: h, width: w} : null)

    const [firstImage] = images || []
    const firstImageUrl = firstImage.url || firstImage

    useEffect(() => {
        if (!h || !w) {
            const img = new Image()
            img.onload = function() {
                setData({height: this.height, width: this.width})
            }
            img.src = firstImageUrl
        }
    }, [h, w, firstImageUrl])

    if (!data) {
        return <Loader />
    }
    const {height, width} = data
    const ratio = width / height // 600 / 900
    const isPortrait = ratio < 1 // true
    const h1 = isPortrait ? 200 : 105
    const w1 = Math.round(2 * h1 * width / height) // 200 * 600 / 900

    return (
        <Modal>
            <div className={cs(styles.container, styles.close)} style={{
                '--bg': `url('${logoMap.whiteLogo}')`
            }}>
                <label onClick={onClose}>Close</label>
                <div className={styles.title}>{title}</div>
                <Carousel keyboard showBtns showControls showLegends legendClass={styles.legend} legendContStyles={{
                    height: `${h1 === 200 ? 215 : 115}px`
                }} legendStyles={{
                    '--h': `${h1 + 6}px`,
                    '--w': `${w1 + 6}px`
                }}>
                    {images.map(img => <div className={styles.image} style={{'--bg': `url('${img.url || img}')`}} key={img.url || img} />)}
                </Carousel>
            </div>
        </Modal>
    )
}

export default AlbumRenderer