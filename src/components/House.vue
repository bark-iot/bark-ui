<template>
  <v-container>
    <v-tabs v-model="active" centered fixed>
      <v-toolbar extended color="orange" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title slot="extension" class="display-2">{{ house.title }}</v-toolbar-title>
        <v-subheader v-text="house.address"></v-subheader>
      </v-toolbar>
      <v-tabs-bar class="orange" dark>
        <v-tabs-item
          v-for="tab in tabs"
          :key="tab"
          :href="'#' + tab"
          ripple
        >
          {{ tab. title }}
        </v-tabs-item>
        <v-tabs-slider color="white"></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-items>
        <v-tabs-content
          v-for="tab in tabs"
          :key="tab"
          :id="tab"
        >
          <v-card flat>
            <v-card-text></v-card-text>
          </v-card>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        house: null,
        active: null,
        tabs: [
          {title: 'General info'},
          {title: 'Devices'}
        ]
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
