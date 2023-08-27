import AlbumPageContainer from '@/components/AlbumPageContainer';
import {getData} from "@/pages/api/get-files";

export default async function AlbumPage() {
        const data = await getData(['logos'])
        return (<AlbumPageContainer logoMap={data.logoMap} />)
}