<template>
  <div id="app">
    <!-- Navigering mellan sidor -->
    <nav>
      <router-link to="/">Display Order</router-link>
      <router-link to="/kitchen-display">Kitchen Display</router-link>
    </nav>

    <!-- Här renderas den aktuella komponenten beroende på vilken rutt som är vald -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
nav {
  margin-bottom: 1rem;
}

router-link {
  margin-right: 1rem;
}
</style>
