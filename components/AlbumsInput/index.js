'use client'
import React, {useState} from 'react'
import styles from './albumsInput.module.css'
const AlbumsInput = ({albumThumbnail: [albumThumbnail] = {}}) => {
    const [pin, setPin] = useState('')
    const [btnState, setBtnState] = useState(null)
    const onSubmit = () => {
        setBtnState('LOADING')
        window.location.href = `/albums/${pin}`
    }
    return (
        <>
            <div className={styles.container}>
                <div>
                    <div className={styles.title}>Albums</div>
                    <div className={styles.review}>
                        <div className={styles.imgContainer} style={{
                            '--background': `url('${albumThumbnail.url}')`
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