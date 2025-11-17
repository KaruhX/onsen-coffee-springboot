
let LOGGED_USER = "";
let COFFEE_CARD_TEMPLATE = "";
let COFFEE_DETAIL_TEMPLATE = "";
let REGISTER_TEMPLATE = "";
let LOGIN_TEMPLATE = "";
let CART_TEMPLATE = "";

function isUserLoggedIn() {
    return LOGGED_USER !== "";
}

function setUserSession(userName) {
    LOGGED_USER = userName;
}

function clearUserSession() {
    LOGGED_USER = "";
}

function getUserName() {
    return LOGGED_USER;
}

function logout() {
    clearUserSession();
}
