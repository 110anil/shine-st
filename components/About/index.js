import React from 'react'
import styles from './about.module.css'
import Carousel from '@/components/Carousel'
import img1 from './img1.jpg'
const images = [{
    url: img1,
    title: 'Weddings'
}, {
    url: img1,
    title: 'Portraits'
}, {
    url: img1,
    title: 'Pre Wedding'
}, {
    url: img1,
    title: 'Couples'
}, {
    url: img1,
    title: 'Films'
}, {
    url: img1,
    title: 'Shoots'
}, {
    url: img1,
    title: 'Babies'
}, {
    url: img1,
    title: 'Commercials'
}]

const getChunks = (array) => {
    const arr = []
    const chunkSize = 4;
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        arr.push(chunk)
    }
    return arr
}

const imgs = getChunks(images)
const About = () => {
    return (
        <div className={styles.container}>
            <div>
                <div className={styles.textContainer}>
                    <div className={styles.title}><b>Capturing moments</b> that live a lifetime.</div>
                    <div className={styles.subTitle}>We understand the importance of preserving memories that will be cherished for years to come, which is why we focus on capturing those special moments that often go unnoticed. Whether it&apos;s a teary-eyed mother of the bride, a heartfelt exchange of vows, or a spontaneous burst of laughter, We&apos;re always ready to capture the moments that matter most.</div>
                </div>
                <div className={styles.rightContainer}>
                    <Carousel autoPlay>
                        {imgs.map((img1, index) => <div className={styles.tileContainer} key={`key-${index}`}>
                            {img1.map(({url, title}) => <div key={title} className={styles.tile}>
                                {/*<img  alt={title} src={url.src}  />*/}
                                <span style={{
                                    '--bg': `url('${url.src}')`
                                }}></span>
                                <div><div>{title}</div></div>
                            </div>)}
                        </div>)}
                    </Carousel>
                </div>
            </div>
        </div>
    )
}
export default About