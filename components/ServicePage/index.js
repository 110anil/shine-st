import Header from "@/components/Header";
import Gallery from "@/components/ServiceGallery";
import Footer from "@/components/Footer";
import CarouselImage from "@/components/Carouselmage";

const tagParser = ([, title, x, y, z] = []) => {
    const locations = ['left', 'right', 'top', 'bottom', 'center', 'middle']
    let description = x
    let location = 'right'
    let bgLeft = 50
    if (locations.includes(x)) {
        description = undefined
        location = x
        if (!isNaN(y)) {
            bgLeft = y
        }
    } else if (locations.includes(y)) {
        location = y
        if (!isNaN(z)) {
            bgLeft = z
        }
    }
    return {title, description, location, bgLeft}
}
export default function AlbumPage(props) {
    const {logoMap, images, onClose, preview} = props
    const close = {text: 'Close Preview', onClick: onClose}
    let rightItems = [{text: 'Albums', url: '/albums'}]
    if (onClose) {
        rightItems = [...rightItems, close]
    }
    const [carouselImage, ...galleryImages] = images || []
    return (
        <>
            <Header logoMap={logoMap} leftItems={['Contact']} rightItems={rightItems} />
            {carouselImage && <CarouselImage data={carouselImage} tagParser={tagParser} />}
            <Gallery preview={preview} images={galleryImages} />
            <div id='Contact'><Footer /></div>
        </>
    )
}