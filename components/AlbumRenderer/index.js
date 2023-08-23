import Carousel from "@/components/Carousel";
import Modal from "@/components/Modal";
import styles from './albumRenderer.module.css'
const AlbumRenderer = ({title, images}) => {
    return (
        <Modal>
            <div className={styles.container}>
                <div className={styles.title}>{title}</div>
                <Carousel showBtns showControls showLegends>
                    {images.map(img => <div className={styles.image} style={{'--bg': `url('${img}')`}} key={img} />)}
                </Carousel>
            </div>
        </Modal>
    )
}

export default AlbumRenderer