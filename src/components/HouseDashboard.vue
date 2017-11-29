<template>
  <v-container>
    <h1>Dashboard</h1>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        house: {
          title: ''
        }
      }
    },
    localStorage: {
      userToken: ''
    },
    mounted() {
      this.getHouse()
    },
    methods: {
      getHouse() {
        this.$http.get('/houses/' + this.$route.params.id, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.house = response.body
        }, response => {
          this.$emit('show-error', ['Server error'])
        })
      }
    }
  }
</script>
