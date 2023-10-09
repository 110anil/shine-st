'use client'
import AlbumsRenderer from '@/components/AlbumRenderer';
import {useEffect, useState} from "react";
import { useParams } from 'next/navigation'
import Loader from '@/components/Loader'

export default function AlbumPage({logoMap}) {
    const [dta, setData] = useState({})
    const [state, setState] = useState('LOADING')
    const [loaded, setLoaded] = useState(false)
    const params = useParams()
    useEffect(() => {
        fetch('/api/get-files', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({pin: params.id})}).then(res => res.json()).then((data) => {
            if (data.done && data.images && data.images.length) {
                setData(data)
                setState('LOADED')
                return
            }
            alert('Album not found')
            setState('ERROR')
        }).catch((error) => {
            console.log(error)
            alert('Something went wrong')
            setState('ERROR')
        })
    }, [params.id])
    useEffect(() => {
        import('@/components/AlbumCarousel2/turn/jquery.min.1.7').then(() => import('@/components/AlbumCarousel2/turn/turn.min')).then(() => setLoaded(true))
    }, [])
    return (
        <>
            {state !== 'LOADED' || !loaded && <Loader />}
            {state === 'LOADED' && <AlbumsRenderer logoMap={logoMap} title={dta.tags[0]} images={dta.images} song={dta.song} height={dta.height} width={dta.width} />}
        </>
    )
}