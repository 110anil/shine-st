import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AlbumsInput from "@/components/AlbumsInput";
const items = [{text: 'Home', url: '/'}, {text: 'Albums', url: '/albums'}]
const leftItems = ['Contact']

export default function Albums() {
    return (
        <>
            <Header leftItems={leftItems} rightItems={items} showLeft={false} />
            <AlbumsInput />
            <div id='Contact'><Footer /></div>
        </>
    )
}