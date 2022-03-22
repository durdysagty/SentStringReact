import React from 'react'
import { withTranslation } from 'react-i18next'
import config from '../configurations/config.json'
import { Link, Redirect } from 'react-router-dom'
import LoadingSpinner from '../LoadingSpinner'
import GuideLink from './GuideLink'

class Register extends React.Component {
    constructor() {
        super()
        this.state = {
            validationMessages: [],
            existEmail: null,
            user: {
                email: "",
                password: "",
                confirm: "",
                name: ""
            },
            processing: false,
            regText: null,
            toConfirmation: false,
            toConfirmationText: null,
            errorsFromServer: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.invalid = this.invalid.bind(this)
        this.register = this.register.bind(this)
        this.handleNumberInput = this.handleNumberInput.bind(this)
    }

    handleChange(event) {
        const { user } = { ...this.state }
        const currentState = user
        const { name, value } = event.target
        currentState[name] = value
        this.setState({
            user: currentState
        })
        if (this.state.errorsFromServer.length !== 0) {
            if (this.state.errorsFromServer.includes(event.target.name)) {
                const input = document.getElementsByName(event.target.name)[0]
                input.setCustomValidity('')
                let errors = this.state.errorsFromServer
                errors.splice(errors.indexOf(event.target.name), 1)
                this.setState({ errorsFromServer: errors })
            }
        }
        if (event.target.name === 'email') {
            if (this.state.existEmail !== null) {
                if (this.state.existEmail !== this.state.user.email) {
                    const input = document.getElementsByName('email')[0]
                    input.setCustomValidity('')
                }
            }
        }
        else if (event.target.name === 'password' || event.target.name === 'confirm') {
            const input = document.getElementsByName('confirm')[0]
            if (this.state.user.password !== this.state.user.confirm) {
                const { t } = this.props
                input.setCustomValidity(t('match'))
            }
            else {
                input.setCustomValidity('')
            }
        }
    }

    invalid(e) {
        e.preventDefault()
        const { t } = this.props
        let inputs = e.currentTarget.getElementsByTagName("input")
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].validity.valid)
                delete this.state.validationMessages[inputs[i].name]
        }
        let messages = this.state.validationMessages
        if (e.target.validity.valueMissing)
            messages[e.target.name] = t('empty')
        else if (e.target.validity.typeMismatch)
            messages[e.target.name] = t('valid') + t("novalid" + e.target.name)
        else if (e.target.validity.tooShort)
            messages[e.target.name] = t(e.target.name + 2) + e.target.minLength + t('now') + e.target.value.length + '!'
        else if (e.target.validity.patternMismatch) {
            if (e.target.name === 'password' || e.target.name === 'confirm')
                messages[e.target.name] = t('mustbe')
            else if (e.target.name === 'name')
                messages[e.target.name] = t('namespace')
            else
                messages[e.target.name] = t('valid') + t(e.target.name + 2)
        }
        else if (e.target.validity.customError)
            messages[e.target.name] = e.target.validationMessage
        else
            messages[e.target.name] = e.target.validationMessage
        this.setState({
            validationMessages: messages
        })
        e.currentTarget.classList.add("was-validated")
    }

    async register(e) {
        e.preventDefault()
        this.setState({
            validationMessages: [],
            processing: true
        })
        this.unvalidate()
        try {
            let lang
            if (document.cookie.includes("lang=ru"))
                lang = "ru"
            else if (document.cookie.includes("lang=en"))
                lang = "en"
            else
                lang = navigator.language
            const response = await fetch(`${config.API}individuals`, {
                method: "POST",
                headers: {
                    "Accept-Language": lang,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.state.user)
            })
            if (response.ok) {
                this.setState({
                    processing: false
                })
                const result = await response.text()
                if (result.includes('!!!')) {
                    this.setState({
                        toConfirmation: true,
                        toConfirmationText: result
                    })
                }
                else if (!result.includes('"')) {
                    const { t } = this.props
                    const input = document.getElementsByName('email')[0]
                    input.setCustomValidity(result)
                    let messages = this.state.validationMessages
                    messages['email'] = result
                    this.setState({
                        validationMessages: messages,
                        existEmail: this.state.user.email,
                        regText: <p className='text-danger'>{t('ifyours')}<Link to='/login' className='text-primary'>{t('signin')}</Link></p>
                    })
                    this.validate()
                }
                else {
                    let messages = JSON.parse(result)
                    let errors = []
                    Object.keys(messages).map(key => errors[key] = messages[key])
                    this.setState({
                        validationMessages: errors,
                        errorsFromServer: Object.keys(errors)
                    })
                    for (let keyValue of this.state.errorsFromServer) {
                        const input = document.getElementsByName(keyValue)[0]
                        input.setCustomValidity('a')
                    }
                    this.validate()
                }
            }
            else {
                this.setState({
                    processing: false
                })
                this.badRegState()
            }
        }
        catch {
            this.setState({
                processing: false
            })
            this.badRegState()
        }
    }

    validate() {
        const form = document.getElementsByTagName('form')[0]
        form.classList.add("was-validated")
        form.noValidate = false
    }

    badRegState() {
        const { t } = this.props
        this.setState({
            regText: <p className='text-danger' key={5}>{t('wrong')}</p>
        })
    }

    unvalidate() {
        const form = document.getElementsByTagName('form')[0]
        form.classList.remove("was-validated")
    }

    handleNumberInput(e) {
        this.setState({
            confirmNumber: e.target.value
        })
    }

    showHide(name, i) {
        const input = document.getElementsByName(name)[0]
        const img = document.getElementsByTagName('img')[i]
        if (input.type === 'password') {
            input.setAttribute('type', 'text')
            img.setAttribute('src', '/visibility.svg')
        }
        else {
            input.setAttribute('type', 'password')
            img.setAttribute('src', '/visibility-off.svg')
        }
    }

    render() {
        if (this.state.toConfirmation) {
            return <Redirect to={{ pathname: '/confirmation', state: { login: this.state.user.email, password: this.state.user.password, text: this.state.toConfirmationText } }} />
        }
        else if (this.state.processing) {
            return <LoadingSpinner />
        }
        const { t } = this.props
        return (
            <form onSubmit={this.register} onInvalid={this.invalid}>
                <div className="w-100 text-center">
                    {this.state.regText}
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text mw-6" id="email">{t('email')}</span>
                        </div>
                        <input required minLength='6' autoComplete='off'
                            type='email' name="email" className="form-control right-radius" aria-label="email" aria-describedby="email"
                            value={this.state.user.email} onChange={this.handleChange} />
                        <div className="invalid-feedback">
                            {this.state.validationMessages['email']}
                        </div>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text mw-6" id="password">{t('password')}</span>
                        </div>
                        <input required minLength='8' autoComplete='off' pattern="(?=.*\d)(?=.*[a-zA-Z]).+"
                            type="password" name="password" className="form-control" aria-label="password" aria-describedby="password"
                            value={this.state.user.password} onChange={this.handleChange} />
                        <div className="input-group-append" onClick={() => this.showHide('password', 1)}>
                            <span className="input-group-text right-radius">
                                <img src="/visibility-off.svg" alt="show" />
                            </span>
                        </div>
                        <div className="invalid-feedback">
                            {this.state.validationMessages['password']}
                        </div>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text mw-6" id="confirm">{t('confirm')}</span>
                        </div>
                        <input required minLength='8' autoComplete='off' pattern='(?=.*\d)(?=.*[a-zA-Z]).+'
                            type="password" name="confirm" className="form-control" aria-label="confirm" aria-describedby="confirm"
                            value={this.state.user.confirm} onChange={this.handleChange} />
                        <div className="input-group-append" onClick={() => this.showHide('confirm', 2)}>
                            <span className="input-group-text right-radius">
                                <img src="/visibility-off.svg" alt="show" />
                            </span>
                        </div>
                        <div className="invalid-feedback">
                            {this.state.validationMessages['confirm']}
                        </div>
                    </div>
                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <span className="input-group-text mw-6" id="name">{t('name')}</span>
                        </div>
                        <input required minLength='4' autoComplete='off' pattern='\S+'
                            type="text" name="name" className="form-control right-radius" aria-label="name" aria-describedby="name" value={this.state.user.name} onChange={this.handleChange} />
                        <div className="invalid-feedback">
                            {this.state.validationMessages['name']}
                        </div>
                    </div>
                    <div className='w-100 text-right'>
                        <GuideLink />
                    </div>
                    <button type='submit' className="btn btn-primary pr-4 pl-4">
                        {t('signup2')}
                    </button>
                </div>
                <Link to='/settings' className='text-white px-1'>
                    <img src='/settings.svg' alt='settings'></img>
                </Link>
            </form>
        )
    }
}


export default withTranslation()(Register)