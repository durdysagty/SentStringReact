import React from 'react'
import { withTranslation } from 'react-i18next'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import "./App.css"
import Profile from './individuals/Profile'
import ProtectedRoute from './m/ProtectedRoute'
import Conversation from './conversations/Conversation'
import Conversations from './conversations/Conversations'
import ContactsMain from './individuals/ContactsMain'
import NotFound from './NotFound'
import Main from './individuals/Main'
import ChangePassword from './individuals/ChangePassword'
import messageprovider from './m/Messageprovider'
import Restore from './individuals/Restore';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      toast: null
    }

    this.removeToast = this.removeToast.bind(this)
  }


  componentDidMount() {
    if (!document.cookie.includes("accepted=true")) {
      const { t } = this.props
      const lang = messageprovider.getlang()
      let cookieLink = '/cookie-policy/en'
      let privacyLink = '/privacy-policy/en'
      if (lang.includes('ru')) {
        cookieLink = '/cookie-policy/ru'
        privacyLink = '/privacy-policy/ru'
      }
      this.setState({
        toast: <div className="toast show bottom-left bg-dark text-light" data-autohide="false">
          <div className="text-right">
            <span className="mr-2 mt-2 text-light pointer close" onClick={this.removeToast}>&times;</span>
          </div>
          <div className="toast-body pt-1">
            <small>{t("byusing")} <a className='text-reset text-decoration-none' href={cookieLink}><u>{t('cookiepolicy2')}</u></a>{t('and')}<a className='text-reset text-decoration-none' href={privacyLink}><u>{t('privacypolicy2')}.</u></a></small>
          </div>
        </div>
      })
    }
  }

  removeToast() {
    document.cookie = `accepted=true; max-age=31536000; samesite=strict; path=/`
    this.setState({
      toast: null
    })
  }

  render() {
    return (
      <div className="bg-light d-flex justify-content-center vh-100">
        <div className='main col-xl-5 col-lg-10 col-md-10 col-12 p-0'>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" render={() => <ProtectedRoute component={<Conversations />} />} />
              <Route path="/settings" component={Main} />
              <Route path="/register" component={Main} />
              <Route path="/login" component={Main} />
              <Route path="/confirmation" render={props => props.history.location.state !== undefined || null ? <Main login={props.history.location.state.login} password={props.history.location.state.password} text={props.history.location.state.text} /> : <NotFound />} />
              <Route path="/conversation" render={props => props.history.location.state !== undefined || null ? <ProtectedRoute component={<Conversation interlocutor={props.history.location.state.interlocutor} />} /> : <NotFound />} />
              <Route path="/contacts" render={() => <ProtectedRoute component={<ContactsMain />} />} />
              <Route path="/profile" render={() => <ProtectedRoute component={<Profile />} />} />
              <Route path="/change-password" render={() => <ProtectedRoute component={<ChangePassword />} />} />
              <Route path="/guide" component={Main} />
              <Route path="/cookie-policy" component={Main} />
              <Route path="/privacy-policy" component={Main} />
              <Route path="/forgot" component={Main} />
              <Route path="/restore" component={Restore} />
              <Route path="*" component={NotFound} />
            </Switch>
          </BrowserRouter>
          {this.state.toast}
        </div>
      </div>
    );
  }
}

export default withTranslation()(App)
