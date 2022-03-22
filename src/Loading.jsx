import React from 'react'
import LoadingSpinner from './LoadingSpinner'

function Loading() {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <LoadingSpinner />
        </div>
    )
}

export default Loading