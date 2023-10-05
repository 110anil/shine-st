'use client'
import styles from './test.module.css'
import text from './1.png'
import front from './f.JPG'
import m from './m.JPG'
import main from './main.JPG'
import us from './us.jpg'
export default function AdminPage () {
    return (
        <div className={styles.cont} style={{
            '--text': `url('${text.src}')`,
            '--m': `url('${m.src}')`,
            '--f': `url('${front.src}')`,
            '--main': `url('${main.src}')`,
            '--us': `url('${us.src}')`,
        }}>
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    )
}