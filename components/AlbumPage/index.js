import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AlbumsInput from "@/components/AlbumsInput";
const items = [{text: 'Home', url: '/'}, {text: 'Albums', url: '/albums'}]
const leftItems = ['Contact']

export default function Albums({logoMap, albumthumbnail, rightItems = []}) {
    return (
        <>
            <Header logoMap={logoMap} leftItems={leftItems} rightItems={[...items, ...rightItems]} showLeft={false} />
            <AlbumsInput albumthumbnail={albumthumbnail} />
            <div id='Contact'><Footer /></div>
        </>
    )
}