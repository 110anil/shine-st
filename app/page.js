import {getData} from "@/pages/api/get-files";
import Home from '@/components/Home';
import UnderConstruction from '@/components/UnderConstruction'
let LIVE = process.env.LIVE === 'true'
export default async function HomePage() {
    if (!LIVE) {
        return <UnderConstruction />
    }
    const data = await getData()

    return <Home {...data} />
}

