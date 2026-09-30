<template>
  <div class="cart-page">
    <h2>🛒 Shopping Cart</h2>
    
    <div v-if="cart.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>
      <router-link to="/books" class="btn-primary">Browse Books</router-link>
    </div>

    <div v-else class="cart-container">
      <div class="cart-items">
        <transition-group name="list" tag="div" class="cart-items-list">
          <div v-for="item in cart" :key="item.id" class="cart-item">
            <img :src="item.coverUrl" :alt="item.title" class="cart-item-img" />
            <div class="cart-item-details">
              <h4>{{ item.title }}</h4>
              <p class="item-price">${{ Number(item.price || 0).toFixed(2) }}</p>
            </div>
            <div class="cart-item-actions">
              <span class="quantity">Qty: {{ item.quantity || 1 }}</span>
              <button @click="removeFromCart(item.id)" class="btn-remove">Remove</button>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Total Items:</span>
          <span>{{ totalItems }}</span>
        </div>
        <div class="summary-row total">
          <span>Total Price:</span>
          <span>${{ totalPrice.toFixed(2) }}</span>
        </div>
        
        <!-- زرار إتمام الطلب / Submit -->
        <button @click="checkout" class="btn-checkout">
          Submit Order 
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  cart: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['remove', 'clear']);

const removeFromCart = (id) => {
  emit('remove', id);
};

const totalItems = computed(() => {
  return props.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
});

const totalPrice = computed(() => {
  return props.cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
});

const checkout = () => {
  alert('Thank you for your purchase! Order submitted successfully.');
  emit('clear');
};
</script>

<style scoped>
.cart-page {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
}
.empty-cart {
  text-align: center;
  padding: 40px;
}
.cart-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}
@media (max-width: 768px) {
  .cart-container {
    grid-template-columns: 1fr;
  }
}
.cart-items {
  display: flex;
  flex-direction: column;
}
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cart-item {
  display: flex;
  align-items: center;
  background: var(--card-bg, #fff);
  border: 1px solid var(--border);
  padding: 16px;
  border-radius: 8px;
  gap: 16px;
  transition: all 0.3s ease;
}
.cart-item-img {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
.cart-item-details {
  flex-grow: 1;
}
.item-price {
  color: var(--accent);
  font-weight: bold;
}
.btn-remove {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}
.btn-remove:hover {
  background: #d9363e;
  transform: scale(1.05);
}

/* Vue Transition Group Animation for Removing Items */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.cart-summary {
  background: var(--card-bg, #fff);
  border: 1px solid var(--border);
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
}
.summary-row.total {
  font-weight: bold;
  font-size: 18px;
  border-top: 1px solid var(--border);
  padding-top: 12px;
}
.btn-checkout {
  width: 100%;
  background: #28a745; 
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
  transition: background 0.2s, transform 0.1s;
}
.btn-checkout:hover {
  background: #218838;
  transform: translateY(-2px);
}
.btn-checkout:active {
  transform: translateY(0);
}
</style>