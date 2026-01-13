/* ==============================================
   DATA FILE (Database of Products)
   Paste this inside data.js
   ============================================== */

// NOTE: 'window.products' is important for Search & Home logic
window.products = [
    // --- TUMHARE PURANE PRODUCTS (AS IT IS) ---
    {
        id: 1,
        title: "Signature Tee",
        price: 799,
        img: "images/tee.png", 
        desc: "Ye 100% cotton tee hai. Garmiyo ke liye best. Slim fit aur durable fabric.",
        category: "T-Shirt Men"
    },
    {
        id: 2,
        title: "Urban Jacket",
        price: 3499,
        img: "images/Urban jacket.png",
        desc: "Water-resistant jacket with quilted lining. Thand aur baarish dono se bachaegi.",
        category: "Jacket Men"
    },
    {
        id: 3,
        title: "Classic Shirt",
        price: 1299,
        img: "images/Classic Shirt.png",
        desc: "Office ya party, har jagah ke liye perfect. Premium Oxford cotton.",
        category: "Shirt Men"
    },
    {
        id: 4,
        title: "Denim Relaxed",
        price: 1999,
        img: "images/Denim Relaxed.png",
        desc: "Vintage wash denim. Relaxed fit jo aajkal trend me hai.",
        category: "Jeans Men"
    },
    {
        id: 5,
        title: "Sporty Sneakers",
        price: 1299,
        img: "images/Urban Jacket.png", // Note: Check image path later
        desc: "Comfortable running shoes for daily use.",
        category: "Shoes Footwear"
    },
    {
        id: 6,
        title: "Leather Boots",
        price: 2999,
        img: "images/Classic Shirt.png", // Note: Check image path later
        desc: "Rugged leather boots for outdoor styling.",
        category: "Shoes Footwear"
    },

    // --- NAYE PRODUCTS (Added to fill Women, Watch, Belt Sections) ---
    {
        id: 7,
        title: "Women's Floral Maxi Dress",
        price: 1499,
        img: "https://rukminim1.flixcart.com/image/612/612/xif0q/dress/9/z/u/l-23307222-wrogn-original-imagkhw5ygejyg6z.jpeg?q=70",
        desc: "Elegant floral print dress, perfect for summer outings.",
        category: "Women Dress"
    },
    {
        id: 8,
        title: "Women's Stylish Hoodie",
        price: 899,
        img: "Essentials.png", // Fallback to local
        desc: "Cozy oversized hoodie for winter vibes.",
        category: "Women Winter"
    },
    {
        id: 9,
        title: "Premium Silver Watch",
        price: 2499,
        img: "https://rukminim1.flixcart.com/fk-p-flap/128/128/image/503791c8df142335.png",
        desc: "Luxury metallic watch suitable for formal wear.",
        category: "Watches Accessories"
    },
    {
        id: 10,
        title: "Smart Fitness Watch",
        price: 3999,
        img: "https://rukminim1.flixcart.com/image/612/612/xif0q/smartwatch/j/x/b/-original-imagnw4g6gg57h6h.jpeg?q=70",
        desc: "Track your steps and heart rate with style.",
        category: "Watches Gadgets"
    },
    {
        id: 11,
        title: "Formal Leather Belt",
        price: 499,
        img: "https://rukminim1.flixcart.com/image/612/612/xif0q/belt/p/x/m/30-mens-formal-black-artificial-leather-belt-35mm-wide-adjustable-original-imagh7m5wzzgzzhz.jpeg?q=70",
        desc: "Genuine leather belt with a sleek buckle.",
        category: "Belts Accessories"
    },
    {
        id: 12,
        title: "Canvas Casual Loafers",
        price: 799,
        img: "https://rukminim1.flixcart.com/image/612/612/xif0q/shoe/s/d/9/-original-imaggcax2z5f2b6h.jpeg?q=70",
        desc: "Lightweight loafers for everyday comfort.",
        category: "Shoes Men"
    }
];