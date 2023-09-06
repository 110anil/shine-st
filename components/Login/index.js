'use client'
import React, {useEffect, useState} from 'react'
import styles from './login.module.css'
import SearchInput from "@/components/SearchInput";
import styles2 from "@/components/AlbumPageContainer/albums.module.css";
export default function Login ({component: Component}) {
    const [user, setUser] = useState(false)
    const [loading, setLoading] = useState(true)

    const getUser = (formData) => {
        setLoading(true)
        return fetch('/api/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)}).then(res => res.json())
            .then(user => {
                setLoading(false)
                if (user.done) {
                    setUser(user)
                    return user
                } else {
                    throw new Error('User Not Found')
                }

            })
    }
    const onSubmit = (formData) => {
        return getUser(formData).then(user => user.done && localStorage.setItem('authToken', user.token))
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            getUser({token})
        } else {
            setLoading(false)
        }
    }, [])

    if (loading) {
        return <div className={styles2.loaderContainer}><div className={styles2.loader} /></div>
    }
    if (user) {
        return <Component role={user.role} />
    }
    return (
        <div className={styles.container}>
                <SearchInput onSubmit={onSubmit} subTitle={'Login'} title={'Login'} submitText={'Login'} fields={[{key: 'username', placeholder: 'User Name'}, {key: 'password', placeholder: 'Password', type: 'password'}]} />
        </div>
    )
}