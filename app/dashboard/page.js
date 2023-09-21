'use client'
import Header from '@/components/Header'
import styles from './dashboard.module.css'
import logo from '@/images/logo.png'
import Footer from "@/components/Footer";
import Login from "@/components/Login";
const items = [{text: 'Dashboard', url: '/dashboard'}, {text: 'Albums', url: '/albums'}, {text: 'Upload', url: '/upload-albums'}, {text: 'Find', url: '/find-albums'}, {text: 'Edit', url: '/edit-albums'}, {text: 'Change Pin', url: '/change-pin'}]
const leftItems = ['Contact', {name: 'Logout', onClick: () => {
        localStorage.removeItem('authToken')
        window.location.reload()
    }}]


const defaultActions = [
    {key: 'logos', text: 'Website Logos / Icons'},
    {key: 'topimages', text: 'Images in top section'},
    {key: 'servicethumbnails', text: 'Service Thumbnails'},
    {key: 'services', url: '/dashboard/services', text: 'Service Page Images'},
    {key: 'scrollframes', text: 'Scroll controlled video'},
    {key: 'featured', text: 'Featured Section'},
    {key: 'galleryimages', text: 'Image Gallery'},
    {key: 'testimonials', text: 'Reviews / Testimonials'},
    {key: 'bottomimages', text: 'Images in the bottom section'},
    {key: 'albumthumbnail', text: 'Thumbnail on the Albums page'},
    {key: 'usermanagement', text: 'Update Users'}
]
function Admin({actions = defaultActions, title = 'Update Website', subTitle = 'Choose a section to update'}) {
    return (
        <>
            <Header logoMap={{mainLogo: logo.src}} leftItems={leftItems} rightItems={items} showLeft={false} />
            <div className={styles.container}>
                <div>
                    <div className={styles.title}>{title}</div>
                    <div>
                        <div className={styles.textContainer}>
                            <div className={styles.name}>{subTitle}</div>
                            {actions.map(({key, text, url}) => <a className={styles.action} href={url || `/edit-albums/${key}`} target='_blank' key={key}>{text}</a>)}
                        </div>
                    </div>
                </div>
            </div>
            <div id='Contact'><Footer /></div>
        </>
    )
}

export default function AdminPage ({actions, subTitle, title}) {
    const comp = () => <Admin actions={actions} title={title} subTitle={subTitle} />
    return <Login component={comp} />
}

// prevent duplicate pin update
// upload mode -> no delete option, just check if pin exists dont allow, if doesnt exists upload files and show success message
// edit mode -> option to delete images or add additional images. additional images default name should be "lastIndex + 1"
// edit mode -> check existingImage.name !== newImage.name => if yes error
// edit mode -> for all deleted images purge cache and deleted images
// upload