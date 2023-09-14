import {getData} from "@/pages/api/get-files";
import Service from '@/components/ServicePage'

export default async function ServicePage(props) {
    const {params: {id: pin}} = props
    const {logoMap, [`services/${pin}`]: images} = await getData(['logos', `services/${pin}`])
    return <Service logoMap={logoMap} images={images} />
}