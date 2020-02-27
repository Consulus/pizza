// variables

const cartBtn = document.querySelector('.cart-btn'),
	closeCartBtn = document.querySelector('.close-cart'),
	clearCartBtn = document.querySelector('.clear-cart'),
	cartDOM = document.querySelector('.cart'),
	cartOverlay = document.querySelector('.cart-overlay'),
	cartItems = document.querySelector('.cart-items'),
	cartTotal = document.querySelector('.cart-total'),
	cartContent = document.querySelector('.cart-content'),
	productsDOM = document.querySelector('.products-center');

let data = {
	"items": [{
			"sys": {
				"id": "1"
			},
			"fields": {
				"title": "Пепперони",
				"price": 300,
				"image": {
					"fields": {
						"file": {
							"url": "./images/MyImages/pizza1.jpg"
						}
					}
				}
			}
		},
		{
			"sys": {
				"id": "2"
			},
			"fields": {
				"title": "Цезарь",
				"price": 390,
				"image": {
					"fields": {
						"file": {
							"url": "./images/MyImages/pizza2.jpg"
						}
					}
				}
			}
		},
		{
			"sys": {
				"id": "3"
			},
			"fields": {
				"title": "Итальяно",
				"price": 450,
				"image": {
					"fields": {
						"file": {
							"url": "./images/MyImages/pizza3.jpg"
						}
					}
				}
			}
		},
		{
			"sys": {
				"id": "4"
			},
			"fields": {
				"title": "Микс",
				"price": 250,
				"image": {
					"fields": {
						"file": {
							"url": "./images/MyImages/pizza4.jpg"
						}
					}
				}
			}
		},
		{
			"sys": {
				"id": "5"
			},
			"fields": {
				"title": "Калужская",
				"price": 450,
				"image": {
					"fields": {
						"file": {
							"url": "./images/MyImages/pizza5.jpg"
						}
					}
				}
			}
		},
		{
			"sys": {
				"id": "6"
			},
			"fields": {
				"title": "Салями",
				"price": 350,
				"image": {
					"fields": {
						"file": {
							"url": "./images/MyImages/pizza6.jpg"
						}
					}
				}
			}
		},
		{
			"sys": {
				"id": "7"
			},
			"fields": {
				"title": "Арамато",
				"price": 200,
				"image": {
					"fields": {
						"file": {
							"url": "./images/MyImages/pizza7.jpg"
						}
					}
				}
			}
		},
		{
			"sys": {
				"id": "8"
			},
			"fields": {
				"title": "Кармадо",
				"price": 500,
				"image": {
					"fields": {
						"file": {
							"url": "./images/MyImages/pizza8.jpg"
						}
					}
				}
			}
		}
	]
};
// cart
let cart = [];
// buttons
let buttonsDOM = [];

// getting the products
class Products {
	async getProducts() {
		try {
			let products = data["items"];
			products = products.map((item) => {
				const {
					title,
					price
				} = item.fields;
				const {
					id
				} = item.sys;
				const image = item.fields.image.fields.file.url;
				return {
					title,
					price,
					id,
					image
				};
			});
			return products;
		} catch (error) {
			console.log(error);
		}
	}
}

// display products
class UI {
	displayProducts(products) {
		let result = '';
		products.forEach((product) => {
			result += `
            <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        добавить
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>${product.price} Р</h4>
            </article>
            <!-- end of single product -->
                        `;
		});
		productsDOM.innerHTML = result;
	}
	getBagButtons() {
		const buttons = [...document.querySelectorAll('.bag-btn')];
		buttonsDOM = buttons;
		buttons.forEach((button) => {
			let id = button.dataset.id;
			let inCart = cart.find((item) => item.id === id);
			if (inCart) {
				button.innerText = 'Уже в корзине';
				button.disabled = true;
			}
			button.addEventListener('click', (event) => {
				event.target.innerText = 'Уже в корзине';
				event.target.disabled = true;
				// get product from products
				let cartItem = {
					...Storage.getProduct(id),
					amount: 1
				};

				// add product to the cart
				cart = [...cart, cartItem];
				// save cart in local storage
				Storage.saveCart(cart);
				// set cart values
				this.setCartValues(cart);
				// display cart item
				this.addCartItem(cartItem);
				// show the cart

				//ЗАККОМЕНТИРОВАЛ ПОТОМУ ЧТО НЕ НРАВИТСЯ
				//this.showCart();
			});
		});
	}
	setCartValues(cart) {
		let tempTotal = 0;
		let itemsTotal = 0;
		cart.map((item) => {
			tempTotal += item.price * item.amount;
			itemsTotal += item.amount;
		});
		cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
		cartItems.innerText = itemsTotal;
	}
	addCartItem(item) {
		const div = document.createElement('div');
		div.classList.add('cart-item');
		div.innerHTML = `<img src=${item.image} alt="product"/>
							<div>
								<h4>${item.title}</h4>
								<h5>${item.price} Р</h5>
								<span class="remove-item" data-id=${item.id}>удалить</span>
							</div>
							<div>
								<i class="fas fa-chevron-up" data-id=${item.id}></i>
								<p class="item-amount">${item.amount}</p>
								<i class="fas fa-chevron-down" data-id=${item.id}></i>
							</div>`;
		cartContent.appendChild(div);
	}
	showCart() {
		cartOverlay.classList.add('transparentBcg');
		cartDOM.classList.add('showCart');
	}
	setupAPP() {
		cart = Storage.getCart();
		this.setCartValues(cart);
		this.populateCart(cart);
		cartBtn.addEventListener('click', this.showCart);
		closeCartBtn.addEventListener('click', this.hideCart);
	}
	populateCart(cart) {
		cart.forEach((item) => this.addCartItem(item));
	}
	hideCart() {
		cartOverlay.classList.remove('transparentBcg');
		cartDOM.classList.remove('showCart');
	}
	cartLogic() {
		clearCartBtn.addEventListener('click', () => {
			this.clearCart();
		});
		cartContent.addEventListener('click', event => {
			if (event.target.classList.contains('remove-item')) {
				let removeItem = event.target;
				let id = removeItem.dataset.id;
				cartContent.removeChild(removeItem.parentElement.parentElement);
				this.removeItem(id);
			} else if (event.target.classList.contains('fa-chevron-up')) {
				let addAmount = event.target;
				let id = addAmount.dataset.id;
				let tempItem = cart.find(item => item.id === id);
				tempItem.amount = tempItem.amount + 1;
				Storage.saveCart(cart);
				this.setCartValues(cart);
				addAmount.nextElementSibling.innerText = tempItem.amount;
			} else if (event.target.classList.contains('fa-chevron-down')) {
				let lowerAmount = event.target;
				let id = lowerAmount.dataset.id;
				let tempItem = cart.find(item => item.id === id);
				tempItem.amount = tempItem.amount - 1;
				if (tempItem.amount > 0) {
					Storage.saveCart(cart);
					this.setCartValues(cart);
					lowerAmount.previousElementSibling.innerText = tempItem.amount;
				} else {
					cartContent.removeChild(lowerAmount.parentElement.parentElement);
					this.removeItem(id);
				}
			}
		});
	}
	clearCart() {
		let cartItems = cart.map((item) => item.id);
		cartItems.forEach((id) => this.removeItem(id));
		while (cartContent.children.length > 0) {
			cartContent.removeChild(cartContent.children[0]);
		}
		//this.hideCart();
	}
	removeItem(id) {
		cart = cart.filter((item) => item.id !== id);
		this.setCartValues(cart);
		Storage.saveCart(cart);
		let button = this.getSingleButton(id);
		button.disabled = false;
		button.innerHTML = `<i class="fas fa-shopping-cart"></i>добавить`;
	}
	getSingleButton(id) {
		return buttonsDOM.find((button) => button.dataset.id === id);
	}
}

// local storage
class Storage {
	static saveProducts(products) {
		localStorage.setItem('products', JSON.stringify(products));
	}
	static getProduct(id) {
		let products = JSON.parse(localStorage.getItem('products'));
		return products.find((product) => product.id === id);
	}
	static saveCart() {
		localStorage.setItem('cart', JSON.stringify(cart));
	}
	static getCart() {
		return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const ui = new UI(),
		products = new Products();
	// setup app
	ui.setupAPP();

	// get all products
	products
		.getProducts()
		.then((products) => {
			ui.displayProducts(products);
			Storage.saveProducts(products);
		})
		.then(() => {
			ui.getBagButtons();
			ui.cartLogic();
		});
});