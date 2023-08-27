import React from 'react'
import styles from './reviews.module.css'
import Carousel from '@/components/Carousel'
import img1 from './img1.jpg'
const reviews = [
    {
        img: img1,
        name: 'Gourisha Aggarwal',
        content: `The services provided by Shine Studio was up to mark.&nbsp;They were very dedicated to the work assigned, and provided good quality services during the event. The entire team was very patient, and had innovative ideas of capturing our beautiful moments.\nAlso, the album they provided were of very good quality and the video they made of our event was mesmerising. I would strongly recommend Shine Studio for capturing your beautiful moments and sew them into memories.`
    },
    {
        img: img1,
        name: 'Akanksha Sharma',
        content: `I booked them for my engagement and was so impressed by their work that I booked them for all my wedding functions. They are extremely professional and thorough with their work. I was highly impressed by the quality of their work product and their professionalism. The team was very courteous, punctual and very well organised. Definitely recommend Shine Studio to everyone.`
    },
    {
        img: img1,
        name: 'Rachit Khurana',
        content: `Shine Studio is one stop destination for top class for all your luxury wedding photography needs. They provide you with best services. Entire team of Shine studio is very talented and have a lot patience. Highly recommend!!!`
    },
    {
        img: img1,
        name: 'Monika Aggarwal',
        content: `I ordered a photo album from shine Studio. The quality is up to the mark. Overall designing, editing and printing work was done perfectly. Really appreciate their efforts. Way to go smile studio 👍👍👍`
    }
]
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