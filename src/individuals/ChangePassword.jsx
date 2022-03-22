import React from 'react'
import { withTranslation } from 'react-i18next'
import config from '../configurations/config.json'
import LoadingSpinner from '../LoadingSpinner'
import messageprovider from '../m/Messageprovider'

class ChangePassord extends React.Component {
    constructor() {
        super()
        this.state = {
            validationMessages: [],
            oldpassword: "",
            password: "",
            confirm: "",
            changedText: null,
            processing: false,
            invalid: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.invalid = this.invalid.bind(this)
        this.change = this.change.bind(this)
    }

    handleChange(e) {
        const { name, value } = e.target
        if (e.target.name === 'oldpassword') {
            if (this.state.invalid) {
                this.unvalidate()
                const input = document.getElementsByName('oldpassword')[0]
                input.setCustomValidity('')
                this.setState({
                    invalid: false
                })
            }
        }
        if (e.target.name === 'password' || e.target.name === 'confirm') {
            this.setState({
                [name]: value
            }, () => {
                const input = document.getElementsByName('confirm')[0]
                if (this.state.password !== this.state.confirm) {
                    const { t } = this.props
                    input.setCustomValidity(t('match'))
                }
                else {
                    input.setCustomValidity('')
                }
            })
        }
        else {
            this.setState({
                [name]: value
            })
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
            messages[e.target.name] = t('valid') + t(e.target.name + 2)
        else if (e.target.validity.tooShort)
            messages[e.target.name] = t(e.target.name + 2) + e.target.minLength + t('now') + e.target.value.length + '!'
        else if (e.target.validity.patternMismatch) {
            if (e.target.name === 'oldpassword' || e.target.name === 'password' || e.target.name === 'confirm')
                messages[e.target.name] = t('mustbe')
            else if (e.target.name === 'name')
                messages[e.target.name] = t('namespace')
            else
                messages[e.target.name] = t('valid') + t(e.target.name + 2)
        }
        else if (e.target.validity.customError) {
            messages[e.target.name] = e.target.validationMessage
        }
        else
            messages[e.target.name] = e.target.validationMessage
        this.setState({
            validationMessages: messages
        })
        e.currentTarget.classList.add("was-validated")
    }

    async change(e) {
        e.preventDefault()
        this.setState({
            validationMessages: [],
            processing: false
        })
        this.unvalidate()
        try {
            const lang = messageprovider.getlang()
            const user = await messageprovider.getActiveMessage()
            const response = await fetch(`${config.API}individuals/change`, {
                method: "POST",
                headers: {
                    "Accept-Language": lang,
                    "Authorization": "Bearer " + messageprovider.getAvatar(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ login: user.email, oldPassword: this.state.oldpassword, password: this.state.password, confirm: this.state.confirm })
            })
            if (response.ok) {
                this.setState({
                    processing: false
                })
                const result = await response.text()
                if (result.includes('!') && !result.includes(':')) {
                    const input = document.getElementsByName('oldpassword')[0]
                    input.setCustomValidity(result)
                    let messages = this.state.validationMessages
                    messages['oldpassword'] = result
                    this.setState({
                        validationMessages: messages,
                        invalid: true
                    })
                    this.validate()
                }
                else if (!result.includes('"')) {
                    this.setState({
                        changedText: <p>{result}</p>,
                        oldpassword: "",
                        password: "",
                        confirm: ""
                    })
                }
                else {
                    let messages = JSON.parse(result)
                    let errors = []
                    Object.keys(messages).map(key => errors[key] = messages[key])
                    this.setState({
                        validationMessages: errors
                    })
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

    badRegState() {
        const { t } = this.props
        this.setState({
            changedText: <p className='text-danger'>{t('wrong')}</p>,
        })
    }

    validate() {
        const form = document.getElementsByTagName('form')[0]
        form.classList.add("was-validated")
        form.noValidate = false
    }

    unvalidate() {
        const form = document.getElementsByTagName('form')[0]
        form.classList.remove("was-validated")
    }

    showHide(name, i) {
        const input = document.getElementsByName(name)[0]
        const img = document.getElementsByTagName('img')[i]
        if (input.type === 'password' || input.type === 'oldpassword') {
            input.setAttribute('type', 'text')
            img.setAttribute('src', '/visibility.svg')
        }
        else {
            input.setAttribute('type', 'password')
            img.setAttribute('src', '/visibility-off.svg')
        }
    }

    render() {
        if (this.state.processing) {
            return (
                <div className="vh-100-40 d-flex align-items-center justify-content-center">
                    <LoadingSpinner />
                </div>
            )
        }
        const { t } = this.props
        return (
            <div className="vh-100-40 d-flex align-items-center justify-content-center">
                <form onSubmit={this.change} onInvalid={this.invalid}>
                    <div className="w-100 text-center">
                        {this.state.changedText}
                    </div>
                    <div className="w-100 text-center">
                        <div className="input-group mb-3">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text mw-8" id="oldpassword">{t('old')}</span>
                                </div>
                                <input required minLength='8' autoComplete='off' pattern="(?=.*\d)(?=.*[a-zA-Z]).+"
                                    type="password" name="oldpassword" className="form-control" aria-label="oldpassword" aria-describedby="oldpassword"
                                    value={this.state.oldpassword} onChange={this.handleChange} />
                                <div className="input-group-append" onClick={() => this.showHide('oldpassword', 1)}>
                                    <span className="input-group-text right-radius">
                                        <img src="/visibility-off.svg" alt="show" />
                                    </span>
                                </div>
                                <div className="invalid-feedback">
                                    {this.state.validationMessages['oldpassword']}
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text mw-8" id="password">{t('password')}</span>
                                </div>
                                <input required minLength='8' autoComplete='off' pattern="(?=.*\d)(?=.*[a-zA-Z]).+"
                                    type="password" name="password" className="form-control" aria-label="password" aria-describedby="password"
                                    value={this.state.password} onChange={this.handleChange} />
                                <div className="input-group-append" onClick={() => this.showHide('password', 2)}>
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
                                    <span className="input-group-text mw-8" id="confirm">{t('confirm')}</span>
                                </div>
                                <input required minLength='8' autoComplete='off' pattern='(?=.*\d)(?=.*[a-zA-Z]).+'
                                    type="password" name="confirm" className="form-control" aria-label="confirm" aria-describedby="confirm"
                                    value={this.state.confirm} onChange={this.handleChange} />
                                <div className="input-group-append" onClick={() => this.showHide('confirm', 3)}>
                                    <span className="input-group-text right-radius">
                                        <img src="/visibility-off.svg" alt="show" />
                                    </span>
                                </div>
                                <div className="invalid-feedback">
                                    {this.state.validationMessages['confirm']}
                                </div>
                            </div>
                        </div>
                        <button type='submit' className="btn btn-primary pr-4 pl-4">
                            {t('change')}
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

export default withTranslation()(ChangePassord)