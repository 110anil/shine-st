import styles from './underConstruction.module.css'
import yt from "@/components/Footer/yt.png";
import React from "react";

const UnderConstruction = () => {
    return (
        <div className={styles.cont}>
            <div className={styles.text}>
                <div className={styles.title}>Under Construction</div>
                <div className={styles.subTitle}>
                    Site Nearly ready
                </div>
                <div className={styles.loader}>
                    <span>0%</span>
                    <span>100%</span>
                </div>
            </div>
            <div className={styles.contact}>
                <a href={'https://www.facebook.com/shinestudio.in'} target={'_blank'}>
                    <svg fill="none" width={20} height={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="facebook-brands"><path d="M24 12.073c0-6.63-5.371-12-12-12s-12 5.37-12 12c0 5.989 4.388 10.953 10.125 11.854v-8.386H7.077v-3.468h3.048V9.429c0-3.008 1.79-4.669 4.532-4.669 1.314 0 2.687.235 2.687.235v2.951H15.83c-1.49 0-1.955.925-1.955 1.874v2.253h3.328l-.532 3.468h-2.796v8.386C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"></path></svg>
                </a>
                <a href={'https://www.instagram.com/shinestudio.in/'} target={'_blank'}>
                    <svg fill="none" width={20} height={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="instagram-brands"><path d="M12.003 5.848A6.142 6.142 0 005.85 12a6.142 6.142 0 006.152 6.152A6.142 6.142 0 0018.155 12a6.142 6.142 0 00-6.152-6.152zm0 10.152c-2.2 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.8 4-4 4zM19.84 5.596c0 .798-.642 1.435-1.435 1.435a1.435 1.435 0 111.435-1.435zm4.075 1.457c-.091-1.922-.53-3.625-1.939-5.028C20.575.622 18.872.183 16.95.087c-1.981-.112-7.919-.112-9.9 0-1.917.091-3.62.53-5.027 1.933C.614 3.423.18 5.125.084 7.047c-.112 1.981-.112 7.92 0 9.9.091 1.922.53 3.625 1.939 5.028 1.408 1.403 3.105 1.842 5.027 1.938 1.981.112 7.919.112 9.9 0 1.922-.091 3.625-.53 5.027-1.938 1.403-1.403 1.842-3.106 1.939-5.028.112-1.98.112-7.913 0-9.894zm-2.56 12.02a4.049 4.049 0 01-2.28 2.28c-1.58.627-5.328.483-7.073.483-1.746 0-5.499.139-7.073-.482a4.05 4.05 0 01-2.281-2.281c-.626-1.58-.482-5.328-.482-7.073s-.14-5.499.482-7.073a4.05 4.05 0 012.28-2.28c1.58-.627 5.328-.483 7.074-.483 1.745 0 5.498-.139 7.073.482a4.05 4.05 0 012.28 2.281c.627 1.58.482 5.328.482 7.073s.145 5.499-.482 7.073z" fill="currentColor"></path></svg>
                </a>
                <a href={'https://www.youtube.com/@ShinestudioIn'} target={'_blank'}>
                    <div style={{
                        backgroundImage: `url('${yt.src}')`,
                        backgroundSize: 'contain',
                        display: 'inline-block',
                        height: '20px',
                        width: '20px',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }} height={20} width={20} />
                </a>
                | smile@shinestudio.in | 9711162526, 0129-4082526
            </div>
        </div>
    )
}
export default UnderConstruction