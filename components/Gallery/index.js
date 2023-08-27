import React from 'react'
import styles from './gallery.module.css'
const Gallery = ({images}) => {
    return (
        <div className={styles.cont}>
            <div className={styles.cont2}>
                <span className={styles.cont3}>
                    <div className={styles.container}>
                        {images.map((img, index) => <div key={`key-${index}`}><div style={{
                            '--background': `url('${img.url}')`
                        }} /></div>)}
                    </div>
                </span>
                <span className={styles.cont3}>
                    <div className={styles.container}>
                        {images.map((img, index) => <div key={`key2-${index}`}><div style={{
                            '--background': `url('${img.url}')`
                        }} /></div>)}
                    </div>
                </span>
            </div>
        </div>
    )
}
export default Gallery