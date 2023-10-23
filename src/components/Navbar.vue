<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>


<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
        
      <li class="nav-item active">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
      </li>
      
      <li class="nav-item">
       
      </li>
     
    </ul>
  </div>
</nav>
<RouterView />
</template>

