<template>
  <v-container>
    <v-toolbar color="orange">
      <v-toolbar-title class="white--text">Houses</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.native.stop="showCreateDialog">
        <v-icon>add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout row wrap>
      <v-flex xs12 sm3 ma-2
              v-for="house in houses"
              :key="house.id">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{ house.title }}</h3>
              <div>{{ house.address }}</div>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat color="orange">
              <v-icon>settings</v-icon>
            </v-btn>
            <v-btn flat color="orange" @click="showEditDialog(house)">Edit</v-btn>
            <v-btn flat color="red" @click="deleteHouse(house)">Remove</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="add_dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">{{ dialog_header }}</v-card-title>
        <v-card-text>
          <v-text-field
            name="title"
            label="Title"
            id="title"
            v-model="title"
            :error-messages="titleErrors"
            @input="$v.title.$touch()"
            @blur="$v.title.$touch()"
            required
          ></v-text-field>
          <v-text-field
            name="address"
            label="Address"
            id="address"
            v-model="address"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="green--text darken-1" flat="flat" @click.native="add_dialog = false">Cancel</v-btn>
          <v-btn class="green--text darken-1" flat="flat" @click.native="saveHouse">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],
    validations: {
      title: {required}
    },
    data() {
      return {
        houses: [],
        title: '',
        address: '',
        dialog_header: '',
        edit_id: null,
        add_dialog: false
      }
    },
    localStorage: {
      userToken: ''
    },
    mounted() {
      this.getHouses()
    },
    methods: {
      goTo(path) {
        this.$router.push(path)
      },
      showCreateDialog() {
        this.dialog_header = 'Create new House'
        this.edit_id = null
        this.title = ''
        this.address = ''
        this.add_dialog = true
      },
      showEditDialog(house) {
        this.dialog_header = 'Edit House'
        this.edit_id = house.id
        this.title = house.title
        this.address = house.address
        this.add_dialog = true
      },
      getHouses() {
        this.$http.get('/houses', {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.houses = response.body
        }, response => {
          this.$emit('show-error', ['Server error'])
        })
      },
      saveHouse() {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          var formData = new FormData();
          formData.append('title', this.title);
          formData.append('address', this.address);

          if (this.edit_id === null) {
            this.$http.post('/houses', formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
              this.getHouses()
              this.add_dialog = false
            }, response => {
              this.$emit('show-error', response.body)
            });
          } else {
            this.$http.put('/houses/' + this.edit_id, formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
              this.getHouses()
              this.add_dialog = false
            }, response => {
              this.$emit('show-error', response.body)
            });
          }
        }
      },
      deleteHouse(house) {
        let answer = confirm('Remove House ' + house.title + '?')
        if (answer) {
          this.$http.delete('/houses/' + house.id, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
            this.getHouses()
          }, response => {
            this.$emit('show-error', ['Server error'])
          })
        }
      }
    },
    computed: {
      titleErrors() {
        const errors = []
        if (!this.$v.title.$dirty) return errors
        !this.$v.title.required && errors.push('Title is required.')
        return errors
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
