'use client'
import styles from './home.module.css'
import Carousel from '@/components/Carousel'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Reviews from '@/components/Reviews'
import Featured from '@/components/Featured'
import Gallery from '@/components/Gallery'
import About from '@/components/About'
import ScrollSeek from "@/components/ScrollSeek"
import {useOnScreen} from "@/utils/useOnScreen";
import {useRef, useState} from "react";

let options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.7
}

export default function Home({logoMap, topimages, bottomimages, scrollframes, servicethumbnails, featured, testimonials, galleryimages, rightItems}) {
    const [active, setActive] = useState('')
    const refAbout = useRef(null)
    const featuredRef = useRef(null)
    const reviewsRef = useRef(null)
    const contactRef = useRef(null)

    const cb = (key) => () => setActive(key)
    useOnScreen(refAbout, options, cb('Services'))
    useOnScreen(featuredRef, options, cb('Recognition'))
    useOnScreen(reviewsRef, options, cb('Testimonials'))
    useOnScreen(contactRef, options, cb('Contact'))

    return (
        <>
            <Header rightItems={rightItems} activeTab={active} logoMap={logoMap} />
            <Carousel id={'banner'} showControls showBullets>
                {...[
                    //         <video className="bg-video" preload="auto" autoPlay playsInline muted={true} loop
                    //                  src="https://www.kia.com/content/dam/kia2/in/en/our-vehicles/showroom/selto-teaser/seltos-xline/Desktop_1_new.mp4">
                    //     {/*</video>, ...types.map(id => <img alt={id} src={`http://fakeimg.pl/2000x800/0079D8/fff/?text=${id}}`} key={id} />)]}*/}
                    // </video>,
                    ...topimages.map(x => <div className={styles.test} style={{
                        '--background': `url('${x.url}')`
                    }}  key={x.url} />)]}
            </Carousel>
            <div id='Services' ref={refAbout}>
                <About servicethumbnails={servicethumbnails} />
            </div>
            <ScrollSeek scrollframes={scrollframes} />
            <div id='Recognition' ref={featuredRef}><Featured featuredImages={featured} /></div>
            <Gallery images={galleryimages} />
            <div id='Testimonials' ref={reviewsRef}><Reviews testimonials={testimonials} /></div>
            <Carousel id={'banner'} showControls>
                {...[
                    //         <video className="bg-video" preload="auto" autoPlay playsInline muted={true} loop
                    //                  src="https://www.kia.com/content/dam/kia2/in/en/our-vehicles/showroom/selto-teaser/seltos-xline/Desktop_1_new.mp4">
                    //     {/*</video>, ...types.map(id => <img alt={id} src={`http://fakeimg.pl/2000x800/0079D8/fff/?text=${id}}`} key={id} />)]}*/}
                    // </video>,
                    ...bottomimages.map(x => <div className={styles.test} style={{
                        '--background': `url('${x.url}')`
                    }}  key={x.url} />)]}
            </Carousel>
            <div id='Contact' ref={contactRef}><Footer /></div>
        </>
    )
}

