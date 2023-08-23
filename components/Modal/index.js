import React from 'react'
import styles from './modal.module.css'
const Modal = ({children}) => {
    return (
        <div className={styles.container}>{children}</div>
    )
}

export default Modal