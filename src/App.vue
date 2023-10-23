<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import InvoiceView from './views/InvoiceView.vue'
import SingleInvoiceView from './views/SingleInvoiceView.vue'
</script>

<template>
  <header>
    <div class="wrapper">    
      <nav>
        <Navbar/>
        
      </nav>
    </div>
    <!-- <RouterView/> -->
  </header>


</template>

<style scoped>

</style>