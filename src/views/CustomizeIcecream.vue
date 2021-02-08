<template>
  <div>
    <h2>Customize Your Icecream</h2>
    <div class="col-md-12 d-flex flex-column login-form justify-content-center">
      <form
        class="align-self-center w-75"
        id="customizeIcecream"
        novalidate="true"
      >
        <div class="row">
          <div class="col-md-4">
            <label>First flavor</label>
            <b-form-select
              size="sm"
              v-model="selected"
              :options="flavors"
            ></b-form-select>
          </div>
          <div class="col-md-4">
            <label>Size</label>
            <b-form-select
              size="sm"
              v-model="selected"
              :options="sizes"
            ></b-form-select>
          </div>
          <div class="col-md-4">
            <label>Toppings</label>
            <b-form-select
              size="sm"
              v-model="selected"
              :options="toppings"
            ></b-form-select>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-md-3">
            <button
              type="submit"
              style="margin-bottom: 80px"
              class="btn btn-info btn-md btn-block"
            >
              Add to cart
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
//import axios from "axios";
export default {
  name: "CustomizeIcecream",

  data: function () {
    return {
      icecream: {
        size: "",
      },
      selected: null,
      toppings: [
        { value: null, text: "Please select toppings", disabled: true },
        { value: "Sprinkles", text: "Sprinkles" },
        { value: "Caramel", text: "Caramel" },
        { value: "Oreos", text: "Oreos" },
        { value: "Chocolate", text: "Chocolate" },
      ],
      flavors: [
        { value: null, text: "Please select flavor", disabled: true },
        { value: "Chocolate", text: "Chocolate" },
        { value: "Vanilla", text: "Vanilla" },
        { value: "Strawberry", text: "Strawberry" },
        { value: "Mint chocolate chip", text: "Mint chocolate chip" },
        { value: "Coffee", text: "Coffee" },
        { value: "Pistachio", text: "Pistachio" },
      ],
      sizes: [
        { value: null, text: "Please select size", disabled: true },
        { value: "s", text: "Small" },
        { value: "m", text: "Medium" },
        { value: "l", text: "Large" },
      ],
    };
  },
};
</script>