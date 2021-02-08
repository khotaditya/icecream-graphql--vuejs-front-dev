<template>
  <div class="hello">
      
        <div v-if="data">
          <div v-for="todo in data.allTodos" :key="todo._id">{{todo.flavor1}}</div>
        </div>
      
      
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  apollo: {
    allTodos: gql`
      query {
        icecreams{
          _id
          flavor1
          toppings
        }
      }`
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
