'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchInput from "@/components/SearchInput";
import {useState} from 'react'
import styles from './uploadAlbums.module.css'
import AlbumsRenderer from '@/components/AlbumRenderer';
import Login from '@/components/Login';
import cs from 'classnames'
import logo from '@/images/logo.png'
import white from '@/images/white.webp'
import {upload} from "@/utils/upload";
const items = [{text: 'Home', url: '/'}, {text: 'Dashboard', url: '/dashboard'}, {text: 'Albums', url: '/albums'}, {text: 'Upload', url: '/upload-albums'}, {text: 'Find', url: '/find-albums'}, {text: 'Edit', url: '/edit-albums'}]
const leftItems = ['Contact', {name: 'Logout', onClick: () => {
        localStorage.removeItem('authToken')
        window.location.reload()
    }}]


const getFiles = async (pin) => {
        let {done, images = []} = await fetch('/api/get-files', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({pin})}).then(res => res.json())
        if (!done) {
            return Promise.reject('Something went wrong')
        }
        return Promise.resolve({duplicate: images.length > 0})
}

const uploadFilesAndUpdateTags = async (files, {title, pin}) => {
    return upload(files, {title, pin})
}

function Albums() {
    const [files, setFiles] = useState([])
    const [showPreview, setPreview] = useState(false)
    const togglePreview = (formData) => {
        if (showPreview) {
            setPreview(false)
            return
        }
        setPreview(formData)
    }
    const onSubmit = async (formData) => {
        console.log(formData)
        let {pin, title} = formData
        pin = pin.toLowerCase()
        const {duplicate} = await getFiles(pin)
        if (duplicate) {
            window.alert('This PIN already exists.')
        } else {
            // upload flow
            // await uploadFiles(formData)
            // update tags
            const f = files.filter(f => !f.deleted)
            if (f.length) {
                await uploadFilesAndUpdateTags(f, {pin, title})
            }
            setFiles([])
            alert('Album uploaded')
        }

    }
    let names = new Set()
    let numeric = true
    let duplicateNewNameFound = false
    let lastIndex = -1
    const children = <>
        {files.length > 0 && (
            <div>
                <div className={styles.title}>New Files</div>
                {files.map(file => {
                    let localNumeric = true
                    let localDuplicate = false
                    if (!/^\d+$/.test(file.key.toString())) {
                        numeric = false
                        localNumeric = false
                    }
                    if (names.has(file.key.toString())) {
                        duplicateNewNameFound = true
                        localDuplicate = true
                    } else {
                        names.add(file.key.toString())
                    }
                    const k = parseInt(file.key)
                    if (k > lastIndex) {
                        lastIndex = k
                    }
                    return (
                        <div className={cs((!localNumeric || localDuplicate) && styles.duplicateNameFile, styles.fileContainer, file.deleted && styles.deleted)} key={file.objectUrl}>
                            <div className={styles.file} style={{'--bg': `url('${file.objectUrl}')`}} />
                            <input className={styles.input} value={file.key} onChange={
                                (e) => setFiles(files.map((f, i) => ({
                                    ...f,
                                    key: f.objectUrl === file.objectUrl ? e.target.value : f.key
                                })))
                            } />
                            <div className={styles.delete} onClick={() => {
                                setFiles(files.map(f => ({
                                    ...f,
                                    deleted: file.objectUrl === f.objectUrl ? !f.deleted : f.deleted
                                })))
                            }}>{file.deleted ? 'Restore' : 'Delete'}</div>
                        </div>
                    )
                })}
                {duplicateNewNameFound && <div className={styles.duplicateName}>Duplicate names found. Names must be unique</div>}
                {!numeric && <div className={styles.duplicateName}>Names of the files must be numeric</div>}
            </div>
        )}
    </>
    const invalid = duplicateNewNameFound || !numeric
    return (
        <>
            <Header logoMap={{mainLogo: logo.src}} leftItems={leftItems} rightItems={items} showLeft={false} />
            <SearchInput
                actions={invalid || !files.length ? undefined : [
                {label: 'Preview', action: togglePreview}
            ]}
                onSubmit={invalid ? undefined : onSubmit}
                title='Upload Albums'
                submitText={'Upload'}
                subTitle={'Upload New Albums'}
                fields={[
                        {key: 'title', type: 'text', placeholder: 'Enter Album Title / Couple Name'},
                        {key: 'pin', type: 'text', placeholder: 'Enter PIN'},
                        {
                            key: 'files',
                            type: 'file',
                            placeholder: 'Select Files',
                            onChange: (e) => {
                                const f = [...e.target.files]
                                    .map((file, index) => {
                                        let [ext] = file.name.match(/\.[a-zA-Z0-9]+$/)
                                        let name = file.name.replace(/\.[a-zA-Z0-9]+$/, '')
                                        name = name.replace(/\D/g, '')
                                        name = name.length > 0 ? name : index
                                        return {ext, file, objectUrl: URL.createObjectURL(file), key: parseInt(name)}
                                    })
                                    .sort((x, y) => x.key > y.key ? 1 : -1)
                                    .map((file, index) => ({...file, key: index+ 1 + lastIndex}))
                                setFiles([...files, ...f])
                                return f
                            }
                        }
                    ]}>
                {children}
            </SearchInput>
            <div id='Contact'><Footer /></div>
            {showPreview &&
                <AlbumsRenderer
                    onClose={() => togglePreview()}
                    logoMap={{whiteLogo: white.src}}
                    title={showPreview.title}
                    images={files
                        .map(({url, objectUrl, key, deleted}) => ({url: url || objectUrl, key, deleted}))
                        .filter(({deleted}) => !deleted)
                        .sort((x, y) => x.key > y.key ? 1 : -1)
                        .map(x => x.url)
                    }
                />
            }
        </>
    )
}

export default function UploadAlbum () {
    return <Login component={Albums} />
}
// prevent duplicate pin update
// upload mode -> no delete option, just check if pin exists dont allow, if doesnt exists upload files and show success message
// edit mode -> option to delete images or add additional images. additional images default name should be "lastIndex + 1"
// edit mode -> check existingImage.name !== newImage.name => if yes error
// edit mode -> for all deleted images purge cache and deleted images
// upload