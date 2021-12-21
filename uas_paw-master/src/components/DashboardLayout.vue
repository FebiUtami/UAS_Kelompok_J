<template>
<div>
    <v-navigation-drawer v-model="drawer" width="256" app color="white">
        <v-app-bar app fixed color="#B71C1C"></v-app-bar>
        <v-img class="my-8 mx-auto justify-center" lazy-src="http://127.0.0.1:8000/Picture2.svg" max-height="150" max-width="150" src="http://127.0.0.1:8000/Picture2.svg"></v-img>

        <v-divider class="mt-2" color="white"></v-divider>

        <v-list dense nav class="mt-2">
            <v-list-item v-for="item in items" :key="item.title" link tag="router-link" :to="item.to">
                <v-list-item-icon>
                    <v-icon class="red--text text--darken-4">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="#B71C1C">
        <v-app-bar-nav-icon @click="drawer = !drawer" color="white"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-card-text class="mx-4 white--text text-right">
            <v-icon class="mr-2" color="white">mdi-account</v-icon>
            {{ user }}
        </v-card-text>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-on="on" v-bind="attrs" @click="dialog = true">
                    <v-icon>mdi-power</v-icon>
                </v-btn>
            </template>
            <span>Logout</span>
        </v-tooltip>
    </v-app-bar>
    <div class="grey lighten-4 fullheight pa-5">
        <router-view></router-view>
    </div>
    <v-dialog v-model="dialog" width="500">
        <v-card>
            <v-card-title class="headline grey lighten-2">
                Are you sure want to logout?
            </v-card-title>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn router @click="logout(), (dialog = false)" color="primary" text>
                    I accept
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
export default {
    name: "Dashboard",
    data() {
        return {
            user: "",
            dialog: false,
            drawer: false,
            items: [],
        };
    },
    methods: {
        logout() {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("id");
            sessionStorage.removeItem("role");
            delete this.$http.defaults.headers.common["Authorization"];
            this.$router.push({
                path: "/login",
            });
        },
        isManager() {
            this.items = [{
                    title: "Dashboard",
                    to: "/home",
                    icon: "mdi-view-dashboard",
                    items: false,
                },
                // {
                //   title: "Reservasi",
                //   to: "/reservasi",
                //   icon: "mdi-book-check",
                //   items: false,
                // },
                {
                    title: "Order",
                    to: "/order",
                    icon: "mdi-room-service",
                    items: false,
                },
                {
                    title: "Menu",
                    to: "/menu",
                    icon: "mdi-book-open-page-variant"
                },
                // {
                //   title: "Bahan",
                //   to: "/bahan",
                //   icon: "mdi-food-drumstick-outline",
                // },
                {
                  title: "Profile",
                  to: "/profile",
                  icon: "mdi-account-settings",
                  items: false,
                },
                // {
                //   title: "Meja",
                //   to: "/meja",
                //   icon: "mdi-table",
                //   items: false,
                // },
            ];
        },
    },
    mounted() {
        this.isManager();
    },
};
</script>

<style scoped>
.router {
    text-decoration: none;
    color: black;
}
</style>
