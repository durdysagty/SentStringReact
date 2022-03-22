import React from 'react'
import config from '../configurations/config.json'
import messageprovider from '../m/Messageprovider';

class AddContact extends React.Component {
    constructor() {
        super()
        this.state = {
            skipper: 0,
            handle: true,
            candidates: []
        }

        this.handleScroll = this.handleScroll.bind(this)
    }

    async componentDidMount() {
        await this.getCandidates(this.state.skipper)
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
                this.getCandidates(this.state.skipper)
            }

            this.setState({
                handle: false
            })
        }
    }

    async getCandidates(skipper) {
        let stateCandidates = this.state.candidates
        const response = await fetch(`${config.API}friends/add/${this.props.userId}/${skipper}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + messageprovider.getAvatar()
            }
        })
        const candidates = await response.json()
        const candidatesToAdd = candidates.map((candidate) =>
            <tr key={candidate?.message}>
                <th scope="row" className='py-1 w-75rem text-right'>{candidate?.id}</th>
                <td className='py-1'>{candidate?.name}</td>
                <td className='py-1'><button onClick={() => this.addContact(candidate?.message, candidate?.id)} className='btn btn-dark pt-0 pb-1 px-2'>+</button></td>
            </tr>
        )
        stateCandidates = stateCandidates.concat(candidatesToAdd)
        this.setState({
            candidates: stateCandidates
        })
        if (candidates.length !== 0)
            this.setState({
                handle: true
            })
    }

    async addContact(message, id) {
        let stateCandidates = this.state.candidates
        let index = stateCandidates.findIndex(i => i.key === message.toString())
        const contact = {
            IndividualId: this.props.userId,
            FriendId: message,
            FriendsPublicId: id
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
            stateCandidates.splice(index, 1)
            this.setState({
                candidates: stateCandidates
            })
        }
    }

    render() {
        return (
            <tbody>
                {this.state.candidates}
            </tbody>
        )
    }
}

export default AddContact