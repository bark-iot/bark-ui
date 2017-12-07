<template>
  <v-container>
    <v-breadcrumbs divider="/">
      <v-breadcrumbs-item router :to="'/houses/' + $route.params.house_id">
        House
      </v-breadcrumbs-item>
      <v-breadcrumbs-item>
        {{ device.title }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-tabs centered fixed>
      <v-toolbar extended color="primary" dark>
        <v-spacer></v-spacer>
        <v-toolbar-title slot="extension" class="display-2">{{ device.title }}</v-toolbar-title>
        <v-subheader v-text="device.com_type"></v-subheader>
      </v-toolbar>
      <v-tabs-bar class="primary" dark>
        <v-tabs-item
          v-for="tab in tabs"
          :to="'/houses/' + $route.params.house_id + '/devices/' + device.id + tab.href"
          router
        >{{ tab.title }}</v-tabs-item>
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
        device: {
          title: '',
          type: ''
        },
        tabs: [
          {title: 'Triggers', href: '/triggers'},
          {title: 'Actions', href: '/actions'}
        ]
      }
    },
    localStorage: {
      userToken: ''
    },
    mounted() {
      this.getDevice()
    },
    methods: {
      getDevice() {
        this.$http.get('/houses/' + this.$route.params.house_id + '/devices/' + this.$route.params.device_id, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.device = response.body
        }, response => {
          this.$emit('show-error', ['Server error'])
        })
      }
    }
  }
</script>
