import Carousel from "@/components/Carousel";
import Modal from "@/components/Modal";
import cs from 'classnames'
import styles from './albumRenderer.module.css'

const defaultOnClose = () => window.location.href = '/albums'
const AlbumRenderer = ({title, images, height = 105, width = 210, logoMap, onClose = defaultOnClose}) => {
    const ratio = width / height
    const isPortrait = ratio < 1
    const h = isPortrait ? 200 : 105
    const w = Math.ceil(h * width / height)
    return (
        <Modal>
            <div className={cs(styles.container, styles.close)} style={{
                '--bg': `url('${logoMap.whiteLogo}')`
            }}>
                <label onClick={onClose}>Close</label>
                <div className={styles.title}>{title}</div>
                <Carousel showBtns showControls showLegends legendClass={styles.legend} legendStyles={{
                    '--h': `${h}px`,
                    '--w': `${w}px`
                }}>
                    {images.map(img => <div className={styles.image} style={{'--bg': `url('${img.url || img}')`}} key={img.url || img} />)}
                </Carousel>
            </div>
        </Modal>
    )
}

export default AlbumRenderer