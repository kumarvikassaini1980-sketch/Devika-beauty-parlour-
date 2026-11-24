const TELEGRAM_BOT_TOKEN = "9185977713:AAGV56W4AVHzrtBiZDBhQVFUwdnzQm8aYqc";
const TELEGRAM_CHAT_ID = "9107567121";
const OWNER_PIN = "1234";

const DEFAULT_SERVICES = [
  { id: 1, cat: "Facial", name: "O3+ Bridal Glow Facial", brand: "O3+", price: 1499, time: 60, trending: true, benefits: "Instant diamond-like radiance, removes deep tan & dullness.", steps: "Cleansing → Micro-Exfoliation → O3+ Serum Massage → Peel-off Mask" },
  { id: 2, cat: "Facial", name: "Lotus Gold Radiance Facial", brand: "Lotus", price: 799, time: 45, trending: true, benefits: "24K Gold glow for parties & festivals.", steps: "Gold Cleanser → Scrub → Gold Gel Massage → Glow Pack" },
  { id: 3, cat: "Facial", name: "VLCC Anti-Tan Cleanup", brand: "VLCC", price: 399, time: 30, trending: false, benefits: "Removes sun tan & refreshes tired skin.", steps: "Deep Cleanse → Steam & Blackhead Removal → De-Tan Pack" },
  { id: 4, cat: "Bridal", name: "Royal HD Bridal Makeup", brand: "O3+", price: 7999, time: 180, trending: true, benefits: "Waterproof, sweat-proof 16-hour HD finish with draping & hairstyling.", steps: "Skin Prep → HD Base → Eye Glam → Lashes → Saree/Lehenga Draping" },
  { id: 5, cat: "Bridal", name: "Party / Engagement Glam", brand: "Lotus", price: 2499, time: 90, trending: false, benefits: "Soft glam look perfect for Haldi, Sangeet & receptions.", steps: "Primer → Dewy Base → Hair Styling → Setting Spray" },
  { id: 6, cat: "Hair", name: "L'Oreal Deep Nourish Hair Spa", brand: "VLCC", price: 699, time: 45, trending: true, benefits: "Repairs dry, frizzy hair and adds mirror shine.", steps: "Hair Wash → Cream Massage → Steam → Rinse & Serum" },
  { id: 7, cat: "Hair", name: "Advance Layer / Feather Cut", brand: "VLCC", price: 299, time: 30, trending: false, benefits: "Adds volume and frames your face beautifully.", steps: "Consultation → Precision Cut → Blow Dry Finish" },
  { id: 8, cat: "Waxing", name: "Rica Full Arms + Underarms", brand: "O3+", price: 499, time: 30, trending: false, benefits: "Less painful, removes tan & slows hair regrowth.", steps: "Pre-Wax Gel → Rica Wax → After-Wax Oil" },
  { id: 9, cat: "Waxing", name: "Honey Full Legs Wax", brand: "VLCC", price: 349, time: 30, trending: false, benefits: "Smooth, soft skin with gentle honey wax.", steps: "Powder Prep → Honey Wax → Soothing Lotion" },
  { id: 10, cat: "Threading", name: "Eyebrow + Upperlip Threading", brand: "VLCC", price: 60, time: 15, trending: false, benefits: "Sharp, symmetrical arch tailored to your face.", steps: "Precision Threading → Cooling Aloe Gel" },
  { id: 11, cat: "ManiPedi", name: "Luxury Rose Spa Pedicure", brand: "Lotus", price: 599, time: 45, trending: false, benefits: "Heals cracked heels & brightens feet.", steps: "Rose Soak → Cuticle Care → Scrub → Foot Massage → Polish" },
  { id: 12, cat: "Mehendi", name: "Bridal Full Hand Mehendi", brand: "VLCC", price: 2100, time: 120, trending: false, benefits: "100% organic dark-stain bridal henna.", steps: "Custom Design → Organic Cone Application → Lemon-Sugar Seal" }
];

const BRIDAL_LOOKS = [
  { id: "b1", style: "Royal", title: "Royal Red Lehenga Bridal", price: 7999, tag: "HD + Hair + Draping", desc: "Classic Rajasthani royal glow with waterproof HD finish." },
  { id: "b2", style: "HD", title: "Airbrush Soft Pastel Bride", price: 9999, tag: "Airbrush Luxury", desc: "Feather-light, zero-cakey, ultra-HD camera-ready finish." },
  { id: "b3", style: "Party", title: "Haldi & Sangeet Dewy Glam", price: 2499, tag: "Party Favorite", desc: "Fresh floral hairdo with radiant golden-hour makeup." }
];

const STORE_PRODUCTS = [
  { id: 101, name: "O3+ Brightening Serum (30ml)", price: 599, desc: "Daily glow & dark spot reduction." },
  { id: 102, name: "Lotus Matte Sunblock SPF 50", price: 349, desc: "Zero white-cast sun protection." },
  { id: 103, name: "Keratin Smooth Hair Mask", price: 499, desc: "Salon-like silky hair at home." }
];

const SKIN_PROBLEMS = [
  { title: "☀️ Sun Tan & Dullness", recIds: [1, 3] },
  { title: "👰 Upcoming Wedding Glow", recIds: [1, 4, 12] },
  { title: "💇‍♀️ Dry & Frizzy Hair", recIds: [6, 7] },
  { title: "✨ Quick Party Ready", recIds: [2, 5, 10] }
];

let services = JSON.parse(localStorage.getItem("devika_services")) || DEFAULT_SERVICES;
let bookings = JSON.parse(localStorage.getItem("devika_bookings")) || [];
let shopOpen = JSON.parse(localStorage.getItem("devika_shop_open") ?? "true");
let user = JSON.parse(localStorage.getItem("devika_user")) || null;
let wishlist = JSON.parse(localStorage.getItem("devika_wishlist")) || [];
let cart = [];
let selectedDay = "Today";
let selectedSlot = "";
let useCoins = false;

window.addEventListener("DOMContentLoaded", () => {
  if (user) showAppShell();
  updateShopStatusUI();
  renderTrending();
  renderServices("ALL", "ALL");
  renderAdvisor();
  renderBridal("ALL");
  renderStore();
  startBannerSlider();

  document.getElementById("btn-login").addEventListener("click", handleLogin);
  document.getElementById("btn-guest").addEventListener("click", () => {
    user = { name: "Guest", phone: "0000000000", coins: 50, totalSpent: 0, spinsLeft: 0, guest: true };
    showAppShell();
  });

  document.getElementById("global-search").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    if (q.length > 1) {
      switchScreen("screen-services");
      renderServices("ALL", "ALL", q);
    }
  });

  document.querySelectorAll("#brand-filters .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#brand-filters .chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderServices("ALL", btn.dataset.brand);
    });
  });

  document.querySelectorAll("#bridal-filters .chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#bridal-filters .chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderBridal(btn.dataset.style);
    });
  });
});

function handleLogin() {
  const name = document.getElementById("auth-name").value.trim() || "Valued Guest";
  const phone = document.getElementById("auth-phone").value.trim();
  const pin = document.getElementById("auth-pin").value.trim();
  const bday = document.getElementById("auth-bday").value;

  if (phone.length !== 10 || pin.length !== 4) {
    alert("Please enter a valid 10-digit mobile number and 4-digit PIN.");
    return;
  }
  user = { name, phone, pin, bday, coins: 50, totalSpent: 0, spinsLeft: 1, guest: false };
  localStorage.setItem("devika_user", JSON.stringify(user));
  showAppShell();
}

function showAppShell() {
  document.getElementById("screen-auth").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
  document.getElementById("header-coins").innerText = user.coins;
  switchScreen("screen-home");
}

function switchScreen(screenId, navBtn = null) {
  document.querySelectorAll("#app-shell .screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
  window.scrollTo(0, 0);

  if (navBtn) {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    navBtn.classList.add("active");
  }
  if (screenId === "screen-cart") renderCartScreen();
  if (screenId === "screen-wallet") renderWalletScreen();
  if (screenId === "screen-owner") renderOwnerDashboard();
}

function openCategory(cat) {
  document.getElementById("cat-title").innerText = cat + " Services";
  switchScreen("screen-services");
  renderServices(cat, "ALL");
}

function startBannerSlider() {
  const cards = document.querySelectorAll(".banner-card");
  let idx = 0;
  setInterval(() => {
    cards.forEach(c => c.classList.remove("active"));
    idx = (idx + 1) % cards.length;
    cards[idx].classList.add("active");
  }, 4000);
}

function createServiceCard(s) {
  const inCart = cart.find(c => c.id === s.id);
  return `
    <div style="background:#181416;border:1px solid rgba(232,180,184,0.2);border-radius:16px;padding:14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
      <div onclick="openServiceDetail(${s.id})" style="cursor:pointer;flex:1;padding-right:10px;">
        <span style="font-size:10px;color:#d4af37;letter-spacing:1px;font-weight:700;">${s.brand} • ⏱ ${s.time} min</span>
        <h4 style="font-size:15px;margin:4px 0;color:#fff;">${s.name}</h4>
        <p style="font-size:14px;font-weight:700;color:#e8b4b8;">₹${s.price}</p>
      </div>
      <button onclick="toggleCart(${s.id})" style="padding:8px 14px;border-radius:10px;border:none;font-weight:700;font-size:12px;cursor:pointer;background:${inCart ? '#332428' : 'linear-gradient(135deg,#e8b4b8,#d4af37)'};color:${inCart ? '#e8b4b8' : '#120d0e'};">
        ${inCart ? '✓ Added' : '+ Add'}
      </button>
    </div>
  `;
}

function renderTrending() {
  document.getElementById("trending-list").innerHTML = services.filter(s => s.trending).map(createServiceCard).join("");
}

function renderServices(cat = "ALL", brand = "ALL", search = "") {
  let list = services;
  if (cat !== "ALL") list = list.filter(s => s.cat === cat);
  if (brand !== "ALL") list = list.filter(s => s.brand === brand);
  if (search) list = list.filter(s => s.name.toLowerCase().includes(search) || s.cat.toLowerCase().includes(search));
  document.getElementById("services-container").innerHTML = list.length ? list.map(createServiceCard).join("") : `<p style="color:#a69a9d;text-align:center;padding:30px;">No services found.</p>`;
}

function openServiceDetail(id) {
  const s = services.find(x => x.id === id);
  document.getElementById("service-detail-content").innerHTML = `
    <div style="background:#181416;border:1px solid #e8b4b8;border-radius:20px;padding:20px;margin-top:12px;">
      <span style="color:#d4af37;font-size:12px;font-weight:700;">${s.brand} OFFICIAL TREATMENT</span>
      <h2 style="font-family:'Cinzel',serif;margin:8px 0;">${s.name}</h2>
      <p style="font-size:20px;font-weight:700;color:#e8b4b8;margin-bottom:14px;">₹${s.price} <small style="font-size:12px;color:#a69a9d;">• ${s.time} mins</small></p>
      <p style="font-size:13px;color:#fff;margin-bottom:10px;"><strong>✨ Benefits:</strong> ${s.benefits}</p>
      <p style="font-size:13px;color:#a69a9d;margin-bottom:18px;"><strong>💆‍♀️ Process:</strong> ${s.steps}</p>
      <button class="btn-gold" onclick="toggleCart(${s.id}); switchScreen('screen-cart')">+ Add to Booking</button>
    </div>
  `;
  switchScreen("screen-detail");
}

function renderAdvisor() {
  document.getElementById("problem-grid").innerHTML = SKIN_PROBLEMS.map((p, i) => `
    <button onclick="showAdvisorRec(${i})" style="width:100%;text-align:left;padding:14px;margin-bottom:10px;border-radius:14px;background:#181416;border:1px solid rgba(232,180,184,0.25);color:#fff;font-weight:600;cursor:pointer;">
      ${p.title} →
    </button>
  `).join("");
}

function showAdvisorRec(idx) {
  const rec = SKIN_PROBLEMS[idx].recIds.map(id => services.find(s => s.id === id)).filter(Boolean);
  document.getElementById("advisor-results").innerHTML = `<h3 class="section-heading" style="margin-top:15px;">Recommended For You:</h3>` + rec.map(createServiceCard).join("");
}

function renderBridal(style) {
  const list = style === "ALL" ? BRIDAL_LOOKS : BRIDAL_LOOKS.filter(b => b.style === style);
  document.getElementById("bridal-gallery").innerHTML = list.map(b => {
    const liked = wishlist.includes(b.id);
    return `
      <div style="background:linear-gradient(135deg,#24151a,#141012);border:1px solid rgba(212,175,55,0.35);border-radius:18px;padding:16px;margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:11px;color:#d4af37;font-weight:700;">${b.tag}</span>
          <span onclick="toggleWishlist('${b.id}')" style="font-size:20px;cursor:pointer;">${liked ? '❤️' : '🤍'}</span>
        </div>
        <h3 style="font-family:'Cinzel',serif;margin:6px 0;">${b.title}</h3>
        <p style="font-size:12px;color:#a69a9d;margin-bottom:10px;">${b.desc}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:#e8b4b8;font-size:16px;">₹${b.price}</strong>
          <button onclick="bookBridalQuick('${b.title}', ${b.price})" style="padding:8px 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#e8b4b8,#d4af37);color:#120d0e;font-weight:700;font-size:12px;">Book Consultation</button>
        </div>
      </div>
    `;
  }).join("");
}

function toggleWishlist(id) {
  wishlist = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
  localStorage.setItem("devika_wishlist", JSON.stringify(wishlist));
  renderBridal("ALL");
}

function bookBridalQuick(title, price) {
  cart.push({ id: Date.now(), name: title, price, time: 120 });
  updateFloatingCart();
  switchScreen("screen-cart");
}

function renderStore() {
  document.getElementById("store-products").innerHTML = STORE_PRODUCTS.map(p => `
    <div style="background:#181416;border:1px solid rgba(232,180,184,0.2);border-radius:16px;padding:14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <h4 style="font-size:14px;color:#fff;">${p.name}</h4>
        <p style="font-size:12px;color:#a69a9d;">${p.desc}</p>
        <strong style="color:#e8b4b8;">₹${p.price}</strong>
      </div>
      <button onclick="toggleCart(${p.id}, true)" style="padding:8px 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#e8b4b8,#d4af37);color:#120d0e;font-weight:700;font-size:12px;">+ Add</button>
    </div>
  `).join("");
}

function toggleCart(id, isProduct = false) {
  const exists = cart.find(c => c.id === id);
  if (exists) {
    cart = cart.filter(c => c.id !== id);
  } else {
    const item = isProduct ? STORE_PRODUCTS.find(p => p.id === id) : services.find(s => s.id === id);
    if (item) cart.push({ id: item.id, name: item.name, price: item.price, time: item.time || 0 });
  }
  updateFloatingCart();
  renderTrending();
  renderServices("ALL", "ALL");
}

function updateFloatingCart() {
  const bar = document.getElementById("floating-cart");
  if (!cart.length) return bar.classList.add("hidden");
  bar.classList.remove("hidden");
  const total = cart.reduce((a, b) => a + b.price, 0);
  const time = cart.reduce((a, b) => a + b.time, 0);
  document.getElementById("float-count").innerText = `${cart.length} Item(s)`;
  document.getElementById("float-time").innerText = `${time} mins`;
  document.getElementById("float-total").innerText = `₹${total}`;
}

function renderCartScreen() {
  const listEl = document.getElementById("cart-items-list");
  const billEl = document.getElementById("cart-billing-box");
  const slotEl = document.getElementById("slot-picker-box");

  if (!cart.length) {
    listEl.innerHTML = `<p style="color:#a69a9d;text-align:center;padding:30px;">Your cart is empty. Add services from Rates!</p>`;
    billEl.innerHTML = "";
    slotEl.innerHTML = "";
    return;
  }

  listEl.innerHTML = cart.map(c => `
    <div style="display:flex;justify-content:space-between;background:#181416;padding:12px;border-radius:12px;margin-bottom:8px;border:1px solid rgba(232,180,184,0.15);">
      <span>${c.name}</span>
      <div><strong>₹${c.price}</strong> <span onclick="toggleCart(${c.id}); renderCartScreen()" style="color:#f87171;margin-left:8px;cursor:pointer;">✕</span></div>
    </div>
  `).join("");

  const subtotal = cart.reduce((a, b) => a + b.price, 0);
  const maxDiscount = subtotal >= 250 ? Math.min(user.coins, Math.floor(subtotal * 0.25)) : 0;
  const discount = useCoins ? maxDiscount : 0;
  const finalTotal = subtotal - discount;

  billEl.innerHTML = `
    <div style="background:#181416;padding:16px;border-radius:16px;border:1px solid rgba(212,175,55,0.3);margin:14px 0;">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Subtotal</span><span>₹${subtotal}</span></div>
      ${maxDiscount > 0 ? `
        <label style="display:flex;justify-content:space-between;align-items:center;color:#d4af37;font-size:13px;margin-bottom:8px;cursor:pointer;">
          <span><input type="checkbox" ${useCoins ? "checked" : ""} onchange="useCoins=this.checked; renderCartScreen()"> Use ${maxDiscount} VIP Coins (-₹${maxDiscount})</span>
          <span>-₹${discount}</span>
        </label>
      ` : `<p style="font-size:11px;color:#a69a9d;margin-bottom:8px;">Add ₹${Math.max(0, 250 - subtotal)} more to use VIP Coins (up to 25% off)</p>`}
      <hr style="border-color:rgba(255,255,255,0.1);margin:8px 0;">
      <div style="display:flex;justify-content:space-between;font-size:17px;font-weight:700;color:#e8b4b8;"><span>Payable at Parlour</span><span>₹${finalTotal}</span></div>
    </div>
  `;

  const slots = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];
  slotEl.innerHTML = `
    <h3 class="section-heading">Select Appointment Slot</h3>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <button onclick="selectedDay='Today'; renderCartScreen()" class="chip ${selectedDay==='Today'?'active':''}">Today</button>
      <button onclick="selectedDay='Tomorrow'; renderCartScreen()" class="chip ${selectedDay==='Tomorrow'?'active':''}">Tomorrow</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;">
      ${slots.map(t => `
        <button onclick="selectedSlot='${t}'; renderCartScreen()" style="padding:10px 4px;border-radius:10px;border:1px solid ${selectedSlot===t?'#d4af37':'rgba(255,255,255,0.15)'};background:${selectedSlot===t?'#d4af37':'#181416'};color:${selectedSlot===t?'#000':'#fff'};font-size:11px;font-weight:700;">${t}</button>
      `).join("")}
    </div>
    <button class="btn-gold" onclick="confirmBooking(${finalTotal}, ${discount})">✅ Confirm Booking (Instant Alert)</button>
  `;
}

async function confirmBooking(finalTotal, discount) {
  if (!shopOpen && selectedDay === "Today") {
    alert("Parlour is currently Closed for today. Please book for Tomorrow!");
    return;
  }
  if (!selectedSlot) {
    alert("Please select a time slot first!");
    return;
  }

  const booking = {
    id: "DBP" + Math.floor(1000 + Math.random() * 9000),
    customer: user.name,
    phone: user.phone,
    items: cart.map(c => c.name).join(", "),
    day: selectedDay,
    slot: selectedSlot,
    total: finalTotal,
    coinsUsed: discount,
    status: "Pending",
    date: new Date().toLocaleDateString()
  };

  bookings.unshift(booking);
  localStorage.setItem("devika_bookings", JSON.stringify(bookings));

  const msg = `🔔 *NEW BOOKING ALERT!* 👑\n\n🆔 *ID:* ${booking.id}\n👤 *Client:* ${booking.customer} (${booking.phone})\n📅 *Slot:* ${booking.day} at ${booking.slot}\n💅 *Services:* ${booking.items}\n💰 *Bill:* ₹${booking.total} (Coins Used: ${booking.coinsUsed})`;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "Markdown" })
    });
  } catch (e) { console.log("Telegram alert error", e); }

  cart = [];
  useCoins = false;
  updateFloatingCart();
  alert(`🎉 Booking Confirmed! ID: ${booking.id}\nDevika Ji has received your instant booking alert.`);
  switchScreen("screen-wallet");
}

function renderWalletScreen() {
  const tier = user.totalSpent >= 5000 ? "PLATINUM (10%)" : user.totalSpent >= 2000 ? "GOLD (8%)" : "SILVER (5%)";
  document.getElementById("vip-card-container").innerHTML = `
    <div style="background:linear-gradient(135deg,#2e1c22,#120e10);border:1px solid #d4af37;border-radius:20px;padding:20px;margin-bottom:16px;">
      <span style="font-size:11px;color:#d4af37;letter-spacing:2px;">DEVIKA VIP CLUB</span>
    
