<template>
  <v-container>
    <h1>Devices</h1>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        devices: []
      }
    },
    localStorage: {
      userToken: ''
    },
    mounted() {
      this.getDevices()
    },
    methods: {
      getHouse() {
        this.$http.get('/houses/' + this.$route.params.id + '/devices', {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.devices = response.body
        }, response => {
          this.$emit('show-error', ['Server error'])
        })
      }
    }
  }
</script>
