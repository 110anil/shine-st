'use client'
import Dashboard from '../page'
import {useEffect, useState} from "react";
import Loader from '@/components/Loader'
export default function ServiceList () {
    const [data, setData] = useState(null)
    useEffect(() => {
        fetch('/api/find-services', {method: 'POST', headers: {'Content-Type': 'application/json'}}).then(res => res.json())
            .then(data => {
                if (data.done && data.result && data.result.length) {
                    setData(data.result)
                    return
                }
                throw new Error('Something went wrong')
            })
            .catch((e) => alert(e.message))
    }, [])
    if (!data) {
        return  <Loader />
    }
    return <Dashboard actions={data} title={'Edit Service Page Images'} subTitle={'Choose a service to update'} />
}