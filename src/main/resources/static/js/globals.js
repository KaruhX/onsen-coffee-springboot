// Variables globales (sin persistencia)
let LOGGED_USER = "";
let COFFEE_CARD_TEMPLATE = "";
let COFFEE_DETAIL_TEMPLATE = "";
let REGISTER_TEMPLATE = "";
let LOGIN_TEMPLATE = "";
let CART_TEMPLATE = "";

// Sesión en memoria (se resetea al recargar la página)
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
