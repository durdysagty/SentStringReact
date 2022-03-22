import React from 'react'
import { withTranslation } from 'react-i18next'
import messageprovider from '../m/Messageprovider'
import { Route, Link, Switch } from 'react-router-dom';
import Contacts from './Contacts';
import AddContact from './AddContact';
import RemoveContact from './RemoveContact';


class ContactsMain extends React.Component {
    constructor() {
        super()
        this.state = {
            message: null
        }
    }

    async componentDidMount() {
        this.setState({
            message: await messageprovider.getMessage()
        })
    }

    render() {
        const { t } = this.props
        if (this.state.message != null) {
            return (
                <div>
                    <table className="table table-hover bg-white contacts pointer">
                        <thead className="bg-secondary w-100">
                            <tr>
                                <th scope="col" className='py-1 w-75rem text-white text-right'>Id</th>
                                <th scope="col" className='py-1 text-white'>{t('name')}</th>
                                <th scope="col" className='py-1'>
                                    <Link to="/contacts/add-new-contact" className='mx-1'>
                                        <button className="btn btn-light pt-0 pb-1 px-2">+</button>
                                    </Link>
                                    <Link to="/contacts/remove-contact">
                                        <button className="btn btn-light pt-0 pb-1 px-26">-</button>
                                    </Link>
                                </th>
                            </tr>
                        </thead>
                        <Switch>
                            <Route path='/contacts/add-new-contact' render={() => <AddContact userId={this.state.message} />} />
                            <Route path='/contacts/remove-contact' render={() => <RemoveContact userId={this.state.message} />} />
                            <Route exact path='/contacts' render={() => <Contacts userId={this.state.message} />} />
                        </Switch>
                    </table>
                </div>
            )
        }
        else {
            return (
                <div></div>
            )
        }
    }
}

export default withTranslation()(ContactsMain)
