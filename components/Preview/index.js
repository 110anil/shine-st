'use client'
import Home from '@/components/Home'
import React, {useEffect, useState} from "react";
import styles from './preview.module.css'
import Loader from "@/components/Loader";
export default function Preview ({modifiedData, keys, component: Component = Home, onClose}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    const getData = () => {
        setLoading(true)
        return fetch('/api/get-home-data', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({keys})}).then(res => res.json())
            .then(data => {
                setLoading(false)
                if (data.done) {
                    setData(data.data)
                    return data
                } else {
                    throw new Error('Couldnt load data')
                }
            })
    }

    useEffect(() => {
        getData()
    }, [])

    if (loading) {
        return <Loader />
    }

    return (
        <div className={styles.container}>
            <Component {...data} {...modifiedData} onClose={onClose} />
        </div>
    )
}