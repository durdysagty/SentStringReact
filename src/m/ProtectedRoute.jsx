import React from 'react'
import { withTranslation } from 'react-i18next'
import { Redirect, Link } from 'react-router-dom'
import messageprovider from './Messageprovider'




class ProtectedRoute extends React.Component {
    constructor() {
        super()
        this.state = {
            auth: null,
            user: null,
            wrong: false
        }
    }

    async componentDidMount() {
        const isValid = await messageprovider.isTokenValid()
        if (isValid !== undefined) {
            if (isValid === true) {
                this.setState({
                    auth: messageprovider.isMessageSent(),
                    user: await messageprovider.getActiveMessage()
                })
            }
            else {
                this.setState({
                    auth: messageprovider.isMessageSent()
                })
            }
        }
        else {
            this.setState({
                wrong: true
            })
        }
    }

    render() {
        const { t } = this.props
        if (this.state.auth !== null) {
            if (this.state.auth) {
                return (
                    <div className='min-vh-100'>
                        <nav className="navbar bg-dark text-light justify-content-between">
                            <Link to='/profile' className='text-white'>{this.state.user?.name}</Link>
                            <div>
                                <Link to='/' className='text-white px-1'>{t('chats')}</Link>
                                <Link to='/contacts' className='text-white px-1'>{t('contacts')}</Link>
                                <Link to='/settings' className='text-white px-1'>
                                    <img src='/settings1.svg' alt='settings'></img>
                                </Link>
                            </div>
                        </nav>
                        {this.props.component}
                    </div>
                )
            }
            else {
                return (
                    <Redirect to="/login" />
                )
            }
        }
        else {
            if (this.state.wrong) {
                return (<div className='min-vh-100 d-flex d-flex align-items-center justify-content-center text-danger'>{t('wrong')}</div>)
            }
            return (<div></div>)
        }
    }
}

export default withTranslation()(ProtectedRoute)