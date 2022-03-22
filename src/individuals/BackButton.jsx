import React from 'react'
import { useTranslation } from 'react-i18next'

function BackButton() {
    const { t } = useTranslation()
    return <div className='w-100 text-center'>
        <button className='btn btn-link' onClick={() => window.history.back()}>
            &larr; {t('back')}
        </button>
    </div>
}

export default BackButton