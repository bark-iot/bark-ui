<template>
  <v-container>
    <v-btn flat icon color="white" @click.native.stop="goTo()">
      <v-icon>add</v-icon>
    </v-btn>
    <v-data-table
      v-bind:headers="headers"
      :items="triggers"
      class="elevation-1"
      hide-actions
      dark
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.title }}</td>
        <td class="text-xs-right">{{ props.item.key }}</td>
        <td class="text-xs-right">{{ props.item.created_at | formatDate}}</td>
        <td class="text-xs-right">
          <v-btn icon class="primary--text" @click="goTo()">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon class="red--text" @click="goTo()">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        triggers: [],
        headers: [
          {text: 'Title', align: 'left', value: 'title'},
          {text: 'Key', value: 'key'},
          {text: 'Created', value: 'created_at'},
          {text: 'Actions', sortable: false}
        ]
      }
    },
    localStorage: {
      userToken: ''
    },
    mounted() {
      this.getTriggers()
    },
    methods: {
      goTo(path) {
        this.$router.push(path)
      },
      getTriggers() {
        this.$http.get('/houses/' + this.$route.params.house_id + '/devices/' + this.$route.params.device_id + '/triggers', {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.triggers = response.body
        }, response => {
          this.$emit('show-error', ['Server error'])
        })
      }
    }
  }
</script>
