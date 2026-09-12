// ======================================================
// 1. GLOBAL VARIABLES
// ======================================================

let products = [];

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

let appliedCoupon = null;

let selectedProduct = null;


// ======================================================
// 2. GET HTML ELEMENTS
// ======================================================

const themeBtn =
    document.getElementById("themeBtn");

const wishlistBtn =
    document.getElementById("wishlistBtn");

const wishlistCount =
    document.getElementById("wishlistCount");

const cartBtn =
    document.getElementById("cartBtn");

const cartCount =
    document.getElementById("cartCount");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortFilter =
    document.getElementById("sortFilter");

const productsContainer =
    document.getElementById("products");

const productResult =
    document.getElementById("productResult");

const cartSidebar =
    document.getElementById("cartSidebar");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const couponInput =
    document.getElementById("couponInput");

const couponBtn =
    document.getElementById("couponBtn");

const couponMessage =
    document.getElementById("couponMessage");

const subtotal =
    document.getElementById("subtotal");

const discount =
    document.getElementById("discount");

const shipping =
    document.getElementById("shipping");

const grandTotal =
    document.getElementById("grandTotal");

const checkoutBtn =
    document.getElementById("checkoutBtn");

const wishlistSidebar =
    document.getElementById("wishlistSidebar");

const closeWishlist =
    document.getElementById("closeWishlist");

const wishlistItems =
    document.getElementById("wishlistItems");

const overlay =
    document.getElementById("overlay");

const productModal =
    document.getElementById("productModal");

const closeProductModal =
    document.getElementById("closeProductModal");

const detailImage =
    document.getElementById("detailImage");

const detailCategory =
    document.getElementById("detailCategory");

const detailName =
    document.getElementById("detailName");

const detailRating =
    document.getElementById("detailRating");

const detailPrice =
    document.getElementById("detailPrice");

const detailStock =
    document.getElementById("detailStock");

const detailDescription =
    document.getElementById("detailDescription");

const detailAddToCart =
    document.getElementById("detailAddToCart");

const checkoutModal =
    document.getElementById("checkoutModal");

const closeCheckout =
    document.getElementById("closeCheckout");

const checkoutForm =
    document.getElementById("checkoutForm");

const successModal =
    document.getElementById("successModal");

const orderId =
    document.getElementById("orderId");

const continueShopping =
    document.getElementById("continueShopping");


// ======================================================
// 3. FETCH 100 PRODUCTS
// ======================================================

async function fetchProducts() {

    try {

        const response = await fetch(
            "https://dummyjson.com/products?limit=194"
        );

        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }

        const data = await response.json();

        products = data.products.map((product) => {

            return {

                id: product.id,

                name: product.title,

                price: product.price,

                category: product.category,

                rating: product.rating,

                stock: product.stock,

                image: product.thumbnail,

                description: product.description

            };

        });


        // Check number of products

        console.log(
            "Total products:",
            products.length
        );


        // Create categories

        createCategories();


        // Display all 100 products

        displayProducts(products);


    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );

        productResult.textContent =
            "Unable to load products.";

    }

}


// ======================================================
// 4. CREATE CATEGORIES
// ======================================================

function createCategories() {

    const categories = [
        ...new Set(
            products.map(
                (product) =>
                    product.category
            )
        )
    ];


    categoryFilter.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;


    categories.forEach(
        (category) => {

            categoryFilter.innerHTML += `
                <option value="${category}">
                    ${category}
                </option>
            `;

        }
    );

}


// ======================================================
// 5. DISPLAY PRODUCTS
// ======================================================

function displayProducts(productList) {

    productsContainer.innerHTML = "";


    // Shows 100 Products Found

    productResult.textContent =
        `${productList.length} Products Found`;


    if (productList.length === 0) {

        productsContainer.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🔍
                </div>

                <h2>
                    No Products Found
                </h2>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;

    }


    productList.forEach(
        (product) => {

            const isWishlisted =
                wishlist.some(
                    (item) =>
                        item.id === product.id
                );


            const productCard =
                document.createElement("div");


            productCard.className =
                "product";


            productCard.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >


                    <button
                        class="wishlist ${
                            isWishlisted
                                ? "active"
                                : ""
                        }"
                        onclick="toggleWishlist(${product.id})"
                    >
                        ${
                            isWishlisted
                                ? "❤️"
                                : "♡"
                        }
                    </button>

                </div>


                <div class="product-category">

                    ${product.category}

                </div>


                <div class="product-name">

                    ${product.name}

                </div>


                <div class="rating">

                    ⭐ ${product.rating}

                </div>


                <div class="product-bottom">

                    <div class="product-price">

                        $${product.price.toFixed(2)}

                    </div>


                    <button
                        class="view-btn"
                        onclick="showProduct(${product.id})"
                    >
                        View
                    </button>

                </div>


                <div class="stock ${
                    product.stock <= 5
                        ? "low-stock"
                        : ""
                }">

                    ${
                        product.stock <= 5
                            ? `Only ${product.stock} left`
                            : `${product.stock} in stock`
                    }

                </div>


                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})"
                >
                    Add to Cart
                </button>

            `;


            productsContainer.appendChild(
                productCard
            );

        }
    );

}


// ======================================================
// 6. SEARCH + CATEGORY + SORT
// ======================================================

function applyFilters() {

    let filteredProducts =
        [...products];


    // SEARCH

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    if (searchValue !== "") {

        filteredProducts =
            filteredProducts.filter(
                (product) => {

                    return product.name
                        .toLowerCase()
                        .includes(searchValue);

                }
            );

    }


    // CATEGORY

    const selectedCategory =
        categoryFilter.value;


    if (
        selectedCategory !==
        "all"
    ) {

        filteredProducts =
            filteredProducts.filter(
                (product) => {

                    return (
                        product.category ===
                        selectedCategory
                    );

                }
            );

    }


    // SORT

    const selectedSort =
        sortFilter.value;


    if (
        selectedSort ===
        "price-low"
    ) {

        filteredProducts.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (
        selectedSort ===
        "price-high"
    ) {

        filteredProducts.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (
        selectedSort ===
        "rating"
    ) {

        filteredProducts.sort(
            (a, b) =>
                b.rating - a.rating
        );

    }


    if (
        selectedSort ===
        "name"
    ) {

        filteredProducts.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    displayProducts(
        filteredProducts
    );

}


// ======================================================
// 7. ADD TO CART
// ======================================================

function addToCart(id) {

    const selectedProduct =
        products.find(
            (product) =>
                product.id === id
        );


    if (!selectedProduct) {

        console.log(
            "Product not found:",
            id
        );

        return;

    }


    const existingProduct =
        cart.find(
            (item) =>
                item.id === id
        );


    if (existingProduct) {

        if (
            existingProduct.quantity <
            selectedProduct.stock
        ) {

            existingProduct.quantity++;

        } else {

            alert(
                "Maximum stock reached."
            );

            return;

        }

    } else {

        cart.push({

            ...selectedProduct,

            quantity: 1

        });

    }


    saveCart();

    updateCart();

    updateCartCount();


    // Close wishlist

    wishlistSidebar.classList.remove(
        "open"
    );


    // Open cart

    cartSidebar.classList.add(
        "open"
    );


    // Show overlay

    overlay.classList.add(
        "show"
    );

}


// ======================================================
// 8. SAVE CART
// ======================================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ======================================================
// 9. UPDATE CART
// ======================================================

function updateCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>
                    Your Cart is Empty
                </h2>

                <p>
                    Add some products
                    to your cart.
                </p>

            </div>

        `;

    } else {

        cart.forEach(
            (item) => {

                cartItems.innerHTML += `

                    <div class="cart-item">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >


                        <div>

                            <div class="cart-item-name">

                                ${item.name}

                            </div>


                            <div class="cart-item-price">

                                $${(
                                    item.price *
                                    item.quantity
                                ).toFixed(2)}

                            </div>


                            <div class="cart-controls">

                                <button
                                    class="qty-btn"
                                    onclick="changeQuantity(
                                        ${item.id},
                                        -1
                                    )"
                                >
                                    -
                                </button>


                                <span>
                                    ${item.quantity}
                                </span>


                                <button
                                    class="qty-btn"
                                    onclick="changeQuantity(
                                        ${item.id},
                                        1
                                    )"
                                >
                                    +
                                </button>


                                <button
                                    class="remove-btn"
                                    onclick="removeFromCart(
                                        ${item.id}
                                    )"
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    </div>

                `;

            }
        );

    }


    updateCartCount();

    updateSummary();

}


// ======================================================
// 10. CHANGE QUANTITY
// ======================================================

function changeQuantity(
    id,
    change
) {

    const item =
        cart.find(
            (product) =>
                product.id === id
        );


    if (!item) {

        return;

    }


    const product =
        products.find(
            (product) =>
                product.id === id
        );


    if (!product) {

        return;

    }


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;

    }


    if (
        item.quantity >
        product.stock
    ) {

        item.quantity =
            product.stock;

        alert(
            "Maximum stock reached."
        );

    }


    saveCart();

    updateCart();

}


// ======================================================
// 11. REMOVE FROM CART
// ======================================================

function removeFromCart(id) {

    cart =
        cart.filter(
            (item) =>
                item.id !== id
        );


    saveCart();

    updateCart();

}


// ======================================================
// 12. UPDATE CART COUNT
// ======================================================

function updateCartCount() {

    const totalQuantity =
        cart.reduce(
            (total, item) => {

                return (
                    total +
                    item.quantity
                );

            },
            0
        );


    cartCount.textContent =
        totalQuantity;

}


// ======================================================
// 13. UPDATE CART SUMMARY
// ======================================================

function updateSummary() {

    const subtotalValue =
        cart.reduce(
            (total, item) => {

                return (
                    total +
                    item.price *
                    item.quantity
                );

            },
            0
        );


    let discountValue = 0;


    if (
        appliedCoupon ===
        "SAVE10"
    ) {

        discountValue =
            subtotalValue * 0.10;

    }


    if (
        appliedCoupon ===
        "SAVE20"
    ) {

        discountValue =
            subtotalValue * 0.20;

    }


    let shippingValue = 0;


    if (subtotalValue > 0) {

        shippingValue = 10;

    }


    const total =
        subtotalValue -
        discountValue +
        shippingValue;


    subtotal.textContent =
        `$${subtotalValue.toFixed(2)}`;


    discount.textContent =
        `-$${discountValue.toFixed(2)}`;


    shipping.textContent =
        `$${shippingValue.toFixed(2)}`;


    grandTotal.textContent =
        `$${total.toFixed(2)}`;

}


// ======================================================
// 14. APPLY COUPON
// ======================================================

function applyCoupon() {

    const coupon =
        couponInput.value
            .trim()
            .toUpperCase();


    couponMessage.className =
        "coupon-message";


    if (
        coupon ===
        "SAVE10"
    ) {

        appliedCoupon =
            "SAVE10";


        couponMessage.textContent =
            "10% discount applied.";


        couponMessage.classList.add(
            "coupon-success"
        );

    }


    else if (
        coupon ===
        "SAVE20"
    ) {

        appliedCoupon =
            "SAVE20";


        couponMessage.textContent =
            "20% discount applied.";


        couponMessage.classList.add(
            "coupon-success"
        );

    }


    else {

        appliedCoupon = null;


        couponMessage.textContent =
            "Invalid coupon.";


        couponMessage.classList.add(
            "coupon-error"
        );

    }


    updateSummary();

}


// ======================================================
// 15. SAVE WISHLIST
// ======================================================

function saveWishlist() {

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

}


// ======================================================
// 16. TOGGLE WISHLIST
// ======================================================

function toggleWishlist(id) {

    const selectedProduct =
        products.find(
            (product) =>
                product.id === id
        );


    if (!selectedProduct) {

        return;

    }


    const existingProduct =
        wishlist.find(
            (item) =>
                item.id === id
        );


    if (existingProduct) {

        wishlist =
            wishlist.filter(
                (item) =>
                    item.id !== id
            );

    } else {

        wishlist.push(
            selectedProduct
        );

    }


    saveWishlist();

    updateWishlist();

    updateWishlistCount();

    applyFilters();

}


// ======================================================
// 17. UPDATE WISHLIST COUNT
// ======================================================

function updateWishlistCount() {

    wishlistCount.textContent =
        wishlist.length;

}


// ======================================================
// 18. UPDATE WISHLIST
// ======================================================

function updateWishlist() {

    wishlistItems.innerHTML = "";


    if (wishlist.length === 0) {

        wishlistItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    ♡
                </div>

                <h2>
                    Wishlist is Empty
                </h2>

                <p>
                    Add products you love.
                </p>

            </div>

        `;

        return;

    }


    wishlist.forEach(
        (product) => {

            wishlistItems.innerHTML += `

                <div class="cart-item">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >


                    <div>

                        <div class="cart-item-name">

                            ${product.name}

                        </div>


                        <div class="cart-item-price">

                            $${product.price.toFixed(2)}

                        </div>


                        <div class="cart-controls">

                            <button
                                class="add-btn"
                                onclick="addToCart(
                                    ${product.id}
                                )"
                            >
                                Add to Cart
                            </button>


                            <button
                                class="remove-btn"
                                onclick="toggleWishlist(
                                    ${product.id}
                                )"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                </div>

            `;

        }
    );

}


// ======================================================
// 19. SHOW PRODUCT DETAILS
// ======================================================

function showProduct(id) {

    selectedProduct =
        products.find(
            (product) =>
                product.id === id
        );


    if (!selectedProduct) {

        return;

    }


    detailImage.src =
        selectedProduct.image;


    detailImage.alt =
        selectedProduct.name;


    detailCategory.textContent =
        selectedProduct.category;


    detailName.textContent =
        selectedProduct.name;


    detailRating.textContent =
        `⭐ ${selectedProduct.rating}`;


    detailPrice.textContent =
        `$${selectedProduct.price.toFixed(2)}`;


    detailStock.textContent =
        `${selectedProduct.stock} items in stock`;


    detailDescription.textContent =
        selectedProduct.description;


    productModal.classList.add(
        "show"
    );

}


// ======================================================
// 20. ADD FROM PRODUCT MODAL
// ======================================================

function addSelectedProductToCart() {

    if (!selectedProduct) {

        return;

    }


    addToCart(
        selectedProduct.id
    );


    productModal.classList.remove(
        "show"
    );

}


// ======================================================
// 21. OPEN CART
// ======================================================

function openCart() {

    wishlistSidebar.classList.remove(
        "open"
    );


    cartSidebar.classList.add(
        "open"
    );


    overlay.classList.add(
        "show"
    );

}


// ======================================================
// 22. CLOSE CART
// ======================================================

function closeCartSidebar() {

    cartSidebar.classList.remove(
        "open"
    );


    if (
        !wishlistSidebar.classList.contains(
            "open"
        )
    ) {

        overlay.classList.remove(
            "show"
        );

    }

}


// ======================================================
// 23. OPEN WISHLIST
// ======================================================

function openWishlist() {

    cartSidebar.classList.remove(
        "open"
    );


    wishlistSidebar.classList.add(
        "open"
    );


    overlay.classList.add(
        "show"
    );

}


// ======================================================
// 24. CLOSE WISHLIST
// ======================================================

function closeWishlistSidebar() {

    wishlistSidebar.classList.remove(
        "open"
    );


    if (
        !cartSidebar.classList.contains(
            "open"
        )
    ) {

        overlay.classList.remove(
            "show"
        );

    }

}


// ======================================================
// 25. DARK / LIGHT MODE
// ======================================================

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "darkMode",
        isDark
    );


    themeBtn.textContent =
        isDark
            ? "☀️"
            : "🌙";

}


// ======================================================
// 26. LOAD THEME
// ======================================================

function loadTheme() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        );


    if (
        darkMode ===
        "true"
    ) {

        document.body.classList.add(
            "dark"
        );


        themeBtn.textContent =
            "☀️";

    } else {

        themeBtn.textContent =
            "🌙";

    }

}


// ======================================================
// 27. OPEN CHECKOUT
// ======================================================

function openCheckout() {

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    checkoutModal.classList.add(
        "show"
    );

}


// ======================================================
// 28. CLOSE CHECKOUT
// ======================================================

function closeCheckoutModal() {

    checkoutModal.classList.remove(
        "show"
    );

}


// ======================================================
// 29. PLACE ORDER
// ======================================================

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        return;

    }


    const randomOrder =
        Math.floor(
            100000 +
            Math.random() *
            900000
        );


    orderId.textContent =
        `#SS${randomOrder}`;


    cart = [];

    appliedCoupon = null;


    saveCart();

    updateCart();


    checkoutForm.reset();


    checkoutModal.classList.remove(
        "show"
    );


    cartSidebar.classList.remove(
        "open"
    );


    overlay.classList.remove(
        "show"
    );


    successModal.classList.add(
        "show"
    );

}


// ======================================================
// 30. CONTINUE SHOPPING
// ======================================================

function continueShoppingHandler() {

    successModal.classList.remove(
        "show"
    );

}


// ======================================================
// 31. EVENT LISTENERS
// ======================================================

searchInput.addEventListener(
    "input",
    applyFilters
);


categoryFilter.addEventListener(
    "change",
    applyFilters
);


sortFilter.addEventListener(
    "change",
    applyFilters
);


themeBtn.addEventListener(
    "click",
    toggleTheme
);


cartBtn.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartSidebar
);


wishlistBtn.addEventListener(
    "click",
    openWishlist
);


closeWishlist.addEventListener(
    "click",
    closeWishlistSidebar
);


overlay.addEventListener(
    "click",
    () => {

        closeCartSidebar();

        closeWishlistSidebar();

    }
);


closeProductModal.addEventListener(
    "click",
    () => {

        productModal.classList.remove(
            "show"
        );

    }
);


detailAddToCart.addEventListener(
    "click",
    addSelectedProductToCart
);


couponBtn.addEventListener(
    "click",
    applyCoupon
);


checkoutBtn.addEventListener(
    "click",
    openCheckout
);


closeCheckout.addEventListener(
    "click",
    closeCheckoutModal
);


checkoutForm.addEventListener(
    "submit",
    placeOrder
);


continueShopping.addEventListener(
    "click",
    continueShoppingHandler
);


// ======================================================
// 32. INITIALIZE
// ======================================================

function initializeApp() {

    loadTheme();

    updateCart();

    updateWishlist();

    updateWishlistCount();

    fetchProducts();

}


initializeApp();