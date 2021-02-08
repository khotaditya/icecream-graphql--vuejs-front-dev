<template>
  <div>
    <h2>List of toppings</h2>
    <div class="row">
      <div class="col-md-2">
        <button
          v-show="isAdmin"
          class="btn btn-info btn-md btn-block"
          @click="modalAddToppings = !modalAddToppings"
        >
          Add new toppings
        </button>
      </div>
    </div>
    <br />
    <div class="row">
      <div class="col-md-12">
        <b-pagination
          class="customPagination"
          v-model="table.currentPage"
          :total-rows="rows"
          :per-page="table.perPage"
          aria-controls="consumers-table"
        ></b-pagination>
        <b-table
          class="my-table"
          striped
          hover
          :items="table.items"
          :fields="computedFields"
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
          <template v-slot:cell(available)="row">
            <b-form-checkbox v-model="row.item.available" name="check-button" switch></b-form-checkbox>
          </template>
        </b-table>

        <b-alert :show="table.showAlert" variant="danger" dismissible fade>{{
          table.alert
        }}</b-alert>
      </div>
    </div>
    <b-modal v-model="modalAddToppings" hide-footer @show="resetModal">
      <template v-slot:modal-title> Add new toppings </template>
      <b-form class="w-100" @submit.prevent="handleSubmit(toppingsForm)">
        <b-form-group id="title-group" label="Title:" label-for="title">
          <b-form-input
            id="title"
            v-model="toppingsForm.title"
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
            v-model="toppingsForm.description"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="price-group" label="Price (€):" label-for="price">
          <b-form-input
            id="price"
            type="number"
            v-model="toppingsForm.price"
            step="0.01"
            min="0.00"
            max="1000.00"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="available-group" label-for="available">
          <b-form-checkbox v-model="toppingsForm.available"
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
      <b-alert :show="showAlert" variant="danger" dismissible fade>{{
        errortext
      }}</b-alert>
    </b-modal>
  </div>
</template>


<script>
import axios from "axios";
export default {
  name: "Toppings",

  data: function () {
    return {
      modalAddToppings: false,
      toppingsForm: {
        title: "",
        description: "",
        price: null,
        available: true,
      },
      currentPage: 1,
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
          {
            kay: "available",
            label: "Available"
          },
        ],
        items: [],
        loading: false,
        alert: "",
      },
      isAdmin: true,
    };
  },
  computed: {
    rows() {
      return this.table.items.length;
    },
    computedFields() {
      console.log(this.isAdmin);
      // If the user isn't an admin, filter out fields that require auth.
      /*if (!this.isAdmin)
        return this.table.fields.filter((field) => !field.requiresAdmin);
      // If the user IS an admin, return all fields.
      else return this.table.fields;*/
      if(!this.isAdmin){
        return this.table.fields;
      }else{
        return this.table.fields.map(x => ({
          title: x.title,
          description: x.description,
          price: x.price
        }))
      }
    },
  },
  methods: {
    async isUserAdmin() {
      let admin = await localStorage.getItem("icecream-user-isAdmin");
      if (admin === "true") {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    },
    async getToppings() {
      try {
        this.table.loading = true;
        const query = `{
                toppings{
                    title
                    description
                    price
                    available
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
          this.table.items = res.data.data.toppings;
          this.table.loading = false;
        }
      } catch (err) {
        console.log(err);
        this.table.showAlert = true;
        this.table.alert = err.response.data.errors[0].message;
      }
    },
    resetModal() {
      this.toppingsForm.title = "";
      this.toppingsForm.description = "";
      this.toppingsForm.price = null;
    },
    async handleSubmit() {
      try {
        const submitData = {
          title: this.toppingsForm.title,
          description: this.toppingsForm.description,
          price: parseFloat(this.toppingsForm.price),
          available: this.toppingsForm.available,
        };
        console.log(submitData);
        let requestBody = {
          query: `
                mutation addToppings($title:String!, $description: String!, $price: Float!, $available: Boolean!) {
                    addToppings(toppingInput:{title: $title, description: $description, price: $price, available: $available}){
                        _id
                        title
                        price
                    }
                }`,
          variables: submitData,
        };
        const token = localStorage.getItem("icecream-user-token");

        const res = await axios({
          url: "http://localhost:3000/graphql",
          method: "POST",
          data: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
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

        this.modalAddToppings = false;
        this.getToppings();
      } catch (err) {
        console.log(err);
        this.showAlert = true;
        this.errortext = err.response.data.errors[0].message;
      }
    },
  },
  mounted() {
    this.isUserAdmin();
    this.getToppings();
  },
};
</script>