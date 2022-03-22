import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom';
import messageprovider from '../m/Messageprovider';

function PolicyFooter() {
    const { t } = useTranslation()
    const [guideLang, setGuideLang] = useState('/guide/en')
    const [cookiePolicy, setCookiePolicy] = useState('/cookie-policy/en')
    const [privacyPolicy, setPrivacyPolicy] = useState('/privacy-policy/en')
    useEffect(() => {
        const lang = messageprovider.getlang()
        if (lang.includes('ru')) {
            setGuideLang('/guide/ru')
            setCookiePolicy('/cookie-policy/ru')
            setPrivacyPolicy('/privacy-policy/ru')
        }
    }, [guideLang, cookiePolicy, privacyPolicy])
    return <footer className='footer bg-dark bottom top-radius w-100 py-2'>
        <Link to={cookiePolicy} className='text-muted px-2 text-nowrap'>{t('cookiepolicy')}</Link>
        <Link to={privacyPolicy} className='text-muted px-2 text-nowrap'>{t('privacypolicy')}</Link>
    </footer>
}

export default PolicyFooter