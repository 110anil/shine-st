'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchInput from "@/components/SearchInput";
import {useEffect, useState} from 'react'
import styles from './uploadAlbums.module.css'
import styles2 from '@/components/AlbumPageContainer/albums.module.css'
import AlbumsRenderer from '@/components/AlbumRenderer';
import cs from 'classnames'
import logo from '@/images/logo.png'
import white from '@/images/white.webp'
import {upload} from "@/utils/upload";
import { useParams } from 'next/navigation'
const items = [{text: 'Home', url: '/'}, {text: 'Albums', url: '/albums'}, {text: 'Upload', url: '/upload-albums'}, {text: 'Find', url: '/find-albums'}, {text: 'Edit', url: '/edit-albums'}]
const leftItems = ['Contact']

// logoMap, topimages, bottomimages, scrollframes, servicethumbnails, featured, testimonials, galleryimages
const specialItems = {
    featured: {}, // nothing required
    galleryimages: {}, // nothing required
    testimonials: {tags: [{key: 'name', required: true}, {key: 'description', required: true}], parse: ([name, ...description]) => {
            return {name, description: description.join('')}
        }}, // required 2 tags: name, description. parser and deParser required
    servicethumbnails: {tags: [{key: 'service', required: true}]}, // required 1 tag
    scrollframes: {}, // nothing required
    bottomimages: {tags: [{key: 'title', required: false}]}, // optional tag
    topimages: {tags: [{key: 'title', required: false}]}, // optional tag
    logos: {tags: [{key: 'title', required: true}]} // required 1 tag
}

const unParse = (item, pin) => {
    let {tags = []} = specialItems[pin] || {}
    return {
        ...item,
        newTags: tags.reduce((res, {key}) => {
            if (item.tempTags[key]) {
                res.push(item.tempTags[key])
            }
            return res
        }, [])
    }
}

const getFiles = async (pin) => {
        let {done, images = [], ...dta} = await fetch('/api/get-files', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({pin, meta: true})}).then(res => res.json())
        if (!done) {
            return Promise.reject('Something went wrong')
        }
    let specialItem = false
    if (pin && specialItems[pin]) {
        specialItem = specialItems[pin]
    }
    const {tags: specialTags = [], parse = (tags = []) => {
        return specialTags.reduce((res, item, index) => {
            if (tags[index]) {
                res[item.key] = tags[index]
            }
            return res
        }, {})
    }} = specialItem || {}

    images = images.map(x => {
        const name = x.url.match(/\/[\w\s\.\-]+\.[a-zA-Z0-9]+$/)[0].replace('/', '')
        const splits = name.split('.')
        const ext = `.${splits.slice(-1)[0]}`
        const key = parseInt(splits.slice(0, splits.length - 1).join('.'))

        return {url:x.url, fileId: x.id, originalKey: key.toString(), key, ext, deleted: false, tempTags: parse(x.tags)}
    })
        return Promise.resolve({pin, images, ...dta})
}

export default function Edit() {
    const [files, setFiles] = useState([])
    const [existingData, setExistingData] = useState(null)
    const [showPreview, setPreview] = useState(false)
    let {pin: urlPin} = useParams()
    if (urlPin) {
        urlPin = urlPin.toLowerCase()
    }
    let specialItem = false
    if (existingData && existingData.pin && specialItems[existingData.pin]) {
        specialItem = specialItems[existingData.pin]
    }

    const {tags: specialTags = []} = specialItem || {}

    const togglePreview = (formData) => {
        if (showPreview) {
            setPreview(false)
            return
        }
        setPreview(formData)
    }
    const findAlbum = async (formData) => {
        let {pin} = formData
        pin = pin.toLowerCase()
        setExistingData(null)
        setFiles([])
        const exData = await getFiles(pin)
        if (!exData.images || !exData.images.length) {
            alert('Album Not Found')
            return
        }
        setExistingData(exData)
    }

    useEffect(() => {
        if (urlPin) {
            findAlbum({pin: urlPin})
        }
    }, [urlPin])

    const deleteFiles = (files, purge = true) => {
        return fetch('/api/delete-files', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({files, purge})}).then(res => res.json())
    }

    const renameFilesAndPurgeCache = (files, existingKeys) => {
        return fetch('/api/rename-files', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({files, existingKeys})}).then(res => res.json())
    }

    const uploadFilesAndUpdateTags = async (files, {title, pin}) => {
        return upload(files, {title, pin})
    }



    const updateTitleOnOldFiles = (fileIds, {tags, oldTags}) => {
        return fetch('/api/change-title', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({fileIds, tags, oldTags})}).then(res => res.json())
    }

    const updateTags = (files) => {
        return fetch('/api/change-tags', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({files})}).then(res => res.json())
    }

    const onSubmit = async (formData) => {
        let {title} = formData
        let {images, pin} = existingData
        pin = pin.toLowerCase()
        let imagesToDelete = images.filter(x => x.deleted)
        if (imagesToDelete.length) {
            await deleteFiles(imagesToDelete)
        }

        const existingKeys = images.reduce((res, item) => {
            res[item.originalKey] = true
            return res
        }, {})
        let imagesToRename = images.filter(x => x.originalKey.toString() !== x.key.toString())
        if (imagesToRename.length) {
            await renameFilesAndPurgeCache(imagesToRename, existingKeys)
        }

        let f = files.filter(x => !x.deleted)

        if (f.length) {
            await uploadFilesAndUpdateTags(f.filter(x => !x.deleted).map(x => unParse(x, pin)), {title, pin})
        }

        const unchangedFiles = images.filter(x => !x.deleted)

        if (!specialItem && unchangedFiles.length && title !== existingData.title) {
                await updateTitleOnOldFiles(unchangedFiles.map(x => x.fileId), {tags: [title], oldTags: existingData.title ? [existingData.title] : undefined})
        } else if (specialItem) {
            const f = unchangedFiles.map(x => unParse(x, pin)).filter(x => (x.newTags || []).length > 0)
            if (f.length) {
                await updateTags(f)
            }
        }

        setFiles([])
        await findAlbum({pin})
        alert('Album Updated')
    }
    let names = new Set()
    let numeric = true
    let duplicateNewNameFound = false
    let lastIndex = -1
    const children = <>
        {existingData && (
            <div>
                <div className={styles.title}>Existing Files</div>
                {existingData.images.map(({url, key, deleted, tempTags = {}}) => {
                    let localNumeric = true
                    let localDuplicate = false
                    if (!deleted) {

                        if (!/^\d+$/.test(key.toString())) {
                            numeric = false
                            localNumeric = false
                        }
                        if (names.has(key.toString())) {
                            duplicateNewNameFound = true
                            localDuplicate = true
                        } else {
                            names.add(key.toString())
                        }
                        const k = parseInt(key)
                        if (k > lastIndex) {
                            lastIndex = k
                        }
                    }
                    return (
                        <div className={cs((!localNumeric || localDuplicate) && styles.duplicateNameFile, styles.fileContainer, deleted && styles.deleted)} key={url}>
                            <div className={styles.file} style={{'--bg': `url('${url}')`}} />
                            <input className={styles.input} value={key} onChange={
                                (e) => {
                                    setExistingData({
                                        ...existingData,
                                        images: existingData.images.map((f) => {
                                            return {
                                                ...f,
                                                key: url === f.url ? e.target.value : f.key
                                            }
                                        })
                                    })
                                }
                            } />
                            {specialTags.map(({key}) => <input placeholder={key} key={key} className={styles.input} value={tempTags[key] || ''} onChange={e => {
                                setExistingData({
                                    ...existingData,
                                    images: existingData.images.map((f) => {
                                        return {
                                            ...f,
                                            tempTags: url === f.url ? {
                                                ...(f.tempTags || {}),
                                                [key]: e.target.value
                                            } : f.tempTags
                                        }
                                    })
                                })
                            }} />)}
                            <div className={styles.delete} onClick={() => {
                                setExistingData({...existingData, images: existingData.images.map(f => ({...f, deleted: url === f.url ? !f.deleted : f.deleted}))})
                            }}>{deleted ? 'Restore' : 'Delete'}</div>
                        </div>
                    )
                })}
            </div>
        )}
        {files.length > 0 && (
            <div>
                <div className={styles.title}>New Files</div>
                {files.map(file => {
                    let localNumeric = true
                    let localDuplicate = false
                    const tempTags = file.tempTags || {}
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
                            {specialTags.map(({key}) => <input key={key} placeholder={key} className={styles.input} value={tempTags[key] || ''} onChange={e => {
                                setExistingData({
                                    ...existingData,
                                    images: files.map((f) => {
                                        return {
                                            ...f,
                                            tempTags: file.objectUrl === f.url ? {
                                                ...(f.tempTags || {}),
                                                [key]: e.target.value
                                            } : f.tempTags
                                        }
                                    })
                                })
                            }} />)}
                            <div className={styles.delete} onClick={() => {
                                setFiles(files.map(f => ({
                                    ...f,
                                    deleted: file.objectUrl === f.objectUrl ? !f.deleted : f.deleted
                                })))
                            }}>{file.deleted ? 'Restore' : 'Delete'}</div>
                        </div>
                    )
                })}
            </div>
        )}
        {duplicateNewNameFound && <div className={styles.duplicateName}>Duplicate names found. Names must be unique</div>}
        {!numeric && <div className={styles.duplicateName}>Names of the files must be numeric</div>}
    </>
    const invalid = duplicateNewNameFound || !numeric
    return (
        <>
            <Header logoMap={{mainLogo: logo.src}} leftItems={leftItems} rightItems={items} showLeft={false} />
            {urlPin && !existingData }
            {urlPin && !existingData && <div className={styles2.loaderContainer}><div className={styles2.loader} /></div>}
            {!urlPin && <SearchInput
                onSubmit={findAlbum}
                title='Edit Albums' subTitle={'Find Albums'} fields={[{key: 'pin', type: 'text', placeholder: 'Enter PIN'}]} />}
            {existingData && (
                <SearchInput actions={invalid ? undefined : [{label: 'Preview', action: togglePreview}]}
                             onSubmit={invalid ? undefined : onSubmit}
                             submitText={'Update Album'}
                             initialValue={{title: existingData.title}}
                             title='' subTitle={'Edit Albums'} fields={[...(!specialItem ? [{key: 'title', type: 'text', placeholder: 'Enter Album Title / Couple Name'}] : []), {key: 'files', type: 'file', placeholder: 'Select Files', validator: () => true, onChange: (e) => {
                        const f = [...e.target.files].map((file, index) => {
                            let [ext] = file.name.match(/\.[a-zA-Z0-9]+$/)
                            let name = file.name.replace(/\.[a-zA-Z0-9]+$/, '')
                            name = name.replace(/\D/g, '')
                            name = name.length > 0 ? name : index
                            return {ext, file, objectUrl: URL.createObjectURL(file), key: parseInt(name)}
                        }).sort((x, y) => x.key > y.key ? 1 : -1).map((file, index) => ({...file, key: index + 1 + lastIndex}))
                        setFiles([...files, ...f])
                        return f
                    }}]}>{children}</SearchInput>
            )}
            <div id='Contact'><Footer /></div>
            {showPreview && <AlbumsRenderer onClose={() => togglePreview()} logoMap={{whiteLogo: white.src}} title={showPreview.title} images={[...((existingData || {}).images || []), ...files].map(({url, objectUrl, key, deleted}) => ({url: url || objectUrl, key, deleted})).filter(x => !x.deleted).sort((x, y) => x.key > y.key ? 1 : -1).map(x => x.url)} />}
        </>
    )
}
