import React from 'react'
import styles from './gallery.module.css'
const Gallery = ({images}) => {
    return (
        <div className={styles.cont}>
            <div className={styles.cont2}>
                    <div className={styles.container}>
                        {images.map((img, index) => <div key={`key-${index}`}><div style={{
                            '--background': `url('${img.url}')`
                        }} /></div>)}
                    </div>
            </div>
        </div>
    )
}
export default Gallery