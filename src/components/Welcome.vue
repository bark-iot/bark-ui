<template>
  <div class="text-xs-center">
    <h1>{{ msg }}</h1>
    <v-btn color="primary" dark @click="goTo('/login')">Get Started</v-btn>
  </div>
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
