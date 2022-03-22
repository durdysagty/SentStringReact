import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import LoadingSpinner from '../LoadingSpinner'
import messageprovider from '../m/Messageprovider'
import GuideLink from './GuideLink'

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      validationMessages: [],
      login: "",
      password: "",
      inavlid: null,
      isLogedIn: false,
      toConfirmation: false,
      toConfirmationText: null,
      processing: false,
      guideLang: '/guide/en'
    }

    this.handleChange = this.handleChange.bind(this)
    this.invalid = this.invalid.bind(this)
    this.login = this.login.bind(this)
  }

  componentDidMount() {
    const lang = messageprovider.getlang()
    if (lang.includes('ru')) {
      this.setState({ guideLang: '/guide/ru' })
    }
  }

  handleChange(event) {
    const name = event.target.name
    if (name === "login") {
      this.setState({ login: event.target.value })
    }
    else
      this.setState({ password: event.target.value })
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
    this.setState({
      validationMessages: messages
    })
    e.currentTarget.classList.add("was-validated")
  }

  login(e) {
    e.preventDefault()
    this.setState({
      processing: true
    })
    messageprovider.login(this.state.login, this.state.password, (result, notFound, resultText) => {
      if (result)
        this.setState({ isLogedIn: result })
      else {
        if (notFound) {
          if (resultText) {
            this.setState({
              invalid: <p className="text-danger" role="alert">{resultText}</p>,
              isLogedIn: result
            })
          }
          else {
            const { t } = this.props
            this.setState({
              invalid: <p className="text-danger" role="alert">{t('wrong')}</p>,
              isLogedIn: result
            })
          }
          setTimeout(() => this.setState({ invalid: null }), 3000)
        }
        else {
          this.setState({
            toConfirmation: true,
            toConfirmationText: resultText
          })
        }
      }
      this.setState({
        processing: false
      })
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
    const { t } = this.props
    if (this.state.processing) {
      return <LoadingSpinner />
    }
    if (this.state.isLogedIn) {
      return <Redirect to="/" />
    }
    if (this.state.toConfirmation) {
      return <Redirect to={{ pathname: '/confirmation', state: { login: this.state.login, password: this.state.password, text: this.state.toConfirmationText } }} />
    }
    return (
      <div>
        {this.state.invalid}
        <form onSubmit={this.login} onInvalid={this.invalid}>
          <div className="input-group mb-3">
            <input required type="text" name="login" className="form-control input-sm input-lg right-radius" aria-label="login" placeholder={t('login')}
              value={this.state.login} onChange={this.handleChange} />
            <div className="invalid-feedback">
              {this.state.validationMessages['login']}
            </div>
          </div>
          <div className="input-group mb-0">
            <input required autoComplete="true" type='password' name="password" className="form-control" aria-label="password" placeholder={t('password')}
              value={this.state.passowrd} onChange={this.handleChange} />
            <div className="input-group-append" onClick={() => this.showHide('password', 1)}>
              <span className="input-group-text right-radius">
                <img src="/visibility-off.svg" alt="show" />
              </span>
            </div>
            <div className="invalid-feedback">
              {this.state.validationMessages['password']}
            </div>
          </div>
          <div className='row p-0 m-0'>
            <div className='col-6 text-left p-0 m-0'>
              <cite className='initialism'>
                <small>
                  <Link className='w-50' to='/forgot'>{t('forgot')}</Link>
                </small>
              </cite>
            </div>
            <div className='col-6 text-right p-0 m-0'>
              <GuideLink />
            </div>
          </div>
          <button type='submit' className="btn btn-primary pr-4 pl-4">{t('signin')}</button>
        </form>
        <div>
          <Link to="/register">{t('signup')}</Link>
        </div>
        <Link to='/settings' className='text-white px-1'>
          <img src='/settings.svg' alt='settings'></img>
        </Link>
      </div>
    )
  }

}

export default withTranslation()(Login)
