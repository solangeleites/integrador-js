const d = document;
// Menu toggle:
const $barsMenu = d.querySelector('.bars-menu')
const $navbarList = d.querySelector('.navbar-list')
// Carrito:
const $carritoBtn = d.querySelector('.icono-carrito')
const  $carritoMenu = d.querySelector ('.carrito')
// Filter by:
const $filterBy = d.querySelector('.filter-by')
const $filterToShow = d.querySelector('.filter')
// Contenedor de filtros y filtros:
const $containerFilteredCards = d.querySelector('.cards')
const $containerFilters = d.querySelector('.filter')
const $filters = d.querySelectorAll('.category')
// Botón de ver más:
const $btnSeeMore = d.querySelector('#btn-more')
// Contenedor de la section blog:
const $containerCardsBlog = d.querySelector('.cards-blog')
// Elementos para la validación del formulario:
const $form = d.querySelector('#form')
const $name = d.querySelector('#name')
const $email = d.querySelector('#email')
const $telephone = d.querySelector ('#phone')
// Botón para vaciar y botón para comprar:
const $EmptyCart = d.querySelector('.btn-vaciar-carrito')
const $buyBtn = d.querySelector('.btn-comprar')
// Modal para mostrar que se agrego un prod. al carrito:
const $modal = d.querySelector('.add-modal')
// Contenedor de carrito y total:
const $containerCart = d.querySelector('.carrito-productos')
const $totalCart = d.querySelector('.carrito-total')
const $total = d.querySelector('.total')




// ?Seteamos el carrito , vacío o lo que este en el localStorage según corresponda, igual que en los proyectos anteriores
let cart = JSON.parse(localStorage.getItem("cart")) || [];

//?Función para guardar el carrito en el localStorage
const saveLocalStorage = (cartProduct) => {
  localStorage.setItem("cart", JSON.stringify(cartProduct));
};









//? Funciones para la validacion del form
const validForm = e => {
    e.preventDefault();
    let isValidUsername = checkUsername();
    let isValidEmail = checkEmail();
    let isValidTelephone = checkPhone();

    let isFormValid = isValidUsername &&  isValidEmail && isValidTelephone;
    if (isFormValid){
        alert('Tu reserva fue recibida con exito!')
        $form.submit()
    }
}
const isEmpty = value => (value === '' ? false : true);
const checkLength = (length, min, max) => 
length < min || length > max ? false : true;
const checkUsername = () => {
    let valid = false;
    const min = 3;
    const max = 25;
    const username = $name.value.trim()
    if(!isEmpty(username)){
        showError($name, 'The name is required.')
    } else if (!checkLength(username.length, min, max)){
        showError($name, `The name must contain between ${min} and ${max} characters.`)
    } else {
        showSuccess($name);
        valid = true;
    }
    return valid;
}
const isValidEmail = email => {
    const re = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
    return re.test(email);
}
const checkEmail = () => {
    let valid = false;
    const email = $email.value.trim();
    if(!isEmpty(email)){
        showError($email, 'Email is required.')
    } else if (!isValidEmail(email)){
        showError($email, 'The email is not valid.')
    } else {
        showSuccess($email)
        valid = true
    }
    return valid;
}
const isValidPhone = phone => {
    const re = /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/
    return re.test(phone)
}
const checkPhone = () => {
let valid = false
const phone = $telephone.value.trim()
if (!isEmpty(phone)) {
    showError($telephone, `The phone is required.`)
} else if (!isValidPhone(phone)){   
    showError($telephone, `The phone is not valid.`)
} else {
    showSuccess($telephone)
    valid = true
}
return valid;
}
const showError = (input, message) => {
    let formfield = input.parentElement;
    formfield.classList.remove('success');
    formfield.classList.add('error')
    const error = formfield.querySelector('small');
    error.textContent = message
}
const showSuccess = (input) => {
    let formfield = input.parentElement;
    formfield.classList.remove('error')
    formfield.classList.add('success')
    const error = formfield.querySelector('small');
    error.textContent = '';
}
const debounce = (fn, delay = 500) => {
    let timeoutId;
    return(...args) =>{
        if(timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(null, args);
        }, delay)
    }
}
//? Funcion para renderizar el html.
const renderProduct = products => {
    const {id,name, price, img, description} = products;
    return`<div class="card">
                <img src=${img} alt=${name}  class="img-card">
                    <div class="card-text">
                        <h4>${name}</h4>
                        <span class="price">${price}EUR</span>
                    </div>
            <div class="card-description">
                <p>${description}</p>
            </div>
            <div class="card-btn">
                <button class="btn-add" 
                data-id= '${id}'
                data-name= '${name}'
                data-price= '${price}'
                data-img= '${img}'>Add to cart</button>
            </div> 
            </div>`
}
const renderProducts = (index = 0, category = undefined) => {
    if (!category){
        renderDivideProducts(index);
        return
    }
    renderFilteredProducts(category)
}
const renderDivideProducts = (index = 0) => {
    $containerFilteredCards.innerHTML += productsController.dividedProducts[index].map(renderProduct).join('')
}
//? Funciones para renderizar el filtro por categorias.
const applyFilter = (e) => {
    if(!e.target.classList.contains('category'))return;
    changeFilter(e)
}
const changeFilter = e => {
    const selectedCategory = e.target.dataset.category;
    if(!selectedCategory){
        $containerFilteredCards.innerHTML = '';
        renderProducts();
    } else {
        renderProducts(0, selectedCategory)
    }
}
const renderFilteredProducts = (category) => {
    const productList = products.filter((product) => product.category === category);
    $containerFilteredCards.innerHTML = productList.map(renderProduct).join('')
}
//? Funciones para abrir el menu toggle y el carrito.
const openMenu = () => {
    $navbarList.classList.toggle('open-menu')
}
const openCarrito = () => {
    $carritoMenu.classList.toggle('open-carrito')
}
const openFilter = () => {
    $filterToShow.classList.toggle('open-filter')
}





//? Empiezo a crear funciones para agregar productos al querido carrito
const renderCartProduct = (cartProduct) => {
    const {id, name, img, price, quantity} = cartProduct
    return`
            <div class="cart-item">
                <img src="${img}" alt="${name}" class="img-cart-item">
            <div class="text-cartProd">
                <h3>${name}</h3>
                <p>${price}EUR</p>
            </div>
            <div class="counter-cartProd">
                <span class="quantity-counter up" data-id="${id}">+</span>
                <span class="quantity">${quantity}</span> 
                <span class="quantity-counter down" data-id="${id}"> - </span>
            </div>
            </div>`
}
const renderCart = () => {
    if(!cart.length){
        $containerCart.innerHTML = `<p class="empty-msg">No hay productos en el carrito.</p>`
        return;
    }
    $containerCart.innerHTML = cart.map(renderCartProduct).join('')
}
const getCartTotal = () => cart.reduce((acc, cur) => acc + Number(cur.price) * cur.quantity, 0)
const showTotal = () =>{
    $total.innerHTML = `${getCartTotal().toFixed(2)} EUR`
}
const disableBtn = (btn) => {
    if(!cart.length){
        btn.classList.add('disabled')
    } else {
        btn.classList.remove('disabled')
    }
}

const createProducts = (id, name, price, img)=>{
    return{id,name, price,img}
}
const isExistingCartProd = (product) => {
return cart.find(item => item.id === product.id)
}
const addUnitProd = (product) => {
    cart = cart.map((cartProduct) =>
        cartProduct.id === product.id 
        ? {... cartProduct, quantity: cartProduct.quantity + 1}
        :cartProduct
    )}

const createCartProd = (product) => {
    cart = [ ...cart, {...product, quantity: 1}]
}
const checkStateCart = () => {
    saveLocalStorage(cart)
    renderCart(cart)
    showTotal(cart)
    disableBtn($buyBtn)
    disableBtn($EmptyCart)
}
const addProduct = (e) => {
    if(!e.target.classList.contains("btn-add")) return;
    let {id, name, price, img} = e.target.dataset;
    const product = createProducts(id, name, price, img)

    if(isExistingCartProd(product)){
        addUnitProd(product)
        modalAddProd("Se  agregó una unidad más al carrito")
    } else {
        createCartProd(product)
        modalAddProd("El producto se agregó al carrito")
    }
    checkStateCart()
}

// ? Funciónes para sumar y restar desde el carrito
const addBtn = (id) => {
    let existingCartProd = cart.find((item) => item.id === id)
    addUnitProd(existingCartProd)
}
const handleQuantity = (e) =>{
    if(e.target.classList.contains('down')){
        downBtn(e.target.dataset.id)
    } else if (e.target.classList.contains('up')){
        addBtn(e.target.dataset.id)
    }
    checkStateCart()
}
const downBtn = (id) => {
    let existingCartProd = cart.find((item) => item.id === id)
    if(existingCartProd.quantity === 1){
        if(window.confirm('¿Desea eliminar el producto del carrito?')){
            removeProdCart(existingCartProd)
        }return;
    }
    lessBtn(existingCartProd)
}
const removeProdCart = (existingCartProd) => {
    cart = cart.filter(product => product.id !== existingCartProd.id)
    checkStateCart()
}
const lessBtn = (existingCartProd) => {
    cart  = cart.map(product => {
        return product.id === existingCartProd.id ? { ...product, quantity: Number(product.quantity) - 1}
        : product
    })
}
// ? Funciones para los botones de  comprar y borrar carrito
const resetCart = () => {
    cart = []
    checkStateCart()
}
const completeCartAction = (confirmMsg, successMsg) => {
    if (!cart.length) return;
    if(window.confirm(confirmMsg)){
        resetCart()
        alert(successMsg)
    }
}
const completeBuy = () => {
    completeCartAction('Desea completar su compra?', 'Gracias por tu compra, vuelve pronto!')
}
const btnEmptyCart = () => {
    completeCartAction('Desea vaciar el carrito?', 'No hay productos en el carrito')
}





//? Función para el modal
const modalAddProd = (message) => {
    $modal.classList.add('show-modal');
    $modal.textContent = message
    setTimeout(() => {
        $modal.classList.remove('show-modal')
    },2000)
}














//* Función inicializadora.
const init = () => {
    $barsMenu.addEventListener('click', openMenu)
    $carritoBtn.addEventListener('click', openCarrito)
    $filterBy.addEventListener('click', openFilter)
    renderProducts()
    $containerFilters.addEventListener('click', applyFilter)
    $form.addEventListener('submit', validForm)   
    $form.addEventListener('input', debounce (e => {
        switch(e.target.id){
            case 'name':
                checkUsername();
                break;
                case 'email':
                    checkEmail();
                    break
                    case 'phone':
                        checkPhone();
                        break
        }
    }))
    document.addEventListener('DOMContentLoaded', renderCart)
    document.addEventListener('DOMContentLoaded', showTotal)
    disableBtn($EmptyCart)
    disableBtn($buyBtn)
    $containerFilteredCards.addEventListener('click', addProduct)
    $containerCart.addEventListener('click', handleQuantity)
    $buyBtn.addEventListener('click', completeBuy)
    $EmptyCart.addEventListener('click', btnEmptyCart)

}
init()