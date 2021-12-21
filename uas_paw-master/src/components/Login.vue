<!-- @format -->
<template>
  <div>
    <div class="dashboard">
      <v-app-bar app fixed color="#B71C1C">
        <!-- <v-toolbar-items>
        <v-btn router @click="logout()">
          <v-icon>mdi-power</v-icon>
        </v-btn>
      </v-toolbar-items> -->
      </v-app-bar>
      <div class="grey lighten-4 fullheight pa-10">
        <div class="grey lighten-4 fullheight pa-10">
          <v-container>
            <v-layout>
              <v-card class="px-7 py-5 ma-auto">
                <v-card-title> </v-card-title>
                <v-row justify="center">
                  <v-img
                    lazy-src="http://127.0.0.1:8080/logo.jpg"
                    max-height="250"
                    max-width="250"
                    class="ma-5"
                    src="http://127.0.0.1:8080/logo.jpg"
                  ></v-img>
                </v-row>
                <v-form ref="form" class="my-6" v-model="valid" lazy-validation>
                  <v-text-field
                    class="mx-4"
                    v-model="email"
                    label="Email"
                    required
                    :rules="emailRules"
                    type="email"
                  ></v-text-field>
                  <v-text-field
                    class="mx-4"
                    v-model="password"
                    label="Password"
                    required
                    :rules="passwordRules"
                    type="password"
                  ></v-text-field>
                  <v-row class="ma-3">
                    <v-btn block color="#B71C1C" @click="submit" dark>
                      Login</v-btn
                    >
                  </v-row>
                  <v-row class="ma-3">
                    <v-btn block color="#3FF3FF" @click="register" dark>
                      Register
                    </v-btn>
                  </v-row>
                </v-form>
              </v-card>
            </v-layout>
          </v-container>
        </div>
      </div>
    </div>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Jolly%20Lodger");

.whiteText {
  color: whitesmoke;
}

.grey--text {
  font-family: "Jolly Lodger";
}

.posisinya {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
}

.sizeCardView {
  height: auto;
}
</style>

<script>
export default {
  name: "Login",
  data: function () {
    return {
      load: false,
      snackbar: false,
      e1: 1,
      error_message: "",
      toogleLogin: true,
      color: "",
      valid: false,
      password: "",
      email: "",
      passwordRules: [(v) => !!v || "Password is required"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      regisData: {
        nama: "",
        email: "",
        pass: "",

        conPass: "",
      },
    };
  },
  methods: {
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    register(){
      this.$router.replace({
        path: "/register",
      });
    },
    submit() {
      //cek apakah data yang akan dikirim sudah valid;
      if (this.$refs.form.validate()) {
        this.load = true;
        this.$http
          .post(this.$api + "/user/login", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            console.log(response)
            sessionStorage.setItem("id", response.data.data.user.id); //menyimpan id user yang sedang login
            sessionStorage.setItem("token", response.data.data.token);
            //menyimpan auth token
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.resetValidation();
            this.clear();
            this.$router.replace({
              path: "/home",
            });
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            sessionStorage.removeItem("token");
            this.load = false;
          });
      } else {
        this.error_message = "Submit Failed";
        this.color = "red";
        this.snackbar = true;
      }
    },
    clear() {
      this.email = "";
      this.password = "";
    },
  },
};
</script>


