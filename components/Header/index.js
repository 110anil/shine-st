'use client'
import React from 'react'
import styles from './header.module.css'
import logo from '../../images/logo.png'
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
                <div className={styles.logoContainer}>
                    <div><span style={{
                        '--bg': `url('${logoMap.mainLogo}')`
                    }} /></div>
                </div>
                <div className={styles.headerContainer}>
                        <ul className={styles.leftContainer}>
                            {leftItems.map((item, index) => {
                                return (
                                    <li onClick={() => {
                                        document.getElementById(item).scrollIntoView({behavior: "smooth"})
                                    }} className={cs(styles.li,item === activeTab && styles.liActive)} key={item}>{item}</li>
                                )
                            })}
                        </ul>
                    <ul className={styles.rightContainer}>
                        {rightItems.map(({text, url}, index) => {
                            return (
                                <li className={cs(styles.li,pathname === url && styles.liActive)} onClick={(e) => handleClick(e, url)} key={text}>{text}</li>
                            )
                        })}
                    </ul>
                </div>
            </header>
    )
}
export default HEader