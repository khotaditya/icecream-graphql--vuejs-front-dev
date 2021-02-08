<template>
  <div class="row h-100">
    <div class="col-md-4 h-100 d-flex align-self-center flex-column">
      <div class="d-flex flex-column align-self-center my-auto">
        <p class="forgot-password text-center mt-2 mb-4">
          <router-link to="/">Sign-in</router-link>
        </p>
      </div>
    </div>
    <div class="col-md-8 d-flex flex-column login-form justify-content-center">
      <div class="h3 align-self-center mb-3">Registration</div>
      <form
        class="align-self-center w-75"
        id="userRegistration"
        @submit.prevent="handleSubmit(userForm)"
        novalidate="true"
      >
        <div class="col-md-6">
          <label>First Name</label>
          <input
            placeholder="First name"
            id="firstname"
            v-model="userForm.firstname"
            type="text"
            class="form-control form-control-sm"
            :class="{
              'is-invalid': isSubmitted && $v.userForm.firstname.$error,
            }"
          />
          <div
            v-if="isSubmitted && $v.userForm.firstname.$error"
            class="invalid-feedback"
          >
            <span v-if="!$v.userForm.firstname.required"
              >First Name field is required</span
            >
          </div>
        </div>
        <br />
        <div class="col-md-6">
          <label>last Name</label>
          <input
            placeholder="Last name"
            id="lastname"
            v-model="userForm.lastname"
            type="text"
            class="form-control form-control-sm"
            :class="{
              'is-invalid': isSubmitted && $v.userForm.lastname.$error,
            }"
          />
          <div
            v-if="isSubmitted && $v.userForm.lastname.$error"
            class="invalid-feedback"
          >
            <span v-if="!$v.userForm.lastname.required"
              >Last Name field is required</span
            >
          </div>
        </div>
        <br />
        <div class="col-md-6">
          <label>Email address</label>
          <input
            placeholder="Email address"
            id="email"
            v-model="userForm.email"
            type="email"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': isSubmitted && $v.userForm.email.$error }"
          />
          <div
            v-if="isSubmitted && $v.userForm.email.$error"
            class="invalid-feedback"
          >
            <span v-if="!$v.userForm.email.required"
              >Email field is required</span
            >
          </div>
        </div>
        <br />
        <div class="col-md-6">
          <label>Password</label>
          <input
            placeholder="Password"
            id="password"
            v-model="userForm.password"
            type="password"
            class="form-control form-control-sm"
            :class="{
              'is-invalid': isSubmitted && $v.userForm.password.$error,
            }"
          />
          <div
            v-if="isSubmitted && $v.userForm.password.$error"
            class="invalid-feedback"
          >
            <span v-if="!$v.userForm.password.required"
              >Password field is required</span
            >
          </div>
        </div>
        <br />
        <button
          type="submit"
          style="margin-bottom: 80px"
          class="btn btn-info btn-lg btn-block"
        >
          Create Account
        </button>
      </form>
      <b-alert :show="showAlert" variant="danger" dismissible fade>{{
        errortext
      }}</b-alert>
    </div>
  </div>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import axios from "axios";
export default {
  name: "Signup",
  data: function () {
    return {
      userForm: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      },
      showAlert: false,
      errortext: false,
      isSubmitted: false,
    };
  },
  validations: {
    userForm: {
      firstname: {
        required,
      },
      email: {
        required,
        email,
      },
      lastname: {
        required,
      },
      password: {
        required,
        minLength: minLength(8),
      },
    },
  },
  methods: {
    async handleSubmit(userForm) {
      this.isSubmitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      console.log(userForm.firstname);
      try {
        const submitData = {
          firstname: this.userForm.firstname,
          lastname: this.userForm.lastname,
          email: this.userForm.email,
          password: this.userForm.password,
          isAdmin: false,
        };
        let requestBody = {
          query: `
                mutation createUser($firstname:String!, $lastname: String!, $email: String!, $password: String!, $isAdmin: Boolean!) {
                    createUser(userInput:{firstname: $firstname, lastname: $lastname, email: $email, password: $password, isAdmin: $isAdmin}){
                        _id
                        firstname
                        lastname
                        email
                    }
                }`,
          variables: submitData,
        };
        const res = await axios({
          url: "http://localhost:3000/graphql",
          method: "POST",
          data: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        if (res.data.errors) {
          this.showAlert = true;
          this.errortext = res.data.errors[0].message;
        }
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>