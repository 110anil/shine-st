'use client'
import styles from './page.module.css'
import Carousel from '../components/Carousel'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Reviews from '../components/Reviews'
import Featured from '../components/Featured'
import Gallery from '../components/Gallery'
import About from '../components/About'
import ScrollSeek from "@/components/ScrollSeek"
import car from '../images/car.gif'
import {useOnScreen} from "@/utils/useOnScreen";
import {useRef, useState} from "react";

const types = [ 'Without', 'JavaScript', 'Carousel']
let options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.7
}
export default function Home() {
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
          <Header activeTab={active} />
          <Carousel id={'banner'} showControls showBullets>
              {...[
          //         <video className="bg-video" preload="auto" autoPlay playsInline muted={true} loop
          //                  src="https://www.kia.com/content/dam/kia2/in/en/our-vehicles/showroom/selto-teaser/seltos-xline/Desktop_1_new.mp4">
          //     {/*</video>, ...types.map(id => <img alt={id} src={`http://fakeimg.pl/2000x800/0079D8/fff/?text=${id}}`} key={id} />)]}*/}
          // </video>,
                  <div className={styles.test} style={{
                  '--background': `url('${car.src}')`
              }} key='car' />, ...types.map(id => <div className={styles.test} style={{
              '--background': `url('http://fakeimg.pl/2000x800/0079D8/fff/?text=${id}')`
              }}  key={id} />)]}
          </Carousel>
          <div id='Services' ref={refAbout}>
              <About />
          </div>
          <ScrollSeek />
          <div id='Recognition' ref={featuredRef}><Featured /></div>
          <Gallery />
          <div id='Testimonials' ref={reviewsRef}><Reviews /></div>
          <Carousel id={'banner'} showControls>
              {...[
                  //         <video className="bg-video" preload="auto" autoPlay playsInline muted={true} loop
                  //                  src="https://www.kia.com/content/dam/kia2/in/en/our-vehicles/showroom/selto-teaser/seltos-xline/Desktop_1_new.mp4">
                  //     {/*</video>, ...types.map(id => <img alt={id} src={`http://fakeimg.pl/2000x800/0079D8/fff/?text=${id}}`} key={id} />)]}*/}
                  // </video>,
                  <div className={styles.test} style={{
                      '--background': `url('${car.src}')`
                  }} key='car' />, ...types.map(id => <div className={styles.test} style={{
                      '--background': `url('http://fakeimg.pl/2000x800/0079D8/fff/?text=${id}')`
                  }}  key={id} />)]}
          </Carousel>
          <div id='Contact' ref={contactRef}><Footer /></div>
      </>
  )
}