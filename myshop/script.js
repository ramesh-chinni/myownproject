// ================= PRODUCTS =================
// data api: https://xjfecltgrewjvqkgbxwz.supabase.co/rest/v1/
//puiblde key sb_publishable_261JcJ6C6lJOPUVeLmzoFA_NPXlFXoB
const SUPABASE_URL =
    "https://xjfecltgrewjvqkgbxwz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_261JcJ6C6lJOPUVeLmzoFA_NPXlFXoB";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
async function loadProductsFromSupabase() {

    const { data, error } = await supabaseClient
        .from("products")
        .select("*");

    if (error) {

        console.error("Error:", error);

        return;
    }

    console.log(
        "Products from Supabase:",
        data
    );

    products.length = 0;

    data.forEach(function(product) {

        products.push(product);

    });

    displayProducts(products);
}



let products = [

    {
        id: 1,
        name: "Classic T-Shirt",
        price: 499,
        category: "Men",
        rating: "⭐ 4.5",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        description:
            "Comfortable classic T-shirt made with quality fabric."
    },

    {
        id: 2,
        name: "Running Shoes",
        price: 999,
        category: "Shoes",
        rating: "⭐ 4.7",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        description:
            "Lightweight running shoes designed for everyday comfort."
    },

    {
        id: 3,
        name: "Smart Watch",
        price: 1499,
        category: "Accessories",
        rating: "⭐ 4.6",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        description:
            "Modern smart watch with a stylish design."
    },

    {
        id: 4,
        name: "Travel Bag",
        price: 799,
        category: "Accessories",
        rating: "⭐ 4.4",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        description:
            "Durable travel bag suitable for short and long trips."
    },

    {
        id: 5,
        name: "Women's Dress",
        price: 899,
        category: "Women",
        rating: "⭐ 4.8",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
        description:
            "Elegant women's dress with a comfortable and stylish design."
    },

    {
        id: 6,
        name: "Men's Jacket",
        price: 1299,
        category: "Men",
        rating: "⭐ 4.5",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        description:
            "Stylish men's jacket suitable for casual occasions."
    }

];


// ================= SELECT ELEMENTS =================

const productContainer =
    document.getElementById("productContainer");

const searchInput =
    document.getElementById("searchInput");

const noProducts =
    document.getElementById("noProducts");

const categoryButtons =
    document.querySelectorAll(".category-btn");

const cartCount =
    document.getElementById("cartCount");

const cartContainer =
    document.getElementById("cartContainer");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutButton =
    document.getElementById("checkoutButton");

const checkout =
    document.getElementById("checkout");

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const checkoutForm =
    document.getElementById("checkoutForm");


// Product Details

const productDetails =
    document.getElementById("productDetails");

const detailsImage =
    document.getElementById("detailsImage");

const detailsName =
    document.getElementById("detailsName");

const detailsPrice =
    document.getElementById("detailsPrice");

const detailsCategory =
    document.getElementById("detailsCategory");

const detailsRating =
    document.getElementById("detailsRating");

const detailsDescription =
    document.getElementById("detailsDescription");

const detailsAddCart =
    document.getElementById("detailsAddCart");

const backToProducts =
    document.getElementById("backToProducts");


// Login

const loginButton =
    document.getElementById("loginButton");

const auth =
    document.getElementById("auth");

const authTitle =
    document.getElementById("authTitle");

const authForm =
    document.getElementById("authForm");

const authName =
    document.getElementById("authName");

const authEmail =
    document.getElementById("authEmail");

const authPassword =
    document.getElementById("authPassword");

const authSwitch =
    document.getElementById("authSwitch");


// ================= VARIABLES =================

let selectedCategory = "All";

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];

let isRegister = false;

let selectedProduct = null;


// ================= DISPLAY PRODUCTS =================

function displayProducts(productList) {

    productContainer.innerHTML = "";


    if (productList.length === 0) {

        noProducts.style.display =
            "block";

        return;

    }


    noProducts.style.display =
        "none";


    productList.forEach(
        function(product) {

            const productCard =
                document.createElement("div");


            productCard.classList.add(
                "product-card"
            );


            productCard.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-image"
                >

                <h3>
                    ${product.name}
                </h3>

                <p class="price">
                    ₹${product.price}
                </p>

                <p class="rating">
                    ${product.rating}
                </p>

                <button
                    class="add-cart"
                    data-id="${product.id}">

                    Add to Cart

                </button>

                <button
                    class="view-details"
                    data-id="${product.id}">

                    View Details

                </button>

            `;


            productContainer.appendChild(
                productCard
            );

        }
    );

}


// ================= FILTER PRODUCTS =================

function filterProducts() {

    const searchText =
        searchInput.value.toLowerCase();


    const filteredProducts =
        products.filter(
            function(product) {

                const searchMatch =
                    product.name
                        .toLowerCase()
                        .includes(searchText);


                const categoryMatch =
                    selectedCategory === "All" ||
                    product.category ===
                    selectedCategory;


                return (
                    searchMatch &&
                    categoryMatch
                );

            }
        );


    displayProducts(
        filteredProducts
    );

}


// ================= SEARCH =================

searchInput.addEventListener(
    "input",
    function() {

        filterProducts();

    }
);


// ================= CATEGORY =================

categoryButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                selectedCategory =
                    button.dataset.category;


                categoryButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                filterProducts();

            }
        );

    }
);


// ================= ADD TO CART =================

function addToCart(product) {

    const existingProduct =
        cart.find(
            function(item) {

                return item.id ===
                    product.id;

            }
        );


    if (existingProduct) {

        existingProduct.quantity++;

    }

    else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    saveCart();

    updateCartCount();

    displayCart();

}


// ================= PRODUCT BUTTONS =================

productContainer.addEventListener(
    "click",
    function(event) {

        const id =
            Number(
                event.target.dataset.id
            );


        const product =
            products.find(
                function(item) {

                    return item.id === id;

                }
            );


        if (!product) {

            return;

        }


        // Add to Cart

        if (
            event.target.classList.contains(
                "add-cart"
            )
        ) {

            addToCart(product);

            alert(
                product.name +
                " added to cart!"
            );

        }


        // View Details

        if (
            event.target.classList.contains(
                "view-details"
            )
        ) {

            showProductDetails(
                product
            );

        }

    }
);


// ================= SAVE CART =================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ================= UPDATE CART COUNT =================

function updateCartCount() {

    let count = 0;


    cart.forEach(
        function(product) {

            count +=
                product.quantity;

        }
    );


    cartCount.textContent =
        count;

}


// ================= DISPLAY CART =================

function displayCart() {

    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent =
            "0";

        return;

    }


    let total = 0;


    cart.forEach(
        function(product, index) {

            total +=
                product.price *
                product.quantity;


            const cartItem =
                document.createElement("div");


            cartItem.classList.add(
                "cart-item"
            );


            cartItem.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="cart-item-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ₹${product.price}
                    </p>

                    <div>

                        <button
                            class="quantity-btn"
                            data-index="${index}"
                            data-action="decrease">

                            -

                        </button>


                        <span>
                            ${product.quantity}
                        </span>


                        <button
                            class="quantity-btn"
                            data-index="${index}"
                            data-action="increase">

                            +

                        </button>

                    </div>

                </div>


                <button
                    class="remove-btn"
                    data-index="${index}">

                    Remove

                </button>

            `;


            cartContainer.appendChild(
                cartItem
            );

        }
    );


    cartTotal.textContent =
        total;

}


// ================= CART ACTIONS =================

cartContainer.addEventListener(
    "click",
    function(event) {

        const index =
            Number(
                event.target.dataset.index
            );


        const action =
            event.target.dataset.action;


        if (action === "increase") {

            cart[index].quantity++;

        }


        if (action === "decrease") {

            cart[index].quantity--;


            if (
                cart[index].quantity <= 0
            ) {

                cart.splice(index, 1);

            }

        }


        if (
            event.target.classList.contains(
                "remove-btn"
            )
        ) {

            cart.splice(index, 1);

        }


        saveCart();

        updateCartCount();

        displayCart();

    }
);


// ================= PRODUCT DETAILS =================

function showProductDetails(product) {

    selectedProduct =
        product;


    detailsImage.src =
        product.image;


    detailsName.textContent =
        product.name;


    detailsPrice.textContent =
        "₹" + product.price;


    detailsCategory.textContent =
        product.category;


    detailsRating.textContent =
        product.rating;


    detailsDescription.textContent =
        product.description;


    productDetails.style.display =
        "block";


    productDetails.scrollIntoView({
        behavior: "smooth"
    });

}


// ================= DETAILS ADD TO CART =================

detailsAddCart.addEventListener(
    "click",
    function() {

        if (!selectedProduct) {

            return;

        }


        addToCart(
            selectedProduct
        );


        alert(
            selectedProduct.name +
            " added to cart!"
        );

    }
);


// ================= BACK TO PRODUCTS =================

backToProducts.addEventListener(
    "click",
    function() {

        productDetails.style.display =
            "none";


        document
            .getElementById("products")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// ================= CHECKOUT =================

checkoutButton.addEventListener(
    "click",
    function() {

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        checkout.style.display =
            "block";


        displayCheckout();


        checkout.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ================= DISPLAY CHECKOUT =================

function displayCheckout() {

    checkoutItems.innerHTML = "";


    let total = 0;


    cart.forEach(
        function(product) {

            const itemTotal =
                product.price *
                product.quantity;


            total +=
                itemTotal;


            const item =
                document.createElement("div");


            item.classList.add(
                "checkout-item"
            );


            item.innerHTML = `

                <span>
                    ${product.name}
                    × ${product.quantity}
                </span>

                <span>
                    ₹${itemTotal}
                </span>

            `;


            checkoutItems.appendChild(
                item
            );

        }
    );


    checkoutTotal.textContent =
        total;

}


// ================= PLACE ORDER =================

checkoutForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        const name =
            document.getElementById(
                "customerName"
            ).value;


        alert(
            "Order placed successfully, " +
            name +
            "!"
        );


        cart = [];


        saveCart();

        updateCartCount();

        displayCart();


        checkoutForm.reset();


        checkout.style.display =
            "none";

    }
);


// ================= LOGIN =================

loginButton.addEventListener(
    "click",
    function() {

        const savedUser =
            JSON.parse(
                localStorage.getItem("user")
            );


        if (savedUser) {

            const logout =
                confirm(
                    "Do you want to logout?"
                );


            if (logout) {

                localStorage.removeItem(
                    "user"
                );


                loginButton.textContent =
                    "Login";


                alert(
                    "Logged out successfully!"
                );

            }


            return;

        }


        auth.style.display =
            "block";


        auth.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ================= LOGIN / REGISTER SWITCH =================

function updateAuthMode() {

    if (isRegister) {

        authTitle.textContent =
            "Register";


        authName.style.display =
            "block";


        authName.required =
            true;


        authForm.querySelector(
            "button"
        ).textContent =
            "Register";


        authSwitch.innerHTML = `
            Already have an account?
            <span id="switchAuth">
                Login
            </span>
        `;

    }

    else {

        authTitle.textContent =
            "Login";


        authName.style.display =
            "none";


        authName.required =
            false;


        authForm.querySelector(
            "button"
        ).textContent =
            "Login";


        authSwitch.innerHTML = `
            Don't have an account?
            <span id="switchAuth">
                Register
            </span>
        `;

    }


    document
        .getElementById("switchAuth")
        .addEventListener(
            "click",
            function() {

                isRegister =
                    !isRegister;


                updateAuthMode();

            }
        );

}


// ================= AUTH FORM =================

// ================= AUTH FORM =================

authForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = authName.value.trim();
    const email = authEmail.value.trim();
    const password = authPassword.value;

    // ================= REGISTER =================

    if (isRegister) {

        const { data, error } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name
                    }
                }
            });

        if (error) {

            alert(error.message);

            return;
        }

        alert("Registration successful!");

        authForm.reset();

        auth.style.display = "none";

        return;
    }


    // ================= LOGIN =================

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {

        alert(error.message);

        return;
    }

    const user =
        data.user;

    const userName =
        user.user_metadata?.name || email;

    loginButton.textContent =
        "Welcome, " + userName;

    alert("Login successful!");

    authForm.reset();

    auth.style.display = "none";

});

// Load products from Supabase on initial page load
loadProductsFromSupabase();