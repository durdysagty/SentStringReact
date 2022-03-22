import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import config from '../configurations/config.json'
import LoadingSpinner from '../LoadingSpinner'
import BackButton from './BackButton'
import { Link } from 'react-router-dom';
import messageprovider from '../m/Messageprovider'

function Forgot() {
    const { t } = useTranslation()
    const [processing, setProcessing] = useState(false)
    const [processed, setProcessed] = useState(false)
    const [wasValidated, setValidated] = useState(false)
    const [validationMessages, setValidationMessages] = useState([])
    const [login, setLogin] = useState('')
    const [message, setResult] = useState('')

    function handleChange(value) {
        unvalidate()
        setLogin(value)
    }

    function invalid(e) {
        e.preventDefault()
        let messages = []
        if (e.target.validity.valueMissing)
            messages[e.target.name] = t('empty')
        else if (e.target.validity.typeMismatch)
            messages[e.target.name] = t('valid') + t("novalid" + e.target.name)
        else if (e.target.validity.tooShort)
            messages[e.target.name] = t(e.target.name + 2) + e.target.minLength + t('now') + e.target.value.length + '!'
        setValidationMessages(messages)
        e.currentTarget.classList.add("was-validated")
    }

    function validate() {
        const form = document.getElementsByTagName('form')[0]
        form.classList.add("was-validated")
        form.noValidate = false
        setValidated(true)
    }

    function unvalidate() {
        if (wasValidated) {
            const form = document.getElementsByTagName('form')[0]
            form.classList.remove("was-validated")
            const input = document.getElementsByName('email')[0]
            input.setCustomValidity('')
            setValidated(false)
            setResult('')
        }
    }

    async function restore(e) {
        e.preventDefault()
        setProcessing(true)
        try {
            const lang = messageprovider.getlang()
            const response = await fetch(`${config.API}login/forgot`, {
                method: "POST",
                headers: {
                    "Accept-Language": lang,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(login)
            })
            setProcessing(false)
            if (response.ok) {
                const result = await response.json()
                if (result) {
                    setResult(<div>
                        <p>{t('passwordrecovery')}</p>
                        <Link to='/login' className='text-primary'>{t('signin')}</Link>
                    </div>)
                    setProcessed(true)
                }
                else {
                    setResult(
                        <p className='text-danger'>{t('notexist')}</p>
                    )
                    const input = document.getElementsByName('email')[0]
                    input.setCustomValidity('!')
                    validate()
                }
            }
            else {
                setResult(
                    <p className='text-danger'>{t('wrong')}</p>
                )
                const input = document.getElementsByName('email')[0]
                input.setCustomValidity('!')
                validate()
                setProcessing(false)
            }
        }
        catch {
            setProcessing(false)
            setResult(
                <p className='text-danger'>{t('wrong')}</p>
            )
            const input = document.getElementsByName('email')[0]
            input.setCustomValidity('!')
            validate()
        }
    }

    if (processing) {
        return <LoadingSpinner />
    }
    if (processed) {
        return <div>{message}</div>
    }
    return (
        <form onInvalid={invalid} onSubmit={restore}>
            {message}
            <div className="input-group mb-3">
                <input required minLength='6' autoComplete='off' type='email' name="email" className="form-control input-sm input-lg right-radius"
                    aria-label="login" placeholder={t('login')} value={login} onChange={(e) => handleChange(e.target.value)} />
                <div className="invalid-feedback">
                    {validationMessages['email']}
                </div>
            </div>
            <button type='submit' className="btn btn-primary pr-4 pl-4">{t('restore')}</button>
            <BackButton />
        </form>
    )
}

export default Forgot
