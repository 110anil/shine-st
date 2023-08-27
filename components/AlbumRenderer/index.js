import Carousel from "@/components/Carousel";
import Modal from "@/components/Modal";
import styles from './albumRenderer.module.css'
const AlbumRenderer = ({title, images, height, width, logoMap}) => {
    const ratio = width / height
    const isPortrait = ratio < 1
    const h = isPortrait ? 200 : 105
    const w = Math.ceil(h * width / height)
    return (
        <Modal>
            <div className={styles.container}>
                <div className={styles.title}>{title}</div>
                <Carousel showBtns showControls showLegends legendClass={styles.legend} legendStyles={{
                    '--h': `${h}px`,
                    '--w': `${w}px`
                }}>
                    {images.map(img => <div className={styles.image} style={{'--bg': `url('${logoMap.whiteLogo}')`}} key={img} />)}
                </Carousel>
            </div>
        </Modal>
    )
}

export default AlbumRenderer