import Vue from 'vue';
import VueRouter from 'vue-router';
import Icecreams from "@/views/Icecream.vue";
import Auth from "@/views/Auth.vue";
import Home from "@/views/Home.vue";
import Signup from "@/views/Signup.vue";
import Orders from "@/views/Orders.vue";
import CustomizeIcecream from "@/views/CustomizeIcecream.vue";
import Flavors from "@/views/Flavors.vue";
import Toppings from "@/views/Toppings.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/home",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/icecreams",
                name: "Icecreams",
                component: Icecreams
            },
            {
                path: "/orders",
                name: "Orders",
                component: Orders
            },
            {
                path: "/customize-icecream",
                name: "CustomizeIcecream",
                component: CustomizeIcecream
            },
            {
                path: "/flavors",
                name: "Flavors",
                component: Flavors
            },
            {
                path: "/toppings",
                name: "Toppings",
                component: Toppings
            },
        ]
    },
    {
        path: "/",
        name: "Auth",
        component: Auth
    },
    {
        path: "/sign-up",
        name: "Signup",
        component: Signup
    },

];

const router = new VueRouter({
    routes // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
    if (to.name !== "Auth" && to.name !== "Signup"){
        let authToken = localStorage.getItem("icecream-user-token");
        
        if (authToken === null || authToken.length <=0 || typeof authToken === "undefined"){
            localStorage.clear();
            next({ name: "Login", params: { allow: "no" }});
        } else {
            next();
        }
    } else {
        next();
    }
});
export default router;