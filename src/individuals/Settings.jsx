import React from 'react'
import { useTranslation } from 'react-i18next'
import i18n from './../i18n'
import BackButton from './BackButton'

function Settings() {
    const { t } = useTranslation()
    function onClick(lang) {
        document.cookie = `lang=${lang}; max-age=31536000; samesite=strict; path=/`
        i18n.changeLanguage()
        if (!document.cookie.includes("accepted=true")){
            window.location.reload()
        }
    }
    return (
        <div>
            <nav className="navbar bg-secondary text-light justify-content-between w-100 rounded">
                <div>
                    {t('language')}
                </div>
                <div>
                    <img onClick={() => onClick('en')} className='mx-2 pointer' src="/united-kingdom.svg" alt="english" title='english' width='40' />
                    <img onClick={() => onClick('ru')} className='mx-2 pointer' src="/russia.svg" alt="русский язык" title='русский язык' width='40' />
                </div>
            </nav>
            <BackButton />
        </div>
    )
}

export default Settings