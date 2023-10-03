'use client'
import Page from '../edit-albums/page'
import ServicePagePreview from "@/components/ServicePagePreview";
export default function ServicePage () {
    return <Page PreviewComponent={ServicePagePreview} pinPrepend={'services/'} title={'Edit Services'} subTitle={'Edit Existing Service Page'} tags={[{key: 'tg', type: 'text', disabled: true, placeholder: 'Default Tag'}, {key: 'title', type: 'text', placeholder: 'Enter Service Name'}, {key: 'description', type: 'text', placeholder: 'Enter Description'} , {key: 'textLocation', type: 'radio', options: [
    {key: 'bottom'},{key: 'top'},{key: 'left'},{key: 'right'},{key: 'middle'},{key: 'center'}
        ], placeholder: 'Location of Text'}
        , {maxLength: 2, key: 'backgroundPosition', type: 'text', placeholder: 'Enter Background Position (Number between 0 to 80)'}]} submitText={'Update Service'} />
}