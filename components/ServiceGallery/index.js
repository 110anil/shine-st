import React from 'react'
import styles from './gallery.module.css'
import cs from 'classnames'
const Gallery = ({images, preview = false}) => {
    return (
        <div className={styles.cont}>
            <div className={styles.cont2}>
                    <div className={cs(styles.container, preview && styles.preview)}>
                        {images.map((img, index) => <div key={`key-${index}`}><div style={{
                            '--background': `url('${img.url}')`,
                            '--num': `"${img.key}"`
                        }} /></div>)}
                    </div>
            </div>
        </div>
    )
}
export default Gallery