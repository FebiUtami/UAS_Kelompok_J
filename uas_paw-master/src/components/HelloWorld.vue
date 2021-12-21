<template>
  <v-container class="mt-12 full">
    <v-row class="text-center" justify="center" align="center">
      <v-col class="mb-4 mt-8">
        <h1 class="display-2 font-weight-bold mb-3 " style="{color: white}">
          Selamat Datang di Restoran kami
        </h1>
        <v-btn>Click Here to Order</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',

  data: () => ({
    items: [
        {
          src: 'http://127.0.0.0:8080/background.jpg',
        },
        {
          src: 'http://127.0.0.1:8080/background1.jpg',
        },
        {
          src: 'http://127.0.0.1:8080/background2.jpg',
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
        },
      ],
  })
}
</script>
