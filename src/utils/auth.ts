import Cookies from 'js-cookie'
const tokenKey = 'token'

export function getToken() {
    return Cookies.get(tokenKey)
}

export function setToken(token: string) {
    Cookies.set(tokenKey, token)
}

export function removeToken() {
    Cookies.remove(tokenKey)
}