import React from 'react'
import Login from './Login';
import { Route, Link } from 'react-router-dom';
import Register from './Register';
import Confirmation from './Confirmation';
import GuideEn from '../guides/GuideEn';
import GuideRu from './../guides/GuideRu';
import Settings from './Settings';
import CookiePolicyEn from './../guides/CookiePolicyEn';
import CookiePolicyRu from './../guides/CookiePolicyRu';
import PrivacePolicyEn from './../guides/PrivacyPolicyEn';
import PrivacePolicyRu from '../guides/PrivacyPolicyRu';
import Forgot from './Forgot';

function Main(props) {
    return (
        <div className="vh-100 d-flex align-items-center justify-content-center">
            <div className="w-100 text-center">
                <Link to='/' className="h2 d-flex justify-content-center my-4 text-decoration-none text-reset">
                    <img className="mx-2" src="/logo.svg" alt="logo" />
                    Sent String
                </Link>
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
                <Route path='/confirmation' render={() => <Confirmation login={props.login} password={props.password} text={props.text} />} />
                <Route path="/guide/en" component={GuideEn} />
                <Route path="/guide/ru" component={GuideRu} />
                <Route path="/cookie-policy/en" component={CookiePolicyEn} />
                <Route path="/cookie-policy/ru" component={CookiePolicyRu} />
                <Route path="/privacy-policy/en" component={PrivacePolicyEn} />
                <Route path="/privacy-policy/ru" component={PrivacePolicyRu} />
                <Route path="/forgot" component={Forgot} />
                <Route path="/settings" component={Settings} />
            </div>
        </div>
    )
}

export default Main