<template>
  <div>
    <h2>All flavors</h2>
    <div class="row">
      <div class="col-md-2">
        <button
          v-show="isAdmin"
          class="btn btn-info btn-md btn-block"
          @click="modalAddFlavor = !modalAddFlavor"
        >
          Add new flavors
        </button>
      </div>
    </div>
    <br />
    <div class="row">
      <div class="col-md-12">
        <b-table
          class="my-table"
          striped
          hover
          :items="table.items"
          :fields="table.fields"
          :busy="table.loading"
        >
          <template v-slot:table-busy>
            <div class="text-center text-info my-2">
              <b-spinner
                type="grow"
                label="Loading..."
                variant="info"
              ></b-spinner>
            </div>
          </template>
        </b-table>
        <b-alert :show="table.showAlert" variant="danger" dismissible fade>{{
          table.alert
        }}</b-alert>
      </div>
    </div>
    <b-modal v-model="modalAddFlavor" hide-footer @show="resetModal">
      <template v-slot:modal-title> Add new flavor </template>
      <b-form class="w-100" @submit.prevent="handleSubmit(flavorForm)">
        <b-form-group id="title-group" label="Title:" label-for="title">
          <b-form-input
            id="title"
            v-model="flavorForm.title"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="description-group"
          label="Description:"
          label-for="description"
        >
          <b-form-input
            id="description"
            v-model="flavorForm.description"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="price-group" label="Price (€):" label-for="price">
          <b-form-input
            id="price"
            type="number"
            v-model="flavorForm.price"
            step="0.01"
            min="0.00"
            max="1000.00"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="available-group" label-for="available">
          <b-form-checkbox v-model="flavorForm.available"
            >Available</b-form-checkbox
          >
        </b-form-group>
        <div class="row">
          <div class="col-md-3">
            <b-button type="submit" class="btn btn-info btn-block"
              >Add</b-button
            >
          </div>
        </div>
      </b-form>
      <b-alert :show="showAlert" variant="danger" dismissible fade>{{ errortext }}</b-alert>
    </b-modal>
  </div>
</template>
<style scoped>
.my-table {
  text-align: left;
}
</style>

<script>
import axios from "axios";
export default {
  name: "Flavors",

  data: function () {
    return {
      modalAddFlavor: false,
      flavorForm: {
        title: "",
        description: "",
        price: null,
        available: true,
      },
      showAlert: false,
      errortext: false,
      table: {
        fields: [
          {
            key: "title",
            label: "Name",
            sortable: true,
          },
          {
            key: "description",
            label: "Description",
          },
          {
            key: "price",
            label: "Price in Euro",
            sortable: true,
          },
        ],
        items: [],
        loading: false,
        showAlert: false,
        alert: "",
      },
      isAdmin: true,
    };
  },
  methods: {
    isUserAdmin() {
      let admin = localStorage.getItem("icecream-user-isAdmin");
      if (admin === "true") {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    },
    async getFlavors() {
      try {
        this.table.loading = true;
        const query = `{
                flavors{
                    title
                    description
                    price
                }
            }`;
        const res = await axios({
          url: "http://localhost:3000/graphql",
          method: "POST",
          data: JSON.stringify({ query }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status == 200) {
          this.table.items = res.data.data.flavors;
          this.table.loading = false;
        }
      } catch (err) {
        console.log(err);
        this.table.showAlert = true;
        this.table.alert = err.response.data.errors[0].message;
      }
    },
    resetModal() {
      this.flavorForm.title = "";
      this.flavorForm.description = "";
      this.flavorForm.price = null;
    },
    async handleSubmit() {
      try {
        const submitData = {
          title: this.flavorForm.title,
          description: this.flavorForm.description,
          price: parseFloat(this.flavorForm.price),
          available: this.flavorForm.available,
        };
        console.log(submitData);
        let requestBody = {
          query: `
                mutation addFlavor($title:String!, $description: String!, $price: Float!, $available: Boolean!) {
                    addFlavor(flavorInput:{title: $title, description: $description, price: $price, available: $available}){
                        _id
                        title
                        price
                    }
                }`,
          variables: submitData,
        };
        const token = localStorage.getItem('icecream-user-token');
        console.log(token);
        const res = await axios({
          url: "http://localhost:3000/graphql",
          method: "POST",
          data: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + token,
          },
        });
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        if (res.data.errors) {
          this.showAlert = true;
          this.errortext = res.data.errors[0].message;
        }
        console.log(res.data.data);

        this.modalAddFlavor = false;
        this.getFlavors();
      } catch (err) {
        console.log(err);
        this.showAlert = true;
        this.errortext = err.response.data.errors[0].message;
      }
    },
  },
  mounted() {
    this.isUserAdmin();
    this.getFlavors();
  },
};
</script>