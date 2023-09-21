'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchInput from "@/components/SearchInput";
import Login from "@/components/Login";
import logo from '@/images/logo.png'
const items = [{text: 'Dashboard', url: '/dashboard'}, {text: 'Albums', url: '/albums'}, {text: 'Upload', url: '/upload-albums'}, {text: 'Find', url: '/find-albums'}, {text: 'Edit', url: '/edit-albums'}, {text: 'Change Pin', url: '/change-pin'}]
const leftItems = ['Contact', {name: 'Logout', onClick: () => {
        localStorage.removeItem('authToken')
        window.location.reload()
    }}]


function ChangePin() {
    const obSubmit = (formData) => {
        return fetch('/api/change-pin', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        }).then(res => res.json()).then(dta => {
            if (!dta.done) {
                throw new Error(dta.error || 'Something went wrong')
            }
            alert('Pin Changed')
        })
    }
    return (
        <>
            <Header logoMap={{mainLogo: logo.src}} leftItems={leftItems} rightItems={items} showLeft={false} />
            <SearchInput title={'Change PIN'} subTitle={'Change PIN of existing albums'} submitText={'Change PIN'} onSubmit={obSubmit} fields={[{key: 'pin', type: 'text', placeholder: 'Enter existing PIN'}, {key: 'newPin', type: 'text', placeholder: 'Enter New PIN'}]} />
            <div id='Contact'><Footer /></div>
        </>
    )
}
export default function ChangePinPage () {
    return <Login component={ChangePin} />
}