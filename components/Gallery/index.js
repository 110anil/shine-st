import React from 'react'
import styles from './gallery.module.css'
import cs from "classnames";
const Gallery = ({images, preview}) => {
    return (
        <div className={styles.cont}>
            <div className={styles.cont2}>
                <span className={styles.cont3}>
                    <div className={cs(styles.container, preview && styles.preview)}>
                        {images.map((img, index) => <div key={`key-${index}`}><div style={{
                            '--background': `url('${img.url}')`,
                            '--num': `"${img.key}"`
                        }} /></div>)}
                    </div>
                </span>
                <span className={styles.cont3}>
                    <div className={cs(styles.container, preview && styles.preview)}>
                        {images.map((img, index) => <div key={`key2-${index}`}><div style={{
                            '--background': `url('${img.url}')`,
                            '--num': `"${img.key}"`
                        }} /></div>)}
                    </div>
                </span>
            </div>
        </div>
    )
}
export default Gallery