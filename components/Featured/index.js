import React from 'react'
import styles from './featured.module.css'
import logo1 from '../../images/featured/llf.png'
import logo2 from '../../images/featured/wedmegood.webp'
import logo3 from '../../images/featured/ifp.png'
import logo4 from '../../images/featured/risingStar.png'
import logo5 from '../../images/featured/tnl.png'
import logo6 from '../../images/featured/junebug.png'

const logos = [logo3, logo1, logo4, logo6, logo2, logo5]
const Featured = () => {
    return (
        <div className={styles.container}>
            <div>
                <div className={styles.title}>We've been <b>featured!</b></div>
                <div className={styles.logos}>{logos.map(logo => <img src={logo.src} alt={logo.src} key={logo.src} />)}</div>
            </div>
        </div>
    )
}
export default Featured