<template>
  <div class="home row">
    <div class="icecream-theme-color-1 menu col-md-2 pr-0 my-div-border">
      <div class="background-white mx-auto d-block col-md-12">
        <h2>Get Icecreams</h2>
      </div>
      <b-nav vertical class="w-100 h5">
        <b-nav-item to="/icecreams" class="mb-2">
          <font-awesome-icon icon="ice-cream" />
          Icecreams</b-nav-item
        >
        
        <b-nav-item to="/orders" class="mb-2">
          <font-awesome-icon icon="shopping-cart" />
          Orders</b-nav-item
        >
        <b-nav-item to="/flavors" class="mb-2">
          <font-awesome-icon icon="heart" />
          Flavors</b-nav-item
        >
        <b-nav-item to="/toppings" class="mb-2">
          <font-awesome-icon icon="cookie-bite" />
          Toppings</b-nav-item
        >
        <b-nav-item @click="logout" class="mb-2">
          <font-awesome-icon icon="sign-out-alt" />
          Logout</b-nav-item
        >
      </b-nav>
    </div>
    <div class="col-md-10 content">
      <router-view></router-view>
    </div>
  </div>
</template>
<style scoped>
.my-div-border {
  border-right: 1px solid #cccccc;
}
.background-white {
  background-color: #ffffff;
}
.menu {
  height: 100vh;
}
.menu a {
  color: black;
}
.content {
  height: 100vh;
}
</style>

<script>
import routes from "../router";
export default {
  name: "Home",

  data: function () {
    return {
      icecreams: [],
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      routes.push({ name: "Auth" });
    },
  },
};
</script>