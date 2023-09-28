'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchInput from "@/components/SearchInput";
import Login from "@/components/Login";
import {Fragment, useState} from "react";
import logo from '@/images/logo.png'
import styles from './findAlbums.module.css'
const items = [{text: 'Dashboard', url: '/dashboard'}, {text: 'Albums', url: '/albums'}, {text: 'Upload', url: '/upload-albums'}, {text: 'Find', url: '/find-albums'}, {text: 'Edit', url: '/edit-albums'}, {text: 'Change Pin', url: '/change-pin'}]
const leftItems = ['Contact', {name: 'Logout', onClick: () => {
        localStorage.removeItem('authToken')
        window.location.reload()
    }}]


function FindAlbum() {
    const [data, setData] = useState([])
    const obSubmit = (formData) => {
        return fetch('/api/find-album', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        }).then(res => res.json()).then(dta => {
            if (!dta.done) {
                throw new Error('Something went wrong')
            }
            setData(dta.result)
        })
    }
    return (
        <>
            <Header logoMap={{mainLogo: logo.src}} leftItems={leftItems} rightItems={items} showLeft={false} />
            <SearchInput keyboard onSubmit={obSubmit} fields={[{key: 'title', type: 'text', placeholder: 'Enter Album Title / Couple Name'}]}>
                {data.length > 0 && (
                    <div className={styles.table}>
                            <div>Album Title</div>
                            <div>Pin</div>
                        <div>Actions</div>
                        {data.map(item => {
                            return (
                                <Fragment key={item.pin}>
                                    <div>{item.title}</div>
                                    <div>{item.pin}</div>
                                    <div><a href={`/edit-albums/${item.pin.toLowerCase()}`} target='_blank'>Edit</a><a href={item.url} target='_blank'>View</a></div>
                                </Fragment>
                            )
                        })}
                    </div>
                )}
            </SearchInput>
            <div id='Contact'><Footer /></div>
        </>
    )
}
export default function FindAlbumPage () {
    return <Login component={FindAlbum} />
}