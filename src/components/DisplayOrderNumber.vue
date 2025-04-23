<template>
  <div class="display-container">
    <div class="company-title">
      <img src="@/assets/Claes_Burgir1.png" alt="Företagslogotyp" class="company-logo">
    </div>

    <div class="display-box">
      <h2>Tillagas</h2>
      <div class="number-display">
        <p v-if="activeOrderNumbers.length > 0" v-for="(num, index) in activeOrderNumbers" :key="index">
          #{{ num }}
        </p>
        <p v-else>Inga aktiva ordrar</p>
      </div>
    </div>

    <div class="completed-orders-box">
      <h2>Redo att hämtas</h2>
      <div class="number-display">
        <p
            v-for="(order, index) in completedOrderNumbers"
            :key="'ready-' + index"
            class="completed-highlight"
        >
          #{{ order.number }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DisplayOrder',
  data() {
    return {
      activeOrderNumbers: [],
      completedOrderNumbers: [],
      intervalId: null,
      cleanupIntervalId: null,
    };
  },
  mounted() {
    this.getOrderNumbers(); // Direkt
    this.intervalId = setInterval(this.getOrderNumbers, 5000); // Uppdatera data
    this.cleanupIntervalId = setInterval(this.cleanupOldOrders, 5000); // Rensa gamla entries
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
    clearInterval(this.cleanupIntervalId);
  },
  methods: {
    async getOrderNumbers() {
      try {
        const response = await fetch('https://localhost:8080/api/order/GetOrders');

        if (!response.ok) throw new Error(`API-svar: ${response.statusText}`);

        const orders = await response.json();

        // Aktiva
        this.activeOrderNumbers = orders
            .filter(order => order.orderStatus === 0 || order.orderStatus === 1)
            .map(order => order.orderNumber);


        const existingNumbers = this.completedOrderNumbers.map(o => o.number);

        const newCompleted = orders
            .filter(order => order.orderStatus === 2) // Endast färdiga ordrar
            .map(order => order.orderNumber)
            .filter(num => !existingNumbers.includes(num))
            .map(num => ({
              number: num,
              timestamp: Date.now(),
            }));


        this.completedOrderNumbers.push(...newCompleted);

      } catch (error) {
        console.error('Kunde inte hämta könummer:', error);
      }
    },

    cleanupOldOrders() {
      const now = Date.now();
      const timeout = 60000; // 60 sekunder

      this.completedOrderNumbers = this.completedOrderNumbers.filter(order => {
        return now - order.timestamp < timeout;
      });
    }
  },
};
</script>



<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseGreen {
  0% {
    background-color: #c3e6cb;
  }
  50% {
    background-color: #a4ddb3;
  }
  100% {
    background-color: #c3e6cb;
  }
}
.company-title img.company-logo {
  width: 80%;        /* Sätt bildens bredd till 80% av förälderelementet */
  max-width: 500px;  /* Sätt en max-bredd för att inte göra bilden för stor */
  height: unset;      /* Bevara bildens proportioner */
}

.display-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
  height: 100vh;
  box-sizing: border-box;
}

.company-title {
  width: 100%;
  text-align: center;
}
.display-box,
.completed-orders-box {
  flex: 1 1 38%;
  padding: 1.2rem;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  min-width: 280px;
  max-width: 420px;
  animation: fadeIn 0.5s ease;
}

.display-box {
  background-color: #e3f2fd;
  border-left: 6px solid #2196f3;
}

.completed-orders-box {
  background-color: #d4edda;
  border-left: 6px solid #28a745;
}

h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #333;
}

.number-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.number-display p {
  font-size: 1.6rem;
  font-weight: bold;
  padding: 0.6rem 1.2rem;
  background-color: #ffffff;
  border-radius: 10px;
  width: 100%;
  max-width: 260px;
  text-align: center;
  color: #212121;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.04);
  animation: fadeIn 0.5s ease;
}

.number-display p.completed-highlight {
  animation: pulseGreen 1.5s ease-in-out 3;
}

.number-display p:last-child {
  color: black;
  font-style: italic;
}
</style>





