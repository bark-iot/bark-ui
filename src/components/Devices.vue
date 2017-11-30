<template>
  <v-container>
    <v-btn flat icon color="white" @click.native.stop="showCreateDialog">
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="addDialog" persistent max-width="500px">
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="green--text darken-1" flat="flat" @click.native="addDialog = false">Cancel</v-btn>
          <v-btn class="green--text darken-1" flat="flat" @click.native="saveDevice">Save</v-btn>
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
        devices: [],
        title: '',
        dialog_header: '',
        edit_id: null,
        addDialog: false
      }
    },
    localStorage: {
      userToken: ''
    },
    mounted() {
      this.getDevices()
    },
    methods: {
      showCreateDialog() {
        this.dialog_header = 'Create new Device'
        this.edit_id = null
        this.title = ''
        this.addDialog = true
      },
      showEditDialog(device) {
        this.dialog_header = 'Edit Device'
        this.edit_id = house.id
        this.title = device.title
        this.addDialog = true
      },
      getDevices() {
        this.$http.get('/houses/' + this.$route.params.id + '/devices', {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.devices = response.body
        }, response => {
          this.$emit('show-error', ['Server error'])
        })
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
