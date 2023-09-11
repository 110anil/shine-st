import Page from '../page'

export default function ServiceUpload () {
    return <Page pinPrepend={'services/'} title={'Upload Services'} subTitle={'Create new service page'} tags={[{key: 'title', type: 'text', placeholder: 'Enter Service Name'}, {key: 'description', type: 'text', placeholder: 'Enter Description'}]} />
}