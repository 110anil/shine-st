'use client'
import React, {useState} from 'react'
import styles from './searchInput.module.css'
import cs from 'classnames'
const defaultValidator = (formData, fields) => {
    return fields.filter(({key, validator}) => {
        return validator ? !validator(formData) : !formData[key]
    }).length === 0
}

const PlaySong = ({objectUrl, onChange,  url = objectUrl}) => {
    const [play, setPlay] = useState(false)
    return <div className={styles.musicCont}>
        <div onClick={() => setPlay(!play)} className={cs(styles.music, play ? styles.play : styles.pause)}><span />Play / Pause Selected Song
            {play && <audio controls autoPlay loop>
                <source src={url} type="audio/mpeg" />
            </audio>}
        </div>
        <div className={styles.delete} onClick={() => onChange()}>Delete</div>
    </div>
}

const AlbumsInput = ({actions = [], initialValue = {}, title = 'Find Your Albums', subTitle = 'Find Your Albums', submitText = 'Find It', children, onSubmit, fields = [], validator = defaultValidator}) => {
    const [formData, setData] = useState(initialValue)
    const setFormData = (key, value) => {
        setData({...formData, [key]: value})
    }
    const [btnState, setBtnState] = useState(null)
    const submit = () => {
        setBtnState('LOADING')
        const dta = {...formData}
        fields.forEach(({key, type}) => ['text', 'password'].includes(type) && dta[key] !== undefined && (dta[key] = dta[key].trim()))
        onSubmit(dta).then(() => setBtnState(null)).catch((e) => {
            setBtnState('ERROR')
            console.log(e)
            alert(e.message || 'Something went wrong')
        })
    }
    return (
        <>
            <div className={styles.container}>
                <div>
                    <div className={styles.title}>{title}</div>
                        <div className={styles.textContainer}>
                            <div className={styles.name}>{subTitle}</div>

                            {fields.map(({multiple = true, options = [], type = 'text', key, value: val, placeholder, onChange, disabled = false}) => {
                                switch (type) {
                                    case 'text':
                                    case 'password':
                                        return (
                                            <div className={styles.field} key={key}>
                                                <input type={type} disabled={disabled} placeholder={placeholder} value={val !== undefined ? val : formData[key]} onChange={(e) => setFormData(key, e.target.value)} />
                                            </div>
                                        )
                                    case 'radio':
                                        return (
                                            <div className={styles.radioField} key={key}>
                                                <label>{placeholder}</label>
                                                <ul>
                                                    {options.map(({key: k, text}) => <li key={k} className={cs(k === formData[key] && styles.radioSelected)} onClick={() => setFormData(key, k)}>{text || k}</li>)}
                                                </ul>
                                            </div>
                                        )
                                    case 'song':
                                        return (
                                            <div className={styles.field} key={key}>
                                                <input className={styles.fileInput} onChange={e => {
                                                    const file = onChange(e)
                                                    setFormData(key, file)
                                                }} id={key} type='file' accept="audio/*" placeholder={placeholder} multiple={multiple} />
                                                <label htmlFor={key}>{placeholder}</label>
                                                {formData[key] && <PlaySong onChange={(e) => {
                                                    setFormData(key, undefined)
                                                    e.target.files = undefined
                                                }} {...formData[key]} />}
                                            </div>

                                        )
                                    case 'file':
                                        return (
                                            <div className={styles.field} key={key}>
                                                <input className={styles.fileInput} onChange={e => {
                                                    const files = onChange(e)
                                                    setFormData(key, files)
                                                }} id={key} type='file'  accept="image/*, video/*" placeholder={placeholder} multiple={multiple} />
                                                <label htmlFor={key}>{placeholder}</label>
                                            </div>

                                        )
                                }
                            })}
                            <button className={cs(btnState === 'LOADING' && styles.loading)} onClick={submit} disabled={(!validator(formData, fields) || (btnState === 'LOADING') || !onSubmit)}>
                                {btnState === 'LOADING' ? 'Loading...' : btnState === 'ERROR' ? 'Try Again' : submitText}
                            </button>
                            {actions.map(item => (
                                <button key={item.label} onClick={() => item.action(formData)} disabled={item.disabled}>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    {children && (
                            <div className={styles.textContainer}>
                                {children}
                            </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default AlbumsInput