import config from '../configurations/config.json'

class Messageprovider {
    constructor() {
        this.button = localStorage.getItem("_sd")
        this.message = null
        this.avatar = null
        this.buttonState = false
        if (this.button !== null) {
            this.buttonState = true
        }
    }

    async isTokenValid() {
        if (this.buttonState) {
            this.button = localStorage.getItem("_sd")
            try {
                const response = await fetch(`${config.API}login/isv`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.button)
                })
                if (response.ok) {
                    const result = await response.json()
                    if (!result.loginText.includes("Invalid")) {
                        localStorage.setItem("_sd", result.loged)
                        const text = JSON.parse(result.loginText);
                        this.message = text.Message
                        this.avatar = text.Avatar
                        return true
                    }
                    else {
                        localStorage.removeItem("_sd")
                        this.buttonState = false
                        return false
                    }
                }
            }
            catch {
                return undefined
            }
        }
        else {
            return false
        }
    }

    async login(login, password, callBack) {
        const lang = this.getlang()
        const user = {
            login: login,
            password: password
        }
        try {
            const response = await fetch(`${config.API}login`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Accept-Language": lang,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            if (response.ok) {
                const result = await response.json()
                if (result.isLogedIn) {
                    localStorage.setItem("_sd", result.loged)
                    this.buttonState = true
                    callBack(result.isLogedIn, null, null)
                }
                else
                    callBack(result.isLogedIn, result.isNotFound, result.loginText)
            }
            else {
                callBack(false, true, null)
            }
        }
        catch {
            callBack(false, true, null)
        }
    }

    logout() {
        this.buttonState = false
        localStorage.removeItem("_sd")
        window.location.href = '/'
    }

    isMessageSent() {
        return this.buttonState
    }

    getMessage() {
        return this.message
    }

    getAvatar() {
        return this.avatar
    }

    async getActiveMessage() {
        try {
            const response = await fetch(`${config.API}individuals/${this.message}`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + this.avatar
                }
            })
            const result = await response.json()
            return await result
        }
        catch {
            return null
            /*localStorage.removeItem("_sd")
            window.location.href = '/'*/
        }
    }

    getlang() {
        let lang
        if (document.cookie.includes("lang=ru"))
            lang = "ru"
        else if (document.cookie.includes("lang=en"))
            lang = "en"
        else
            lang = navigator.language
        return lang
    }

}

export default new Messageprovider()