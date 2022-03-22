import React from 'react'
import config from '../configurations/config.json'
import { withTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import LoadingSpinner from './../LoadingSpinner'
import messageprovider from '../m/Messageprovider'

class Restore extends React.Component {
    constructor() {
        super()
        this.state = {
            result: false,
            toLogin: false,
            error: false,
            expired: false
        }

    }

    async componentDidMount() {
        const lang = messageprovider.getlang()
        const q = window.location.search
        if (q !== '') {
            const data = q.slice(6)
            try {
                const response = await fetch(`${config.API}login/restore`, {
                    method: "POST",
                    headers: {
                        "Accept-Language": lang,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                if (response.ok) {
                    const result = await response.json()
                    if (result === 1) {
                        debugger
                        this.setState({
                            result: true
                        })
                        this.setState({
                            result: false,
                            toLogin: true
                        })
                    }
                    else if (result === 0) {
                        debugger
                        this.setState({
                            result: true
                        })
                        this.setState({
                            result: false,
                            expired: true
                        })
                    }
                    else {
                        debugger
                        this.setState({
                            result: true
                        })
                        this.setState({
                            result: false,
                            error: true
                        })
                    }
                }
                else {
                    this.setState({
                        result: true
                    })
                    this.setState({
                        result: false,
                        error: true
                    })
                }
            }
            catch {
                this.setState({
                    result: true
                })
                this.setState({
                    result: false,
                    error: true
                })
            }
        }
    }

    render() {
        if (this.state.result) {
            return <Redirect to="/restore" />
        }
        if (this.state.toLogin) {
            const { t } = this.props
            return (
                <div className="vh-100 d-flex align-items-center justify-content-center">
                    <div className="w-100 text-center">
                        <Link to='/' className="h2 d-flex justify-content-center my-4 text-decoration-none text-reset">
                            <img className="mx-2" src="/logo.svg" alt="logo" />
                            Sent String
                        </Link>
                        <p>{t('paschanged')}</p>
                        <div>
                            <Link to='/login' className='text-primary'>{t('signin')}</Link>
                        </div>
                    </div>
                </div>)
        }
        if (this.state.expired) {
            const { t } = this.props
            return (
                <div className="vh-100 d-flex align-items-center justify-content-center">
                    <div className="w-100 text-center">
                        <Link to='/' className="h2 d-flex justify-content-center my-4 text-decoration-none text-reset">
                            <img className="mx-2" src="/logo.svg" alt="logo" />
                            Sent String
                        </Link>
                        <p className='text-danger'>{t('expired')}</p>
                    </div>
                </div>)
        }
        if (this.state.error) {
            const { t } = this.props
            return (
                <div className="vh-100 d-flex align-items-center justify-content-center">
                    <div className="w-100 text-center">
                        <Link to='/' className="h2 d-flex justify-content-center my-4 text-decoration-none text-reset">
                            <img className="mx-2" src="/logo.svg" alt="logo" />
                            Sent String
                        </Link>
                        <p className='text-danger'>{t('wrong')}</p>
                    </div>
                </div>)
        }
        return (
            <div className="vh-100 d-flex align-items-center justify-content-center">
                <div className="w-100 text-center">
                    <Link to='/' className="h2 d-flex justify-content-center my-4 text-decoration-none text-reset">
                        <img className="mx-2" src="/logo.svg" alt="logo" />
                        Sent String
                    </Link>
                    <LoadingSpinner />
                </div>
            </div>
        )
    }
}

export default withTranslation()(Restore)