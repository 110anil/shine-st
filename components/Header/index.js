'use client'
import React from 'react'
import styles from './header.module.css'
import {usePathname} from 'next/navigation'
const defaultLeft = ['Services', 'Recognition', 'Testimonials', 'Contact']
const defaultItems = [{text: 'Albums', url: '/albums'}]
import cs from 'classnames'
const HEader = ({leftItems = defaultLeft, rightItems = defaultItems, activeTab = '', logoMap}) => {
    const pathname = usePathname()
    const handleClick = (e, url) => {
        e.preventDefault()
        window.location.href = url
    }
    return (
            <header className={styles.header}>
                <div className={styles.logoContainer} onClick={() => {
                    window.location.href = '/'
                }}>
                    <div><span style={{
                        '--bg': `url('${logoMap.mainLogo}')`
                    }} /></div>
                </div>
                <div className={styles.headerContainer}>
                        <ul className={styles.leftContainer}>
                            {leftItems.map((item, index) => {
                                let name = item
                                let onClick = (() => {
                                    document.getElementById(item).scrollIntoView({behavior: "smooth"})
                                })
                                if (typeof item !== 'string') {
                                    name = item.name
                                    onClick = item.onClick
                                }
                                return (
                                    <li onClick={onClick} className={cs(styles.li,name === activeTab && styles.liActive)} key={name}>{name}</li>
                                )
                            })}
                        </ul>
                    <ul className={styles.rightContainer}>
                        {rightItems.map(({text, url, onClick: oC}, index) => {
                            const onClick = oC || ((e) => handleClick(e, url))
                            return (
                                <li className={cs(styles.li,pathname === url && styles.liActive)} onClick={onClick} key={text}>{text}</li>
                            )
                        })}
                    </ul>
                    {pathname !== '/albums' && <div className={styles.album} onClick={() => {
                        window.location.href = '/albums'
                    }} />}
                </div>
            </header>
    )
}
export default HEader