<template>
  <v-container>
    <p class="headline">
      <strong class="orange--text">Title:</strong>
      <span>{{ house.title }}</span>
    </p>
    <p class="headline">
      <strong class="orange--text">Address:</strong>
      <span>{{ house.address }}</span>
    </p>
    <p class="headline">
      <strong class="orange--text">Key:</strong>
      <span>{{ house.key }}</span>
    </p>
    <p class="headline">
      <strong class="orange--text">Secret:</strong>
      <span><v-chip color="red" text-color="white">unavailable</v-chip></span>
    </p>
    <p class="headline">
      <strong class="orange--text">Created at:</strong>
      <span>{{ house.created_at }}</span>
    </p>
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
          bus.$emit('show-error', ['Server error'])
        })
      }
    }
  }
</script>
