<template>
  <div class="text-xs-center">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
  export default {
    name: 'welcome',
    data () {
      return {
        msg: 'Profile'
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
