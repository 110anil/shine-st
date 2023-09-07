import AlbumPage from "@/components/AlbumPage";
import {getData} from "@/pages/api/get-files";

export default async function Albums() {
    const data = await getData(['logos', 'albumthumbnail'])
    return (
            <AlbumPage {...data} />
    )
}