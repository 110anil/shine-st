import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AlbumsInput from "@/components/AlbumsInput";
import {getData} from "@/pages/api/get-files";
const items = [{text: 'Home', url: '/'}, {text: 'Albums', url: '/albums'}]
const leftItems = ['Contact']

export default async function Albums() {
    const data = await getData(['logos', 'albumthumbnail'])
    return (
        <>
            <Header logoMap={data.logoMap} leftItems={leftItems} rightItems={items} showLeft={false} />
            <AlbumsInput albumthumbnail={data.albumthumbnail} />
            <div id='Contact'><Footer /></div>
        </>
    )
}