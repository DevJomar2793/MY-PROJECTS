<script setup></script>

<template>
  <section id="menu">
    <div class="container">
      <div class="text-center reveal">
        <span class="section-badge">Our Menu</span>
        <h2 class="section-title">Food That <span>Wows</span> Every Time</h2>
        <div class="divider"></div>
        <p class="section-subtitle">
          Explore our handcrafted selection of crowd favorites, made fresh with
          quality ingredients and a whole lot of love.
        </p>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs reveal">
        <button class="filter-btn active" data-filter="all" id="filter-all">
          All Items
        </button>
        <button class="filter-btn" data-filter="burger" id="filter-burger">
          🍔 Burgers
        </button>
        <button class="filter-btn" data-filter="pizza" id="filter-pizza">
          🍕 Pizza
        </button>
        <button class="filter-btn" data-filter="chicken" id="filter-chicken">
          🍗 Chicken
        </button>
        <button class="filter-btn" data-filter="pasta" id="filter-pasta">
          🍝 Pasta
        </button>
        <button class="filter-btn" data-filter="drinks" id="filter-drinks">
          🥤 Drinks
        </button>
      </div>

      <!-- Menu Cards Grid -->
      <div class="row g-4">
        <!-- Burger -->
        <div
          class="col-sm-6 col-lg-4 menu-item reveal delay-1"
          data-category="burger"
        >
          <div class="menu-card">
            <div class="menu-card-img">
              <img
                src="/assets/images/menu_burger.png"
                alt="Classic Cheeseburger"
                loading="lazy"
              />
              <span class="menu-badge">Best Seller</span>
            </div>
            <div class="menu-card-body">
              <h5>Classic Cheeseburger</h5>
              <p>
                Juicy beef patty with cheddar, crispy lettuce, fresh tomato,
                caramelized onion, and our secret sauce.
              </p>
            </div>
            <div class="menu-card-footer">
              <span class="menu-price">₱249</span>
              <button class="btn-order" id="order-burger">
                <i class="bi bi-bag-plus"></i> Order
              </button>
            </div>
          </div>
        </div>

        <!-- Pizza -->
        <div
          class="col-sm-6 col-lg-4 menu-item reveal delay-2"
          data-category="pizza"
        >
          <div class="menu-card">
            <div class="menu-card-img">
              <img
                src="/assets/images/menu_pizza.png"
                alt="Wood-Fired Pepperoni Pizza"
                loading="lazy"
              />
              <span class="menu-badge">Fan Favorite</span>
            </div>
            <div class="menu-card-body">
              <h5>Wood-Fired Pepperoni</h5>
              <p>
                Hand-stretched dough, tangy San Marzano tomato sauce, generous
                pepperoni, and melted mozzarella.
              </p>
            </div>
            <div class="menu-card-footer">
              <span class="menu-price">₱349</span>
              <button class="btn-order" id="order-pizza">
                <i class="bi bi-bag-plus"></i> Order
              </button>
            </div>
          </div>
        </div>

        <!-- Fried Chicken -->
        <div
          class="col-sm-6 col-lg-4 menu-item reveal delay-3"
          data-category="chicken"
        >
          <div class="menu-card">
            <div class="menu-card-img">
              <img
                src="/assets/images/menu_chicken.png"
                alt="Crispy Fried Chicken"
                loading="lazy"
              />
              <span class="menu-badge">Crispy Pick</span>
            </div>
            <div class="menu-card-body">
              <h5>Crispy Fried Chicken</h5>
              <p>
                Golden-crusted, perfectly seasoned fried chicken served with
                creamy coleslaw and smoky dipping sauce.
              </p>
            </div>
            <div class="menu-card-footer">
              <span class="menu-price">₱299</span>
              <button class="btn-order" id="order-chicken">
                <i class="bi bi-bag-plus"></i> Order
              </button>
            </div>
          </div>
        </div>

        <!-- Pasta -->
        <div
          class="col-sm-6 col-lg-4 menu-item reveal delay-1"
          data-category="pasta"
        >
          <div class="menu-card">
            <div class="menu-card-img">
              <img
                src="/assets/images/menu_pasta.png"
                alt="Creamy Carbonara Pasta"
                loading="lazy"
              />
              <span class="menu-badge">Chef's Choice</span>
            </div>
            <div class="menu-card-body">
              <h5>Creamy Carbonara</h5>
              <p>
                Silky egg sauce, crispy pancetta, al dente spaghetti, freshly
                grated parmesan, and cracked black pepper.
              </p>
            </div>
            <div class="menu-card-footer">
              <span class="menu-price">₱279</span>
              <button class="btn-order" id="order-pasta">
                <i class="bi bi-bag-plus"></i> Order
              </button>
            </div>
          </div>
        </div>

        <!-- Drinks -->
        <div
          class="col-sm-6 col-lg-4 menu-item reveal delay-2"
          data-category="drinks"
        >
          <div class="menu-card">
            <div class="menu-card-img">
              <img
                src="/assets/images/menu_drinks.png"
                alt="Refreshing Drinks"
                loading="lazy"
              />
              <span class="menu-badge">Refreshing</span>
            </div>
            <div class="menu-card-body">
              <h5>Signature Drinks</h5>
              <p>
                Freshly made lemonades, tropical smoothies, cold brew coffee,
                and classic sodas to quench your thirst.
              </p>
            </div>
            <div class="menu-card-footer">
              <span class="menu-price">₱89</span>
              <button class="btn-order" id="order-drinks">
                <i class="bi bi-bag-plus"></i> Order
              </button>
            </div>
          </div>
        </div>

        <!-- Combo Meal -->
        <div
          class="col-sm-6 col-lg-4 menu-item reveal delay-3"
          data-category="burger"
        >
          <div class="menu-card">
            <div
              class="menu-card-img"
              style="
                background: linear-gradient(135deg, #e63946, #ff6b35);
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <div style="text-align: center; padding: 30px">
                <div style="font-size: 4rem; margin-bottom: 12px">🍔🍕🥤</div>
                <div style="font-size: 1.1rem; font-weight: 700; color: #fff">
                  Ultimate Combo
                </div>
                <div
                  style="font-size: 0.88rem; color: rgba(255, 255, 255, 0.8)"
                >
                  Burger + Pizza Slice + Drink
                </div>
              </div>
            </div>
            <span
              class="menu-badge"
              style="background: var(--accent); color: var(--dark)"
              >🔥 Best Value</span
            >
            <div class="menu-card-body">
              <h5>The SupahBowl Combo</h5>
              <p>
                Can't decide? Get it all — our signature burger, a pizza slice,
                and a refreshing drink at an unbeatable price.
              </p>
            </div>
            <div class="menu-card-footer">
              <span class="menu-price">₱449</span>
              <button class="btn-order" id="order-combo">
                <i class="bi bi-bag-plus"></i> Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
