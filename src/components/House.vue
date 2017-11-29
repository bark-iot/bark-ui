<template>
  <v-container>
    <v-tabs centered fixed>
      <v-toolbar extended color="orange" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title slot="extension" class="display-2">{{ house.title }}</v-toolbar-title>
        <v-subheader v-text="house.address"></v-subheader>
      </v-toolbar>
      <v-tabs-bar class="orange" dark>
        <v-tabs-item :to="'/houses/' + house.id + '/dashboard'" router>
          Dashboard
        </v-tabs-item>
        <v-tabs-item :to="'/houses/' + house.id + '/devices'" router>
          Devices
        </v-tabs-item>
        <v-tabs-slider color="white"></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-items>
        <router-view></router-view>
      </v-tabs-items>
    </v-tabs>
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
      goToTab(key, path) {
        this.active = key
        //this.$router.push(path)
      },
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
