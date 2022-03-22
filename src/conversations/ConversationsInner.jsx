import React from 'react'
import { Link } from 'react-router-dom';

function ConversationsInner(props) {
    if (!props.conversation.lastMessage?.decryptedMessage.includes('data:image/')) {
        return (
            <li className='list-group-item py-1 px-2'>
                <Link to={{ pathname: '/conversation', state: { interlocutor: props.conversation } }} className='text-dark text-truncate text-decoration-none d-flex justify-content-between'>
                    <span>{props.conversation.name}</span>
                    <span className={props.lastMessageClass}>{props.conversation.lastMessage?.decryptedMessage}</span>
                </Link>
            </li>
        )
    }
    else {
        return (
            <li className='list-group-item py-1 px-2'>
                <Link to={{ pathname: '/conversation', state: { interlocutor: props.conversation } }} className='text-dark text-truncate text-decoration-none d-flex justify-content-between'>
                    <span>{props.conversation.name}</span>
                    <span className={props.lastMessageClass}>
                        <img src='/image.svg' alt='img' />
                    </span>
                </Link>
            </li>
        )
    }
}

export default ConversationsInner