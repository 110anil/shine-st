import Page from '../edit-albums/page'

export default function ServicePage () {
    return <Page pinPrepend={'services/'} title={'Edit Services'} subTitle={'Edit Existing Service Page'} tags={[{key: 'tg', type: 'text', disabled: true, placeholder: 'Default Tag'}, {key: 'title', type: 'text', placeholder: 'Enter Service Name'}, {key: 'description', type: 'text', placeholder: 'Enter Description'} , {key: 'textLocation', type: 'radio', options: [
    {key: 'bottom'},{key: 'top'},{key: 'left'},{key: 'right'},{key: 'middle'},{key: 'center'}
        ], placeholder: 'Location of Text'}]} submitText={'Update Service'} />
}