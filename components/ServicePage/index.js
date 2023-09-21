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