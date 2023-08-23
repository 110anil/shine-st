import AlbumsRenderer from '@/components/AlbumRenderer';
const data = {title: 'Sachin & Monika', images: [
        "http://www.shinestudio.in/wp-content/uploads/2023/08/c-01-24.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/01-32.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/02-32.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/03-31.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/04-29.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/05-32.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/06-31.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/07-32.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/08-32.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/09-31.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/010-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/011-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/012-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/013-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/014-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/015-24.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/016-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/017-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/018-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/019-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/020-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/021-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/022-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/023-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/024-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/025-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/026-25.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/027-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/028-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/029-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/030-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/031-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/032-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/033-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/034-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/035-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/036-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/037-23.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/038-22.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/039-22.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/040-19.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/041-14.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/042-10.jpg",
        "http://www.shinestudio.in/wp-content/uploads/2023/08/043-8.jpg"
    ]}
export default function AlbumPage() {
    return (
        <>
            <AlbumsRenderer title={data.title} images={data.images} />
        </>
    )
}