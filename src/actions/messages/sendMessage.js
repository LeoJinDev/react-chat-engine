import axios from 'axios'
import * as str from '../../actions'

export function sendMessage(props, chatId, data, onSend) {
    
    let formdata = new FormData()
    for (let i = 0; i < data.files.length; i++) { 
        formdata.append('attachments', data.files[i], data.files[i].name)
    }
    formdata.append('text', data.text)

    axios.post(
        `${str.getApiUrl(props)}/chats/${chatId}/messages/`,
        formdata,
        { headers: { 
            "Public-Key": props.publicKey,
            "User-Name": props.userName,
            "User-Secret": props.userPassword,
        }}
    )

    .then((response) => {
        onSend && onSend(response.data)
    })
    
    .catch((error) => {
        console.log('Send Messages Error', error)
    });
    
}