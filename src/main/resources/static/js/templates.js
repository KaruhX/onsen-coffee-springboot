fetch("mustache-templates/coffee-card.html")
    .then(response => response.text())
    .then(template => {
        COFFEE_CARD_TEMPLATE = template
    })
    .catch(error => console.error('Error cargando template coffee-card:', error))

fetch("mustache-templates/coffee-detail.html")
    .then(response => response.text())
    .then(template => {
        COFFEE_DETAIL_TEMPLATE = template
    })
    .catch(error => console.error('Error cargando template coffee-detail:', error))

fetch("mustache-templates/register.html")
    .then(response => response.text())
    .then(template => {
        REGISTER_TEMPLATE = template
    })
    .catch(error => console.error('Error cargando template register:', error))

fetch("mustache-templates/login.html")
    .then(response => response.text())
    .then(template => {
        LOGIN_TEMPLATE = template
    })
    .catch(error => console.error('Error cargando template login:', error))

fetch("mustache-templates/cart.html")
    .then(response => response.text())
    .then(template => {
        CART_TEMPLATE = template
    })
    .catch(error => console.error('Error cargando template cart:', error))

