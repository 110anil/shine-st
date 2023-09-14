'use client'
import Page from '../upload-albums/page'
import ServicePage from "@/components/ServicePagePreview";
export default function ServiceUpload () {
    return <Page PreviewComponent={ServicePage} pinPrepend={'services/'} title={'Upload Services'} subTitle={'Create new service page'} initialValue={{tg: 'service_tag', textLocation: 'middle'}} tags={[{key: 'tg', disabled: true, type: 'text', placeholder: 'Default Tag'}, {key: 'title', type: 'text', placeholder: 'Enter Service Name'}, {key: 'description', type: 'text', placeholder: 'Enter Description'}, {key: 'textLocation', type: 'radio', options: [
    {key: 'bottom'},{key: 'top'},{key: 'left'},{key: 'right'},{key: 'middle'},{key: 'center'}
        ], placeholder: 'Location of Text'}]} />
}