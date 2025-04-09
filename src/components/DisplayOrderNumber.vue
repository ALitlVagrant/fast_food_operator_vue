<template>
  <div class="display-box">
    <h2>Aktuella könummer</h2>
    <div class="number-display">
      <p v-if="orderNumbers.length > 0" v-for="(num, index) in orderNumbers" :key="index">
        #{{ num }}
      </p>
      <p v-else>Hämtar könummer...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DisplayOrder',
  data() {
    return {
      orderNumbers: [],
      intervalId: null, // För att spara intervallet
    };
  },
  mounted() {
    this.getOrderNumbers(); // Första hämtningen direkt
    this.intervalId = setInterval(this.getOrderNumbers, 5000); // Uppdatera var 5:e sekund
  },
  beforeUnmount() {
    // Rensa intervallet om komponenten tas bort
    clearInterval(this.intervalId);
  },
  methods: {
    async getOrderNumbers() {
      try {
        const response = await fetch('https://localhost:8080/api/order/displayOrderNumbers');

        if (!response.ok) {
          throw new Error(`API-svar: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API-svar:', data);

        if (data && data.orderNumbers && data.orderNumbers.length > 0) {
          this.orderNumbers = data.orderNumbers;
        } else {
          this.orderNumbers = [];
        }

      } catch (error) {
        console.error('Kunde inte hämta könummer:', error);
      }
    },
  },
};
</script>

<style scoped>

.display-box {
  text-align: center;
  padding: 2rem;
  background-color: #f0f0f0;
  border-radius: 12px;
  max-width: 400px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.number-display p {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 1rem 0;
}
</style>
