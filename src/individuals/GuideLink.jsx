import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next'
import messageprovider from '../m/Messageprovider';
import { Link } from 'react-router-dom';

function GuideLink() {
    const { t } = useTranslation()
    const [guideLang, setGuideLang] = useState('/guide/en')
    useEffect(() => {
        const lang = messageprovider.getlang()
        if (lang.includes('ru')) {
            setGuideLang('/guide/ru')
        }
    }, [guideLang])
    return (
        <Link to={guideLang} className='w-100 text-right mx-3'>
            <cite className='initialism'><small>{t('guide')}</small></cite>
        </Link>)
}

export default GuideLink