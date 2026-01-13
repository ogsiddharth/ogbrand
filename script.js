/* ========================================================
   Alpha Clothing - FINAL SCRIPT (Bottom Nav Links to Profile)
   ======================================================== */

import { auth, db, doc, getDoc, updateDoc, setDoc, arrayUnion, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "./firebase-config.js";

// --- 1. GLOBAL TOAST ---
window.showToast = function(msg, type = "success") {
    const toastBox = document.getElementById('toast-box');
    if(!toastBox) return;
    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (type === 'error') toast.classList.add('error');
    const icon = type === 'error' ? '<i class="fas fa-times-circle"></i>' : '<i class="fas fa-check-circle"></i>';
    toast.innerHTML = `${icon} <span>${msg}</span>`;
    toastBox.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// --- 2. GLOBAL VARIABLES ---
let currentUserId = null;
const cartCountEl = document.getElementById('cart-count');
const signinBtn = document.getElementById("signin-btn");
const userProfile = document.getElementById("user-profile");
const userNameSpan = document.getElementById("user-name");
const productGrid = document.getElementById('product-grid');

// --- 3. AUTH STATE ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUserId = user.uid;
        if(signinBtn) signinBtn.style.display = 'none';
        
        // Desktop Header Profile Logic
        if(userProfile) {
            userProfile.style.display = 'flex';
            userProfile.onclick = function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
            };
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            if(userNameSpan) userNameSpan.textContent = data.fullName ? data.fullName.split(" ")[0] : "User";
            updateCartCountUI(data.cart ? data.cart.length : 0);
        }
    } else {
        currentUserId = null;
        if(signinBtn) signinBtn.style.display = 'block';
        if(userProfile) userProfile.style.display = 'none';
        updateCartCountUI(0);
    }
});

function updateCartCountUI(count) {
    if (cartCountEl) cartCountEl.textContent = count;
    const bottomBadge = document.getElementById('bottom-cart-count');
    if (bottomBadge) bottomBadge.textContent = count;
}

// --- 4. MOBILE BOTTOM NAV LOGIC (UPDATED) ---

// Account Icon Click Handler
window.handleMobileAccount = function() {
    if (auth.currentUser) {
        // YAHAN CHANGE HAI: Menu kholne ki jagah seedha Profile Page par bhejo
        window.location.href = "profile.html";
    } else {
        document.getElementById("signin-modal").classList.add("open");
    }
};

// Create Bottom Nav
function createBottomNav() {
    if (window.innerWidth > 768) return;
    if (document.querySelector('.mobile-bottom-nav')) return;
    
    const path = window.location.pathname;
    const count = document.getElementById('cart-count') ? document.getElementById('cart-count').textContent : '0';
    
    // Check karo agar hum Profile page par hain to icon Blue (Active) hona chahiye
    const isProfile = path.includes('profile.html');

    document.body.insertAdjacentHTML('beforeend', `
        <div class="mobile-bottom-nav">
            <a href="index.html" class="nav-item ${path.includes('index') || path === '/' ? 'active' : ''}">
                <i class="fas fa-home"></i><span>Home</span>
            </a>
            <a href="index.html#collections" class="nav-item">
                <i class="fas fa-th-large"></i><span>Categories</span>
            </a>
            <a href="orders.html" class="nav-item ${path.includes('orders') ? 'active' : ''}">
                <i class="fas fa-box"></i><span>Orders</span>
            </a>
            
            <div class="nav-item ${isProfile ? 'active' : ''}" onclick="handleMobileAccount()">
                <i class="fas fa-user"></i><span>Account</span>
            </div>
            
            <a href="cart.html" class="nav-item ${path.includes('cart') ? 'active' : ''}">
                <div class="relative-box">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="bottom-badge" id="bottom-cart-count">${count}</span>
                </div>
                <span>Cart</span>
            </a>
        </div>`);
}
createBottomNav();

// --- 5. AUTH FORMS ---
const sForm = document.getElementById("signin-form");
if (sForm) {
    sForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById("signin-email").value;
        const password = document.getElementById("signin-password").value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.showToast("Login Successful!");
            document.getElementById("signin-modal").classList.remove("open");
        } catch (error) {
            window.showToast("Login Failed: " + error.message, "error");
        }
    });
}

const rForm = document.getElementById("signup-form");
if (rForm) {
    rForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", res.user.uid), {
                fullName: name,
                email: email,
                cart: [],
                orders: [],
                wishlist: []
            });
            window.showToast("Welcome " + name);
            document.getElementById("signup-modal").classList.remove("open");
        } catch (error) {
            window.showToast("Signup Failed: " + error.message, "error");
        }
    });
}

// Global Logout
window.logout = async function() {
    try {
        await signOut(auth);
        window.showToast("Logged Out");
        setTimeout(() => window.location.href = "index.html", 1000);
    } catch (error) { console.error(error); }
};

// --- 6. CART & WISHLIST ---
window.addToCartLogic = async function(product) {
    if (!currentUserId) {
        window.showToast("Please Login First!", "error");
        document.getElementById("signin-modal").classList.add("open");
        return;
    }
    try {
        await updateDoc(doc(db, "users", currentUserId), {
            cart: arrayUnion(product)
        });
        window.showToast("Added to Cart 🛒");
        setTimeout(() => location.reload(), 1000);
    } catch (error) {
        window.showToast("Error: " + error.message, "error");
    }
};

window.toggleWishlist = async function(btn, productId) {
    if (!currentUserId) {
        window.showToast("Login to save items!", "error");
        document.getElementById("signin-modal").classList.add("open");
        return;
    }
    const icon = btn.querySelector('i');
    const isActive = btn.classList.contains('active');
    
    if (isActive) {
        btn.classList.remove('active');
        icon.classList.remove('fas'); icon.classList.add('far');
    } else {
        btn.classList.add('active');
        icon.classList.remove('far'); icon.classList.add('fas');
        btn.style.transform = "scale(1.3)";
        setTimeout(() => btn.style.transform = "scale(1)", 200);
    }

    try {
        const userRef = doc(db, "users", currentUserId);
        if (!isActive) {
            await updateDoc(userRef, { wishlist: arrayUnion(productId) });
            window.showToast("Saved to Wishlist ❤️");
        } else {
            window.showToast("Removed from Wishlist");
        }
    } catch (error) {
        console.error(error);
    }
};

// --- 7. HOME PAGE LOGIC (Only runs if elements exist) ---
const sliderWrapper = document.getElementById('banner-slider');
if(sliderWrapper) {
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    window.moveSlide = function(n) {
        slideIndex += n;
        if (slideIndex >= totalSlides) slideIndex = 0;
        else if (slideIndex < 0) slideIndex = totalSlides - 1;
        sliderWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
    }
    setInterval(() => window.moveSlide(1), 3000);
}

const timerEl = document.getElementById('countdown-timer');
if (timerEl) {
    let countDownDate = new Date().getTime() + (15 * 1000); 
    const x = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timerEl.innerHTML = `<i class="fas fa-clock"></i> ${hours}h : ${minutes}m : ${seconds}s Left`;
        if (distance < 0) {
            clearInterval(x);
            timerEl.innerHTML = "EXPIRED";
            document.getElementById('deal-section-container').style.display = "none";
            document.getElementById('new-arrival-banner').style.display = "block";
        }
    }, 1000);
}

// Render Products Logic
const allProducts = window.products || (typeof products !== 'undefined' ? products : []);
const fallbackImage = 'Gemini_Generated_Image_xyc6lnxyc6lnxyc6.png';

if (productGrid && allProducts.length > 0) {
    // Only for Home Page Grid
    const deals = allProducts.slice(0, 8); 
    productGrid.innerHTML = deals.map(p => `
    <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
      <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(this, ${p.id})">
        <i class="far fa-heart"></i>
      </button>
      <img src="${p.img}" alt="${p.title}" onerror="this.onerror=null; this.src='${fallbackImage}'">
      <div class="product-info">
        <h4 class="product-title">${p.title}</h4>
        <div class="product-price">₹ ${p.price}</div>
        <button class="btn" style="width:100%; margin-top:10px;">View Details</button>
      </div>
    </div>`).join('');
}

// Search Logic
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
if (searchInput && searchBtn) {
    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) { window.showToast("Please type something!", "error"); return; }
        const filtered = (window.products || []).filter(p => 
            p.title.toLowerCase().includes(query) || (p.category && p.category.toLowerCase().includes(query))
        );
        const dealSection = document.getElementById('deal-section-container');
        const dealsTitle = document.querySelector('.deals-title h2');
        
        if(dealSection) dealSection.style.display = "block";
        if (filtered.length > 0) {
            if(dealsTitle) dealsTitle.textContent = `Results for "${query}"`;
            productGrid.innerHTML = filtered.map(p => `
                <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'">
                  <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(this, ${p.id})"><i class="far fa-heart"></i></button>
                  <img src="${p.img}" onerror="this.src='${fallbackImage}'">
                  <div class="product-info"><h4 class="product-title">${p.title}</h4><div class="product-price">₹ ${p.price}</div><button class="btn" style="width:100%; margin-top:10px;">View Details</button></div>
                </div>`).join('');
            window.showToast(`Found ${filtered.length} items`);
        } else {
            if(dealsTitle) dealsTitle.textContent = `No Results`;
            productGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;"><h3>No results found!</h3></div>`;
        }
        if(dealSection) dealSection.scrollIntoView({ behavior: 'smooth' });
    };
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
}

// Modal Handlers (Safe)
if(signinBtn) signinBtn.onclick = () => document.getElementById("signin-modal").classList.add("open");
document.querySelectorAll('.modal-close').forEach(btn => btn.onclick = () => {
    document.getElementById("signin-modal").classList.remove("open");
    document.getElementById("signup-modal").classList.remove("open");
});
document.getElementById("signup-link")?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById("signin-modal").classList.remove("open"); document.getElementById("signup-modal").classList.add("open"); });
document.getElementById("go-to-signin")?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById("signup-modal").classList.remove("open"); document.getElementById("signin-modal").classList.add("open"); });

// Close menu on outside click (Desktop)
window.addEventListener('click', function(e) {
    const profile = document.getElementById('user-profile');
    if (profile && profile.classList.contains('active')) {
        if (!profile.contains(e.target)) {
            profile.classList.remove('active');
        }
    }
});