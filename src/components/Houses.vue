<template>
  <v-layout>
    <v-flex xs12 sm4>
      <v-card>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
            <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange">Dashboard</v-btn>
          <v-btn flat color="orange">Edit</v-btn>
          <v-btn flat color="red">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
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
