<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <div class="text-xs-center">
        <h1>{{ msg }}</h1>
        <v-btn color="orange" dark @click="goTo('/login')">Get Started</v-btn>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'welcome',
  data () {
    return {
      msg: 'Welcome to Bark IoT'
    }
  },
  methods: {
    goTo (path) {
      this.$router.push(path)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
