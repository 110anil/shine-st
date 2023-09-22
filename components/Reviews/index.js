import React from 'react'
import styles from './reviews.module.css'
import Carousel from '@/components/Carousel'

const Reviews = ({testimonials}) => {
    return (
        <div className={styles.container}>
            <div>
                <div className={styles.title}>Testimonials</div>
                <Carousel id={'testimonials'} autoPlay>
                    {testimonials.map(({url, tags : [name, ...content] = []}) => (
                        <div className={styles.review} key={name}>
                            <div className={styles.imgContainer} style={{
                                '--background': `url('${url}')`
                            }}>
                            </div>
                            <div className={styles.textContainer}>
                                <div className={styles.name}>{name}</div>
                                <div className={styles.rating}><div /></div>
                                <div className={styles.content}>{content.join(' ')}</div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    )
}

export default Reviews