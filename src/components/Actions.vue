<template>
  <v-container>
    <v-btn flat icon color="white" @click.native.stop="goTo('/houses/' + $route.params.house_id + '/devices/' + $route.params.device_id + '/actions/add')">
      <v-icon>add</v-icon>
    </v-btn>
    <v-data-table
      v-bind:headers="headers"
      :items="actions"
      class="elevation-1"
      hide-actions
      dark
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.title }}</td>
        <td class="text-xs-right">{{ props.item.key }}</td>
        <td class="text-xs-right">{{ props.item.created_at | formatDate}}</td>
        <td class="text-xs-right">
          <v-btn icon class="primary--text" @click="goTo('/houses/' + $route.params.house_id + '/devices/' + $route.params.device_id + '/actions/' + props.item.id)">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon class="red--text" @click="deleteAction(props.item)">
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
        actions: [],
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
      this.getActions()
    },
    methods: {
      goTo(path) {
        this.$router.push(path)
      },
      getActions() {
        this.$http.get('/houses/' + this.$route.params.house_id + '/devices/' + this.$route.params.device_id + '/actions', {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.actions = response.body
        }, response => {
          bus.$emit('show-error', ['Server error'])
        })
      },
      deleteAction(action) {
        let answer = confirm('Remove Action ' + action.title + '?')
        if (answer) {
          this.$http.delete('/houses/' + this.$route.params.house_id + '/devices/' + this.$route.params.device_id + '/actions/' + action.id, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
            this.getActions()
          }, response => {
            bus.$emit('show-error', ['Server error'])
          })
        }
      }
    }
  }
</script>
