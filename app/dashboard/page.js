'use client'
import Header from '@/components/Header'
import styles from './dashboard.module.css'
import logo from '@/images/logo.png'
import Footer from "@/components/Footer";
import Login from "@/components/Login";
const items = [{text: 'Home', url: '/'}, {text: 'Dashboard', url: '/dashboard'}, {text: 'Albums', url: '/albums'}, {text: 'Upload', url: '/upload-albums'}, {text: 'Find', url: '/find-albums'}, {text: 'Edit', url: '/edit-albums'}]
const leftItems = ['Contact', {name: 'Logout', onClick: () => {
        localStorage.removeItem('authToken')
        window.location.reload()
    }}]


const actions = [
    {key: 'logos', text: 'Website Logos / Icons'},
    {key: 'topimages', text: 'Images in top section'},
    {key: 'servicethumbnails', text: 'Services offered'},
    {key: 'scrollframes', text: 'Scroll controlled video'},
    {key: 'scrollframes', text: 'Scroll controlled video'},
    {key: 'featured', text: 'Featured Section'},
    {key: 'galleryimages', text: 'Image Gallery'},
    {key: 'testimonials', text: 'Reviews / Testimonials'},
    {key: 'bottomimages', text: 'Images in the bottom section'},
    {key: 'albumthumbnail', text: 'Thumbnail on the Albums page'},
    {key: 'usermanagement', text: 'Update Users'}
]
function Admin() {
    return (
        <>
            <Header logoMap={{mainLogo: logo.src}} leftItems={leftItems} rightItems={items} showLeft={false} />
            <div className={styles.container}>
                <div>
                    <div className={styles.title}>Update Website</div>
                    <div className={styles.review}>
                        <div className={styles.textContainer}>
                            <div className={styles.name}>Choose a section to update</div>
                            {actions.map(({key, text}) => <a className={styles.action} href={`/edit-albums/${key}`} target='_blank' key={key}>{text}</a>)}
                        </div>
                    </div>
                </div>
            </div>
            <div id='Contact'><Footer /></div>
        </>
    )
}

export default function AdminPage () {
    return <Login component={Admin} />
}

// prevent duplicate pin update
// upload mode -> no delete option, just check if pin exists dont allow, if doesnt exists upload files and show success message
// edit mode -> option to delete images or add additional images. additional images default name should be "lastIndex + 1"
// edit mode -> check existingImage.name !== newImage.name => if yes error
// edit mode -> for all deleted images purge cache and deleted images
// upload