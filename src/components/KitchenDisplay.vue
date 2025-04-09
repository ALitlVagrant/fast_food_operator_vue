<template>
  <div class="kitchen-container">
    <h1>Köksdisplay</h1>

    <div class="orders-wrapper">
      <div class="orders-section">
        <h2>Pågående ordrar</h2>
        <div v-if="activeOrders.length === 0">Inga pågående ordrar</div>
        <div v-for="order in activeOrders" :key="order.id" class="order-card">
          <p>Order #: {{ order.orderNumber }}</p>
          <button @click="markOrderAsComplete(order)">Markera som klar</button>
        </div>
      </div>

      <div class="orders-section ready">
        <h2>Färdiga ordrar</h2>
        <div v-if="completedOrders.length === 0">Inga färdiga ordrar</div>
        <div v-for="order in completedOrders" :key="order.id" class="order-card completed">
          <p>Order #: {{ order.orderNumber }}</p>
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
    };
  },
  computed: {
    activeOrders() {
      return this.orders.filter(order => !order.isCompleted);
    },
    completedOrders() {
      return this.orders.filter(order => order.isCompleted);
    },
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await fetch('https://localhost:8080/api/order/GetOrders');
        const data = await res.json();
        this.orders = data;
      } catch (error) {
        console.error('Fel vid hämtning av ordrar:', error);
      }
    },
    async markOrderAsComplete(order) {
      try {
        const response = await fetch('https://localhost:8080/api/order/completeOrder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: order.id }),
        });

        if (!response.ok) throw new Error('Misslyckades att markera order som klar');
        await this.fetchOrders(); // Uppdatera listan
      } catch (error) {
        console.error('Fel vid uppdatering av order:', error);
      }
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.kitchen-container {
  max-width: 1000px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
  text-align: center;
}
.orders-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}
.orders-section {
  flex: 1;
  background: #f8f8f8;
  border-radius: 10px;
  padding: 1rem;
}
.orders-section.ready {
  background: #e6ffe6;
}
.order-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
}
.order-card.completed {
  background-color: #c8ffc8;
}
button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
