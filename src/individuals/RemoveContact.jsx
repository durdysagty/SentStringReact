import React from 'react'
import config from '../configurations/config.json'
import messageprovider from '../m/Messageprovider'

class RemoveContact extends React.Component {
    constructor() {
        super()
        this.state = {
            skipper: 0,
            handle: true,
            contacts: []
        }

        this.handleScroll = this.handleScroll.bind(this)
    }

    async componentDidMount() {
        await this.getContacts(this.state.skipper)
        window.addEventListener('scroll', this.handleScroll)
    }

    async componentWillUnmount(){
        window.removeEventListener('scroll', this.handleScroll)
    }

    async handleScroll() {
        const scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight
        );
        if (scrollHeight <= document.documentElement.clientHeight + window.pageYOffset + 300 && scrollHeight > document.documentElement.clientHeight) {
            if (this.state.handle) {
                let s = this.state.skipper
                s++
                this.setState({
                    skipper: s
                })
                this.getContacts(this.state.skipper)
            }
            this.setState({
                handle: false
            })
        }
    }

    async getContacts(skipper) {
        let stateContacts = this.state.contacts
        const response = await fetch(`${config.API}friends/${this.props.userId}/${skipper}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + messageprovider.getAvatar()
            }
        })
        const contacts = await response.json()
        const contactsToAdd = contacts.map((contact) =>
            <tr key={contact?.message}>
                <th scope="row" className='py-1 w-75rem text-right'>{contact?.id}</th>
                <td className='py-1'>{contact?.name}</td>
                <td className='py-1'><button onClick={() => this.removeContact(contact?.message)} className='btn btn-dark pt-0 pb-1 px-26'>-</button></td>
            </tr>
        )
        stateContacts = stateContacts.concat(contactsToAdd)
        this.setState({
            contacts: stateContacts
        })
        if (contacts.length !== 0)
            this.setState({
                handle: true
            })
    }

    async removeContact(message) {
        let stateContacts = this.state.contacts
        let index = stateContacts.findIndex(i => i.key === message.toString())
        const contact = {
            IndividualId: this.props.userId,
            FriendId: message
        }
        const response = await fetch(`${config.API}friends`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + messageprovider.getAvatar(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contact)
        })
        if (response.ok) {
            const result = await response.json()
            console.log(result)
            stateContacts.splice(index, 1)
            this.setState({
                contacts: stateContacts
            })
        }
    }

    render() {
        return (
            <tbody>
                {this.state.contacts}
            </tbody>
        )
    }
}

export default RemoveContact