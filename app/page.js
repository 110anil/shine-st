import {getData} from "@/pages/api/get-files";
import Home from '@/components/Home';
export default async function HomePage() {
    const data = await getData()

    return <Home {...data} />
}

