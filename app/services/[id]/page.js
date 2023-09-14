import {getData} from "@/pages/api/get-files";
import Header from "@/components/Header";
import Gallery from "@/components/ServiceGallery";
import Footer from "@/components/Footer";
import CarouselImage from "@/components/Carouselmage";

const tagParser = ([, title, x, y] = []) => {
    const locations = ['left', 'right', 'top', 'bottom', 'center', 'middle']
    let description = x
    let location = 'right'
    if (locations.includes(x)) {
        description = undefined
        location = x
    } else if (locations.includes(y)) {
        location = y
    }
    return {title, description, location}
}
export default async function AlbumPage(props) {
    const {params: {id: pin}} = props
    const {logoMap, [`services/${pin}`]: images} = await getData(['logos', `services/${pin}`])

    const [carouselImage, ...galleryImages] = images || []
    return (
        <>
            <Header logoMap={logoMap} leftItems={['Contact']} rightItems={[{text: 'Home', url: '/'}, {text: 'Albums', url: '/albums'}]} />
            {carouselImage && <CarouselImage data={carouselImage} tagParser={tagParser} />}
            <Gallery images={galleryImages} />
            <div id='Contact'><Footer /></div>
        </>
    )
}