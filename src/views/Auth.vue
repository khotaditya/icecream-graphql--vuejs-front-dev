<template>
  <div class="row h-100">
    <div
      class="col-md-4 h-100 d-flex flex-column login-form justify-content-center"
    >
      <div class="h3 align-self-center mb-3">Sign In</div>
      <form class="align-self-center w-75">
        <div class="form-group">
          <label>Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            class="form-control form-control-lg"
            v-model="loginForm.email"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="form-control form-control-lg"
            v-model="loginForm.password"
          />
        </div>

        <button
          @click.prevent="handleSubmit(loginForm)"
          :disabled="$v.loginForm.$invalid"
          class="btn btn-info btn-lg btn-block"
        >
          Submit
        </button>
        <p class="forgot-password text-right mt-2 mb-4">
          <router-link to="/forgot-password">Forgot password</router-link>
        </p>
        <p class="forgot-password text-center mt-2 mb-4">
          <router-link to="/sign-up">New here? Create an account</router-link>
        </p>
      </form>
      <b-alert :show="showAlert" variant="danger" dismissible fade>{{ errortext }}</b-alert>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import routes from "../router";
import { required, email } from "vuelidate/lib/validators";
export default {
  name: "Auth",
  data: function () {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      isSubmitted: false,
      showAlert: false,
      errortext: false,
    };
  },
  validations: {
    loginForm: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    async handleSubmit(loginForm) {
      this.isSubmitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      console.log(loginForm.email);
      try {
        const submitData = {
          email: this.loginForm.email,
          password: this.loginForm.password,
        }
        
        const query = `query Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                userId
                token
                tokenExpiration
                isAdmin
            }
        }`;
        const res = await axios({
          url: "http://localhost:3000/graphql",
          method: "POST",
          data: JSON.stringify({query, variables: submitData
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        this.showAlert= true;
        if (res.status == 200) {
          localStorage.setItem('icecream-user-token', res.data.data.login.token);  
          localStorage.setItem('icecream-user-id', res.data.data.login.userId);
          localStorage.setItem('icecream-user-isAdmin', res.data.data.login.isAdmin);
          routes.push({'name':'Icecreams'});
        }
         
      } catch (err) {
            console.log(err.response.data.errors[0].message);
            this.showAlert= true;
            this.errortext = err.response.data.errors[0].message;
      }
    },
  },
};
</script>