'use client'
import React, {useState} from 'react'
import styles from './searchInput.module.css'
import cs from 'classnames'
const defaultValidator = (formData, fields) => {
    return fields.filter(({key, validator}) => {
        return validator ? !validator(formData) : !formData[key]
    }).length === 0
}

const AlbumsInput = ({actions = [], initialValue = {}, title = 'Find Your Albums', subTitle = 'Find Your Albums', submitText = 'Find It', children, onSubmit, fields = [], validator = defaultValidator}) => {
    const [formData, setData] = useState(initialValue)
    const setFormData = (key, value) => {
        setData({...formData, [key]: value})
    }
    const [btnState, setBtnState] = useState(null)
    const submit = () => {
        setBtnState('LOADING')
        onSubmit(formData).then(() => setBtnState(null)).catch((e) => {
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
                    <div className={styles.review}>
                        <div className={styles.textContainer}>
                            <div className={styles.name}>{subTitle}</div>

                            {fields.map(({type = 'text', key, value: val, placeholder, onChange, disabled = false}) => {
                                switch (type) {
                                    case 'text':
                                    case 'password':
                                        return (
                                            <div className={styles.field} key={key}>
                                                <input type={type} disabled={disabled} placeholder={placeholder} value={val !== undefined ? val : formData[key]} onChange={(e) => setFormData(key, e.target.value)} />
                                            </div>
                                        )
                                    case 'file':
                                        return (
                                            <div className={styles.field} key={key}>
                                                <input className={styles.fileInput} onChange={e => {
                                                    const files = onChange(e)
                                                    setFormData(key, files)
                                                }} id={key} type='file' placeholder={placeholder} multiple />
                                                <label htmlFor={key}>{placeholder}</label>
                                            </div>

                                        )
                                }
                            })}
                            <button className={cs(btnState === 'LOADING' && styles.loading)} onClick={submit} disabled={!validator(formData, fields) || (btnState === 'LOADING')}>
                                {btnState === 'LOADING' ? 'Loading...' : btnState === 'ERROR' ? 'Try Again' : submitText}
                            </button>
                            {actions.map(item => (
                                <button key={item.label} onClick={() => item.action(formData)} disabled={item.disabled}>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {children && (
                        <div className={styles.review}>
                            <div className={styles.textContainer}>
                                {children}

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default AlbumsInput