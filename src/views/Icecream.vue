<template>
  <div>
    <h2>All Icecreams</h2>
    <div class="col-md-3">
      <router-link to="/customize-icecream"
        ><a>
          <button class="btn btn-info btn-md btn-block">
            Customize icecream
          </button>
        </a>
      </router-link>
    </div>
  </div>
</template>


<script>
//import axios from "axios";
export default {
  name: "Icecreams",

  data: function () {
    return {
      icecreams: [],
    };
  },
};
</script>