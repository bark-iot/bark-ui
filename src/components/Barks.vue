<template>
  <v-container>
    <v-btn flat icon color="white" @click.native.stop="goTo('/houses/' + $route.params.id + '/barks/add')">
      <v-icon>add</v-icon>
    </v-btn>
    <v-data-table
      v-bind:headers="headers"
      :items="barks"
      class="elevation-1"
      hide-actions
      dark
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.title }}</td>
        <td class="text-xs-right">{{ props.item.created_at | formatDate}}</td>
        <td class="text-xs-right">
          <v-btn icon class="primary--text" @click="goTo('/houses/' + $route.params.id + '/barks/' + props.item.id)">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon class="red--text" @click="deleteBark(props.item)">
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
        barks: [],
        headers: [
          {text: 'Title', align: 'left', value: 'title'},
          {text: 'Created', value: 'created_at'},
          {text: 'Actions', sortable: false}
        ]
      }
    },
    localStorage: {
      userToken: ''
    },
    mounted() {
      this.getBarks()
    },
    methods: {
      goTo(path) {
        this.$router.push(path)
      },
      getBarks() {
        this.$http.get('/houses/' + this.$route.params.id + '/barks', {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.barks = response.body
        }, response => {
          bus.$emit('show-error', ['Server error'])
        })
      },
      deleteBark(bark) {
        let answer = confirm('Remove Bark ' + bark.title + '?')
        if (answer) {
          this.$http.delete('/houses/' + this.$route.params.id + '/barks/' + bark.id, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
            this.getBarks()
          }, response => {
            bus.$emit('show-error', ['Server error'])
          })
        }
      }
    }
  }
</script>
