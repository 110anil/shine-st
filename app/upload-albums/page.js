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
const items = [{text: 'Dashboard', url: '/dashboard'}, {text: 'Albums', url: '/albums'}, {text: 'Upload', url: '/upload-albums'}, {text: 'Find', url: '/find-albums'}, {text: 'Edit', url: '/edit-albums'}, {text: 'Change Pin', url: '/change-pin'}]
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

const uploadFilesAndUpdateTags = async (files, {tags, pin}) => {
    return upload(files, {tags, pin})
}

const defaultTags = [ {key: 'title', type: 'text', placeholder: 'Enter Album Title / Couple Name'}]
function Albums({PreviewComponent: PreviewComp = AlbumsRenderer, initialValue: defaultInitialValue, pinPrepend = '', tags = defaultTags, subTitle = 'Upload New Albums', title = 'Upload Albums'}) {
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
        let {pin, song} = formData
        let t = tags.map(({key}) => {
            let tag = formData[key]
            if (tag) {
                tag = tag.trim()
            }
            return tag
        }).filter(x => !!x)
        pin = pinPrepend + pin.toLowerCase()
        const {duplicate} = await getFiles(pin)
        if (duplicate) {
            window.alert('This PIN already exists.')
        } else {
            let f = files.filter(f => !f.deleted)
            if (f.length) {
                if (song) {
                    f = [...f, song]
                }
                await uploadFilesAndUpdateTags(f, {pin, tags: t})
            }
            setFiles([])
            alert('Album uploaded')
        }

    }
    let names = new Set()
    let numeric = true
    let duplicateNewNameFound = false
    let lastIndex = -1
    let numFiles = 0
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
                    if (!file.deleted) {
                        numFiles++
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
                {numFiles > 150 && <div className={styles.duplicateName}>Maximum 150 files are allowed</div>}
            </div>
        )}
    </>
    const invalid = numFiles > 150 || duplicateNewNameFound || !numeric
    let t = []
    if (showPreview) {
        t = tags.map(({key}) => {
            let tag = showPreview[key]
            if (tag) {
                tag = tag.trim()
            }
            return tag || ''
        }).filter(x => !!x)
    }

    return (
        <>
            <Header logoMap={{mainLogo: logo.src}} leftItems={leftItems} rightItems={items} showLeft={false} />
            <SearchInput
                actions={invalid || !files.length ? undefined : [
                {label: 'Preview', action: togglePreview}
            ]}
                onSubmit={invalid ? undefined : onSubmit}
                title={title}
                initialValue={defaultInitialValue}
                submitText={'Upload'}
                subTitle={subTitle}
                fields={[
                    ...tags,
                        {key: 'pin', type: 'text', placeholder: 'Enter PIN'},
                    ...(pinPrepend ? [] : [{key: 'song', type: 'song', allowReset: true, placeholder: 'Select Song', multiple: false, validator: () => true, onChange: e => {
                            const f = e.target.files[0]
                            if (f) {
                                let [ext] = f.name.match(/\.[a-zA-Z0-9]+$/)
                                return {ext, file: f, objectUrl: URL.createObjectURL(f), key: 'song'}
                            }
                            return undefined
                            }}]),
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
                <PreviewComp
                    onClose={() => togglePreview()}
                    logoMap={{whiteLogo: white.src, mainLogo: logo.src}}
                    title={showPreview.title}
                    song={(showPreview.song || {}).objectUrl}
                    images={files
                        .map(({url, objectUrl, key, deleted, ...rest}) => ({...rest, url: url || objectUrl, key, deleted, tags: t}))
                        .filter(({deleted}) => !deleted)
                        .sort((x, y) => x.key > y.key ? 1 : -1)
                    }
                />
            }
        </>
    )
}

export default function UploadAlbum ({pinPrepend, tags, title, subTitle, initialValue, PreviewComponent}) {
    const C = () => <Albums pinPrepend={pinPrepend} tags={tags} initialValue={initialValue} subTitle={subTitle} title={title} PreviewComponent={PreviewComponent} />
    return <Login component={C} />
}
// prevent duplicate pin update
// upload mode -> no delete option, just check if pin exists dont allow, if doesnt exists upload files and show success message
// edit mode -> option to delete images or add additional images. additional images default name should be "lastIndex + 1"
// edit mode -> check existingImage.name !== newImage.name => if yes error
// edit mode -> for all deleted images purge cache and deleted images
// upload