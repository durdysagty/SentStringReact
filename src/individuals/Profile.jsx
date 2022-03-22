import React from 'react'
import { withTranslation } from 'react-i18next'
import messageprovider from '../m/Messageprovider'
import config from '../configurations/config.json'
import { Link } from 'react-router-dom'

class Profile extends React.Component {
    constructor() {
        super()
        this.state = {
            user: null
        }

        this.logout = this.logout.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
    }

    async componentDidMount() {
        this.setState({
            user: await messageprovider.getActiveMessage()
        })
    }

    async logout() {
        messageprovider.logout()
    }

    async deleteUser() {
        const response = await fetch(`${config.API}individuals/${messageprovider.getMessage()}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + messageprovider.getAvatar()
            }
        })
        const result = await response.text()
        console.log(result)
        messageprovider.logout()
    }

    render() {
        const { t } = this.props
        if (this.state.user !== null) {
            return (
                <div className="vh-100-40 d-flex align-items-center justify-content-center">
                    <div className='w-100'>
                        <table className="table table-hover">
                            <tbody>
                                <tr>
                                    <th scope="row">{t('name')}</th>
                                    <td>{this.state.user.name}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{t('email')}</th>
                                    <td >{this.state.user.email}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Id</th>
                                    <td >{this.state.user.id}</td>
                                </tr>
                                <tr>
                                    <th scope="row">{t('password')}</th>
                                    <td><span className='mr-4'>*</span><Link to='/change-password'>{t('change')}</Link></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='text-center'>
                            <button className="btn btn-primary pr-4 pl-4" onClick={this.logout}>{t('logout')}</button>
                            <div className="text-danger pointer" data-toggle='modal' data-target='#delete'>{t('delete')}</div>
                            <div className="modal fade" id="delete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h6 className="modal-title" id="exampleModalLongTitle">{t('sureprofile')}</h6>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">{t('deleteprofile')}</div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">{t('cancel')}</button>
                                            <button type="button" className="btn btn-primary" onClick={this.deleteUser}>{t('continue')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )
        }
        else {
            return <div></div>
        }
    }
}


export default withTranslation()(Profile)