import React from 'react'
import * as signalR from '@microsoft/signalr'
import { withTranslation } from 'react-i18next'
import messageprovider from '../m/Messageprovider'
import config from '../configurations/config.json'
import ConversationsInner from './ConversationsInner'

class Conversations extends React.Component {
    constructor() {
        super()
        this.state = {
            id: null,
            conversations: null
        }

        this.getConversations = this.getConversations.bind(this)
    }

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${config.API}messenger`, { transport: signalR.HttpTransportType.WebSockets, accessTokenFactory: () => messageprovider.getAvatar() })
        .configureLogging(signalR.LogLevel.Information)
        .build()

    async componentDidMount() {
        this.hubConnection.start()
            .then(() => this.hubConnection.invoke("AddToInConversations", this.state.id))
        this.getConversations()
        this.hubConnection.on("updateChatsList", (conversation) => {
            const cons = this.state.conversations
            let newInner
            if (conversation.lastMessage.decryptedMessage === null)
                newInner = <ConversationsInner conversation={conversation} idx={conversation.message} key={conversation.message} />
            else {
                if (conversation.lastMessage.senderId === this.state.id) {
                    newInner = <ConversationsInner conversation={conversation} idx={conversation.message} key={conversation.message} lastMessageClass='text-truncate ml-6 px-1 bg-primary2 rounded' />
                }
                else
                    newInner = <ConversationsInner conversation={conversation} idx={conversation.message} key={conversation.message} lastMessageClass='text-truncate ml-6 px-1 bg-secondary2 rounded' />
            }
            const index = this.state.conversations.findIndex(x => x.props.idx === conversation.message)
            if (index >= 0)
                cons.splice(index, 1)
            cons.unshift(newInner)
            this.setState({
                conversations: cons
            })
        })
    }

    async componentWillUnmount() {
        if (this.hubConnection.state === 'Connected') {
            this.hubConnection.invoke("RemoveFromInConversations", this.state.id)
                .then(() => this.hubConnection.stop())
                .then(() => this.hubConnection = null)
        }
    }

    async getConversations() {
        this.setState({
            id: await messageprovider.getMessage()
        })
        let lang
        if (document.cookie.includes("lang=ru"))
            lang = "ru"
        else if (document.cookie.includes("lang=en"))
            lang = "en"
        else
            lang = navigator.language
        const response = await fetch(`${config.API}dialogues/${this.state.id}`, {
            method: "GET",
            headers: {
                "Accept-Language": lang,
                "Authorization": "Bearer " + messageprovider.getAvatar()
            }
        })
        const { t } = this.props
        let conversationsForState = []
        if (response.ok) {
            const conversations = await response.json()
            if (conversations.length === 0) {
                conversationsForState.unshift(<li key={0} className='list-group-item py-1 px-2 text-center'>{t('noconversations')}</li>)
                this.setState({
                    conversations: conversationsForState
                })
            }
            else {
                conversationsForState = await conversations.map((conversation) => {
                    if (conversation.lastMessage === null)
                        return <ConversationsInner conversation={conversation} idx={conversation?.message} key={conversation?.message} />
                    else {
                        if (conversation.lastMessage?.senderId === this.state.id) {
                            return <ConversationsInner conversation={conversation} idx={conversation?.message} key={conversation?.message} lastMessageClass='text-truncate ml-6 px-1 bg-primary2 rounded' />
                        }
                        else
                            return <ConversationsInner conversation={conversation} idx={conversation?.message} key={conversation?.message} lastMessageClass='text-truncate ml-6 px-1 bg-secondary2 rounded' />
                    }
                }
                )
                this.setState({
                    conversations: conversationsForState
                })
            }
        }
        else {
            conversationsForState.unshift(<li key={0} className='list-group-item py-1 px-2 text-center'>{t('wrong')}</li>)
            this.setState({
                conversations: conversationsForState
            })
        }
    }

    render() {
        return (
            <ul className='list-group list-group-flush'>
                {this.state.conversations}
            </ul>
        )
    }
}

export default withTranslation()(Conversations)