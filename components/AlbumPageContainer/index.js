'use client'
import AlbumsRenderer from '@/components/AlbumRenderer';
import {useEffect, useState} from "react";
import { useParams } from 'next/navigation'
import styles from './albums.module.css'

export default function AlbumPage({logoMap}) {
    const [dta, setData] = useState([])
    const [state, setState] = useState('LOADING')
    const params = useParams()
    useEffect(() => {
        fetch('/api/get-files', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({pin: params.id})}).then(res => res.json()).then((data) => {
            if (data.done) {
                setData(data)
                setState('LOADED')
                return
            }
            alert('Something went wrong')
            setState('ERROR')
        }).catch((error) => {
            console.log(error)
            alert('Something went wrong')
            setState('ERROR')
        })
    }, [params.id])
    return (
        <>
            {state !== 'LOADED' && <div className={styles.loaderContainer}><div className={styles.loader} /></div>}
            {state === 'LOADED' && <AlbumsRenderer logoMap={logoMap} title={dta.title} images={dta.images} height={dta.height} width={dta.width} />}
        </>
    )
}