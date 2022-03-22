import React from 'react'
import { withTranslation } from 'react-i18next'
import config from '../configurations/config.json'
import messageprovider from '../m/Messageprovider'
import { Link, Redirect } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

class Confirmation extends React.Component {
    constructor() {
        super()
        this.state = {
            validationMessage: '',
            text: null,
            confirmNumber: "",
            isRedirect: false,
            processing: false,
            wrong: false
        }

        this.invalid = this.invalid.bind(this)
        this.handleNumberInput = this.handleNumberInput.bind(this)
        this.confirmEmail = this.confirmEmail.bind(this)
    }

    componentDidMount() {
        const str = this.props.text.split("!! ")
        this.setState({
            text: str.map(s => <p key={str.indexOf(s)}>{s}</p>)
        })
    }

    handleNumberInput(e) {
        if (/^\d+$|^$/.test(e.target.value)) {
            this.setState({
                confirmNumber: e.target.value
            })
        }
        else {
            const { t } = this.props
            this.setState({
                validationMessage: t('onlydigits')
            })
            this.validate()
            const input = document.getElementsByTagName('input')[0]
            input.setCustomValidity(t('onlydigits'))
            setTimeout(() => this.unvalidate(), 800)
            setTimeout(() => { input.setCustomValidity('') }, 805)
        }
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

    invalid(e) {
        e.preventDefault()
        const { t } = this.props
        let message
        if (e.target.validity.valueMissing)
            message = t('empty')
        else
            message = t('valid') + t(e.target.name + 2)
        this.setState({
            validationMessage: message
        })
        e.currentTarget.classList.add("was-validated")
    }

    async confirmEmail(e) {
        e.preventDefault()
        let form = new FormData()
        form.append('toConfirm', this.props.login)
        form.append('confirmator', this.state.confirmNumber)
        try {
            this.setState({ processing: true })
            let lang
            if (document.cookie.includes("lang=ru"))
                lang = "ru"
            else if (document.cookie.includes("lang=en"))
                lang = "en"
            else
                lang = navigator.language
            const response = await fetch(`${config.API}individuals/confirm`, {
                method: "POST",
                headers: {
                    "Accept-Language": lang
                },
                body: form
            })
            if (response.ok) {
                this.setState({ processing: false })
                const result = await response.json()
                if (result === true) {
                    this.validate()
                    setTimeout(() => {
                        messageprovider.login(this.props.login, this.props.password, () => {
                            this.setState({ isRedirect: true })
                        })
                    }, 2000)
                }
                else if (result === false)
                    this.badRegState()
                else {
                    const input = document.getElementsByName('confirmation number')[0]
                    debugger
                    input.setCustomValidity(result)
                    this.setState({
                        validationMessage: result
                    })
                    this.validate()
                    setTimeout(() => { this.unvalidate() }, 2000)
                    setTimeout(() => { input.setCustomValidity('') }, 2005)
                }
            }
            else
                this.badRegState()
        }
        catch {
            this.setState({ processing: false })
            this.badRegState()
        }
    }

    badRegState() {
        const { t } = this.props
        this.setState({
            processing: false,
            wrong: true,
            text: [<p className='text-danger' key={3}>{t('wrongconfirm')}</p>,
            <p className='text-danger' key={4}>{t('newconfirm')}</p>,
            <p className='text-danger' key={5}>{t('incon')}</p>,
            <div><Link to='/login' className='text-primary'>{t('signin')}</Link></div>
            ]
        })
    }

    render() {
        if (this.state.processing) {
            return <LoadingSpinner />
        }
        if (this.state.isRedirect) {
            return <Redirect to="/" />
        }
        if (this.state.wrong) {
            return <div className="w-100 text-center">{this.state.text}</div>
        }
        const { t } = this.props
        return (
            <div>
                <div className="w-100 text-center">
                    {this.state.text}
                    <form onSubmit={this.confirmEmail} onInvalid={this.invalid}>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="confirmation number">{t('confirmation')}</span>
                            </div>
                            <input required autoComplete='off' name="confirmation number"
                                className="form-control right-radius" aria-label="confirmation number" aria-describedby="confirmation number"
                                value={this.state.confirmNumber} onChange={this.handleNumberInput} />
                            <div className="invalid-feedback">
                                {this.state.validationMessage}
                            </div>
                        </div>
                        <button type='submit' className="btn btn-primary pr-4 pl-4">
                            {t('confirmnumber')}
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default withTranslation()(Confirmation)