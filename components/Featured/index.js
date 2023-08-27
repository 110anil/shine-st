import React from 'react'
import styles from './featured.module.css'

const Featured = ({featuredImages}) => {
    return (
        <div className={styles.container}>
            <div>
                <div className={styles.title}>We&apos;ve been <b>featured!</b></div>
                <div className={styles.logos}>{featuredImages.map(logo => <div style={{
                    '--bg': `url('${logo.url}')`
                }} key={logo.url} />)}</div>
            </div>
        </div>
    )
}
export default Featured