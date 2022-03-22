import React from 'react'
import { withTranslation } from 'react-i18next'
import * as signalR from '@microsoft/signalr'
import messageprovider from '../m/Messageprovider'
import config from '../configurations/config.json'
import imageCompression from 'browser-image-compression'

class Conversation extends React.Component {
    constructor() {
        super();
        this.state = {
            id: null,
            message: '',
            messagesFromHub: [],
            i: 0,
            addToContact: null
        }
        this.addContact = this.addContact.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.getImage = this.getImage.bind(this)
        this.sendImage = this.sendImage.bind(this)
        this.deleteChat = this.deleteChat.bind(this)
    }

    i = 0

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${config.API}messenger`, { transport: signalR.HttpTransportType.WebSockets, accessTokenFactory: () => messageprovider.getAvatar() })
        .configureLogging(signalR.LogLevel.Information)
        .build()

    async componentDidMount() {
        const lang = messageprovider.getlang()
        this.setState({
            id: await messageprovider.getMessage(),
        })
        let response = await fetch(`${config.API}dialogues`, {
            method: 'POST',
            headers: {
                "Accept-Language": lang,
                "Authorization": "Bearer " + messageprovider.getAvatar(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ IndividualId: this.state.id, InterlocutorId: this.props.interlocutor.message })
        })
        if (response.ok) {
            const messages = await response.json()
            const messagesForState = await messages.map((message) => {
                this.i++
                if (!message.decryptedMessage.includes('data:image/')) {
                    if (message.senderId === this.state.id)
                        return <div key={this.i} className='my-2 d-flex justify-content-end'><div className='px-2 bg-primary2 rounded'>{message.decryptedMessage}<span className='mx-2 date text-info'>
                            {new Date(message.decryptedDate).toLocaleTimeString(lang, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div></div>
                    else
                        return <div key={this.i} className='my-2 d-flex justify-content-start'><div className='px-2 bg-secondary2 rounded'>{message.decryptedMessage}<span className='mx-2 date text-info'>
                            {new Date(message.decryptedDate).toLocaleTimeString(lang, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div></div>
                }
                else {
                    if (message.senderId === this.state.id)
                        return <div key={this.i} className='my-2 d-flex justify-content-end'>
                            <div className='px-2 py-1 bg-primary2 rounded'><img className='rounded' src={message.decryptedMessage} alt='img' />
                                <span className='mx-2 date text-info align-bottom'>
                                    {new Date(message.decryptedDate).toLocaleTimeString(lang, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    else
                        return <div key={this.i} className='my-2 d-flex justify-content-start'>
                            <div className='px-2 py-1 bg-secondary2 rounded'><img className='rounded' src={message.decryptedMessage} alt='img' />
                                <span className='mx-2 date text-info align-bottom'>
                                    {new Date(message.decryptedDate).toLocaleTimeString(lang, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                }
            })
            this.setState({
                messageFromHub: this.state.messagesFromHub.push(messagesForState)
            })

            this.hubConnection.start()
                .then(() => this.hubConnection.invoke("AddToGroup", this.props.interlocutor.message.toString()))
                .then(() => this.hubConnection.invoke("GetInterlocutorsInGroup"))
                .then(data => console.log(data))

            this.hubConnection.on("send", (mes, senderId, date) => {
                if (!mes.includes('data:image/')) {
                    if (senderId === this.state.id) {
                        this.setState({
                            messageFromHub: this.state.messagesFromHub.push(<div key={this.i} className='my-2 d-flex justify-content-end'>
                                <div className='px-2 py-1 bg-primary2 rounded'>{mes}<span className='mx-2 date text-info'>
                                    {new Date(date).toLocaleTimeString(lang, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span></div></div>)
                        })
                    }
                    else {
                        this.setState({
                            messageFromHub: this.state.messagesFromHub.push(<div key={this.i} className='my-2 d-flex justify-content-start'>
                                <div className='px-2 py-1 bg-secondary2 rounded'>{mes}<span className='mx-2 date text-info'>
                                    {new Date(date).toLocaleTimeString(lang, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span></div></div>)
                        })
                    }
                }
                else {
                    if (senderId === this.state.id) {
                        this.setState({
                            messageFromHub: this.state.messagesFromHub.push(<div key={this.i} className='my-2 d-flex justify-content-end'>
                                <div className='px-2 py-1 bg-primary2 rounded'><img className='rounded' src={mes} alt='img' />
                                    <span className='mx-2 date text-info align-bottom'>
                                        {new Date(date).toLocaleTimeString(lang, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>)
                        })
                    }
                    else {
                        this.setState({
                            messageFromHub: this.state.messagesFromHub.push(<div key={this.i} className='my-2 d-flex justify-content-start'>
                                <div className='px-2 py-1 bg-secondary2 rounded'><img className='rounded' src={mes} alt='img' />
                                    <span className='mx-2 date text-info align-bottom'>
                                        {new Date(date).toLocaleTimeString(lang, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>)
                        })
                    }
                }
                this.i++
                var element = document.getElementById('messages')
                element.scrollTop = element.scrollHeight
            })
        }
        else {
            const { t } = this.props
            this.setState({
                messageFromHub: this.state.messagesFromHub.push(<div key={1} className='my-2 text-center'>
                    <div className='px-2 rounded text-danger'>{t('wrong')}</div>
                </div>)
            })
        }
        response = await fetch(`${config.API}friends/added`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + messageprovider.getAvatar(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ IndividualId: this.state.id, FriendId: this.props.interlocutor.message })
        })
        if (response.ok) {
            const result = await response.json()
            if (!result) {
                const { t } = this.props
                this.setState({
                    addToContact: <nav className="navbar bg-light suggest rounded py-1">
                        <div>{this.props.interlocutor.name + t('addedyou')}</div>
                        <button onClick={this.addContact} className='btn btn-dark pt-0 pb-1 px-2'>+</button>
                    </nav>
                })
            }
        }        
        var element = document.getElementById('messages')
        element.scrollTop = element.scrollHeight
        /*var element = document.getElementById('messages')
        element.addEventListener('resize', this.handleResize(element))*/
    }

    /*handleResize(element) {
        element.scrollTop = element.scrollHeight
    }*/

    componentWillUnmount() {
        if (this.hubConnection.state === 'Connected') {
            this.hubConnection.invoke("RemoveFromGroup", this.props.interlocutor.message.toString())
                .then(() => this.hubConnection.stop())
                .then(() => this.hubConnection = null)
        }
        this.handleChange = null
        this.sendMessage = null
        this.i = null
    }

    async addContact() {
        const contact = {
            IndividualId: this.state.id,
            FriendId: this.props.interlocutor.message,
            FriendsPublicId: this.props.interlocutor.id
        }
        const response = await fetch(`${config.API}friends`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + messageprovider.getAvatar(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contact)
        })
        if (response.ok) {
            const result = await response.text()
            console.log(result)
            this.setState({ addToContact: null })
        }
    }

    handleChange(event) {
        this.setState({ message: event.target.value })
    }

    sendMessage(e) {
        e.preventDefault()
        this.hubConnection.invoke("send", this.state.message, this.props.interlocutor.message.toString())
        this.setState({ message: '' })
    }

    async getImage(e, callback) {
        e.preventDefault()
        const imageFile = e.target.files[0];
        const options = {
            maxSizeMB: 0.02,
            maxWidthOrHeight: 320,
            useWebWorker: true
        }
        let compressedFile
        try {
            compressedFile = await imageCompression(imageFile, options)
        } catch (error) {
            console.log(error)
        }
        const fileReader = new FileReader()
        fileReader.readAsDataURL(compressedFile)
        fileReader.onloadend = function () {
            callback(fileReader.result)
        }
    }

    sendImage(img) {
        this.hubConnection.invoke("send", img, this.props.interlocutor.message.toString())
    }

    async deleteChat() {
        const response = await fetch(`${config.API}dialogues/del`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + messageprovider.getAvatar(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ IndividualId: this.state.id, InterlocutorId: this.props.interlocutor.message })
        })
        const chat = await response.text()
        console.log(chat)
        window.location.href = '/'
    }

    render() {
        const { t } = this.props
        return (
            <div className='bg-white vh-100-40 d-flex align-items-end'>
                <nav className="navbar bg-secondary top justify-content-between w-100">
                    <span className='text-light'>{this.props.interlocutor.name}</span>
                    <button className="btn btn-light pt-0 pb-1 px-1" data-toggle='modal' data-target='#delete'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="20">
                            <path d="M6 21h12V7H6v14zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                    </button>
                    <div className="modal fade" id="delete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h6 className="modal-title" id="exampleModalLongTitle">{t('sure')}</h6>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {t('deletechat')}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">{t('cancel')}</button>
                                    <button type="button" className="btn btn-primary" onClick={this.deleteChat}>{t('continue')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                {this.state.addToContact}
                <div id='messages' className='ml-2 mb-56 w-100 vh-100-120 overflow-auto'>
                    {this.state.messagesFromHub}
                </div>
                <div className="navbar bg-dark text-light bottom w-100 d-flex">
                    <div className='py-0 pr-1'>
                        <label htmlFor="image" className='m-0'>
                            <span className="btn btn-secondary pl-0 pr-1 pt-0">
                                <img src="/photo.svg" alt='' />
                            </span>
                        </label>
                        <input onChange={e => this.getImage(e, this.sendImage)} type="file" accept='image/*' id='image' className='d-none' />
                    </div>
                    <form onSubmit={this.sendMessage} className='flex-fill py-0 my-0'>
                        <div className="input-group">
                            <input onChange={this.handleChange} value={this.state.message} type="text" className="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-secondary pl-2 pr-2 py-0" type="submit">
                                    <img src="/send.svg" alt='' />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default withTranslation()(Conversation)