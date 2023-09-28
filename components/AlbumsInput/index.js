'use client'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import styles from './albumsInput.module.css'

const AlbumsInput = ({albumthumbnail: [albumthumbnail] = {}}) => {
    const [pin, setPin] = useState('')
    const keyRef = useRef(null)
    const currentRef = useRef(null)

    const [btnState, setBtnState] = useState(null)
    const onSubmit = () => {
        setBtnState('LOADING')
        window.location.href = `/albums/${pin.trim()}`
    }
    currentRef.current = onSubmit
    const keyFunc = useCallback((e) => {
        if (e && e.key === 'Enter') {
            currentRef.current && currentRef.current()
        }
    }, [])
    useEffect(() => {
        keyRef.current && window.removeEventListener('keydown', keyRef.current)
        keyRef.current = null
            keyRef.current = keyFunc
            window.addEventListener('keydown', keyRef.current)
        return () => {
            keyRef.current && window.removeEventListener('keydown', keyRef.current)
            keyRef.current = null
        }
    }, [])

    return (
        <>
            <div className={styles.container}>
                <div>
                    <div className={styles.title}>Albums</div>
                    <div className={styles.review}>
                        <div className={styles.imgContainer} style={{
                            '--background': `url('${albumthumbnail.url}')`
                        }}>
                        </div>
                        <div className={styles.textContainer}>
                            <div className={styles.name}>View your memories whenever you want!</div>

                            <div className={styles.field}>
                                <input placeholder='Enter your album PIN' value={pin} onChange={(e) => setPin(e.target.value)} />
                            </div>
                            <button onClick={onSubmit} disabled={!pin || (btnState === 'LOADING')}>
                                {btnState === 'LOADING' ? 'Loading...' : btnState === 'ERROR' ? 'Try Again' : 'Submit!'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AlbumsInput