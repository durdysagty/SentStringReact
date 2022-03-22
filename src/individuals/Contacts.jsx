import React from 'react'
import { withTranslation } from 'react-i18next'
import config from '../configurations/config.json'
import messageprovider from '../m/Messageprovider';
import { Link } from 'react-router-dom';


class Contacts extends React.Component {
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
        const lang = messageprovider.getlang()
        let stateContacts = this.state.contacts
        const response = await fetch(`${config.API}friends/${this.props.userId}/${skipper}`, {
            method: "GET",
            headers: {
                "Accept-Language": lang,
                "Authorization": "Bearer " + messageprovider.getAvatar()
            }
        })
        const contacts = await response.json()
        const contactsToAdd = contacts.map((contact) =>
            <tr key={contact?.message}>
                <th scope="row" className='py-1 w-75rem text-right'>{contact?.id}</th>
                <td className='py-1'>
                    <Link to={{ pathname: '/conversation', state: { interlocutor: contact } }} className='mx-1 text-dark text-truncate text-decoration-none'>
                        {contact?.name}
                    </Link>
                </td>
                <td></td>
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
        if (this.state.contacts.length === 0) {
            const { t } = this.props
            this.setState({
                contacts: <tr><td colSpan='3' className='text-center'>{t('nocontacts')}</td></tr>
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

export default withTranslation()(Contacts)