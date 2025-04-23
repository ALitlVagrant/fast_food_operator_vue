<template>
  <div class="kitchen-container">
    <h1>Köksdisplay</h1>

    <div class="orders-wrapper">
      <!-- Ej påbörjade ordrar -->
      <div class="orders-section">
        <h2>Ej Påbörjade Ordrar</h2>
        <div v-if="pendingOrders.length === 0">Inga påbörjade ordrar</div>
        <div v-for="order in pendingOrders" :key="order.orderId" :class="['order-card', getOrderCardClass(order)]">
          <p><strong>Order #: </strong>{{ order.orderNumber }}</p>
          <p v-if="order.customerNote"><strong>Notering:</strong> {{ order.customerNote }}</p>
          <p><strong>Skapad:</strong> {{ order.createdAt }}</p>

          <!-- Visa produkter -->
          <div>
            <strong>Produkter:</strong>
            <ul>
              <li v-for="product in order.orderProducts" :key="product.productId">
                {{ product.productName }} x{{ product.quantity }}
                <ul v-if="product.ingredients.length">
                  <li v-for="ingredient in product.ingredients" :key="ingredient.ingredientName">
                    - {{ ingredient.ingredientName }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Visa combos -->
          <div v-if="order.orderCombos.length">
            <strong>Combos:</strong>
            <ul>
              <li v-for="combo in order.orderCombos" :key="combo.comboId">
                {{ combo.comboName }} x{{ combo.quantity }}
                <ul v-if="combo.ingredients.length">
                  <li v-for="ingredient in combo.ingredients" :key="ingredient.ingredientName">
                    - {{ ingredient.ingredientName }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Markera som påbörjad -->
          <button @click="markOrderAsInProgress(order)">Markera som påbörjad</button>
        </div>
      </div>

      <!-- Pågående ordrar -->
      <div class="orders-section">
        <h2>Pågående Ordrar</h2>
        <div v-if="activeOrders.length === 0">Inga pågående ordrar</div>
        <div v-for="order in activeOrders" :key="order.orderId" :class="['order-card', getOrderCardClass(order)]">
          <p><strong>Order #: </strong>{{ order.orderNumber }}</p>
          <p v-if="order.customerNote"><strong>Notering:</strong> {{ order.customerNote }}</p>
          <p><strong>Skapad:</strong> {{ order.createdAt }}</p>

          <!-- Visa produkter -->
          <div>
            <strong>Produkter:</strong>
            <ul>
              <li v-for="product in order.orderProducts" :key="product.productId">
                {{ product.productName }} x{{ product.quantity }}
                <ul v-if="product.ingredients.length">
                  <li v-for="ingredient in product.ingredients" :key="ingredient.ingredientName">
                    - {{ ingredient.ingredientName }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Visa combos -->
          <div v-if="order.orderCombos.length">
            <strong>Combos:</strong>
            <ul>
              <li v-for="combo in order.orderCombos" :key="combo.comboId">
                {{ combo.comboName }} x{{ combo.quantity }}
                <ul v-if="combo.ingredients.length">
                  <li v-for="ingredient in combo.ingredients" :key="ingredient.ingredientName">
                    - {{ ingredient.ingredientName }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Markera som klar -->
          <button @click="markOrderAsComplete(order)">Markera som klar</button>
        </div>
      </div>

      <!-- Färdiga ordrar -->
      <div class="orders-section ready">
        <h2>Färdiga Ordrar</h2>
        <div v-if="completedOrders.length === 0">Inga färdiga ordrar</div>
        <div v-for="order in completedOrders" :key="order.orderId" class="order-card completed">
          <p><strong>Order #: </strong>{{ order.orderNumber }}</p>
          <p v-if="order.customerNote"><strong>Notering:</strong> {{ order.customerNote }}</p>
          <p><strong>Skapad:</strong> {{ order.createdAt }}</p>

          <!-- Visa produkter -->
          <div>
            <strong>Produkter:</strong>
            <ul>
              <li v-for="product in order.orderProducts" :key="product.productId">
                {{ product.productName }} x{{ product.quantity }}
                <ul v-if="product.ingredients.length">
                  <li v-for="ingredient in product.ingredients" :key="ingredient.ingredientName">
                    - {{ ingredient.ingredientName }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <!-- Visa combos -->
          <div v-if="order.orderCombos.length">
            <strong>Combos:</strong>
            <ul>
              <li v-for="combo in order.orderCombos" :key="combo.comboId">
                {{ combo.comboName }} x{{ combo.quantity }}
                <ul v-if="combo.ingredients.length">
                  <li v-for="ingredient in combo.ingredients" :key="ingredient.ingredientName">
                    - {{ ingredient.ingredientName }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KitchenDisplay',
  data() {
    return {
      orders: [],
      intervalId: null, // För att spara intervallet
    };
  },
  computed: {
    pendingOrders() {
      return this.orders.filter(order => order.orderStatus === 0); // Ej påbörjade ordrar
    },
    activeOrders() {
      return this.orders.filter(order => order.orderStatus === 1); // Pågående ordrar
    },
    completedOrders() {
      return this.orders.filter(order => order.orderStatus === 2); // Färdiga ordrar
    }
  },
  methods: {
    getOrderCardClass(order) {
      switch (order.orderStatus) {
        case 0:
          return 'pending';     // Ej påbörjad = röd
        case 1:
          return 'in-progress'; // Påbörjad = gul
        case 2:
          return 'completed';   // Färdig = grön (du har redan `completed` i CSS)
        default:
          return '';
      }
    },

    // Hämtar ordrar från API
    async fetchOrders() {
      try {
        const res = await fetch('https://localhost:8080/api/order/GetOrders');
        const data = await res.json();
        this.orders = data; // Sätt alla ordrar till state
      } catch (error) {
        console.error('Fel vid hämtning av ordrar:', error);
      }
    },

    // Markera order som påbörjad
    async markOrderAsInProgress(order) {
      try {
        const response = await fetch('https://localhost:8080/api/order/startOrder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order.orderId, // Skicka med ordens ID
            orderNumber: order.orderNumber, // Om det behövs
            orderStatus: 1 // Sätt status till "Påbörjad" (1)
          }),
        });

        if (!response.ok) throw new Error('Misslyckades att markera order som påbörjad');

        await this.fetchOrders(); // Uppdatera listan efter att ha markerat som påbörjad
      } catch (error) {
        console.error('Fel vid uppdatering av order:', error);
      }
    },


    // Markera order som klar
    async markOrderAsComplete(order) {
      try {
        const response = await fetch('https://localhost:8080/api/order/completeOrder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: order.orderId }),
        });

        if (!response.ok) throw new Error('Misslyckades att markera order som klar');

        await this.fetchOrders(); // Uppdatera listan efter att ha markerat som klar
      } catch (error) {
        console.error('Fel vid uppdatering av order:', error);
      }
    }
  },
  mounted() {
    this.fetchOrders(); // Hämtar ordrar
    this.intervalId = setInterval(this.fetchOrders, 5000); // Uppdatera ordrarna var 5:e sekund
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  }
};
</script>

<style scoped>
.kitchen-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  background-color: #f4f4f9;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.orders-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap; /* Gör layouten mer responsiv */
}

.orders-section {
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.orders-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.orders-section.ready {
  background: #e9f7e9;
  border-left: 6px solid #28a745;
}

.order-card {
  border: 1px solid #e0e0e0;
  padding: 1rem;
  margin: 0.75rem 0;
  border-radius: 10px;
  background-color: #fafafa;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.order-card:hover {
  background-color: #f1f1f1;
  transform: translateX(5px);
}

/* Färger beroende på orderstatus */
.order-card.pending {
  border-left: 6px solid #dc3545; /* Röd */
}

.order-card.in-progress {
  border-left: 6px solid #ffc107; /* Gul */
}

.order-card.completed {
  background-color: #e3f8e3;
  border-left: 6px solid #28a745; /* Grön */
  border-color: #a2d8a2;
}

button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}
</style>

