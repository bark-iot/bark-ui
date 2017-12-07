<template>
  <v-container>
    <v-btn flat icon color="white" @click.native.stop="showCreateDialog">
      <v-icon>add</v-icon>
    </v-btn>
    <v-data-table
      v-bind:headers="headers"
      :items="devices"
      class="elevation-1"
      hide-actions
      dark
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.title }}</td>
        <td class="text-xs-right">{{ com_types[props.item.com_type].text }}</td>
        <td class="text-xs-right">
          <v-switch color="orange" v-model="props.item.online" @change="approve(props.item)"></v-switch>
        </td>
        <td class="text-xs-right">
          <v-switch color="orange" v-model="props.item.approved_at" @change="approve(props.item)"></v-switch>
        </td>
        <td class="text-xs-right">{{ props.item.token }}</td>
        <td class="text-xs-right">{{ props.item.created_at | formatDate}}</td>
        <td class="text-xs-right">
          <v-btn icon class="primary--text" @click="showEditDialog(props.item)">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon class="red--text" @click="deleteDevice(props.item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
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
          <v-select
            v-bind:items="com_types"
            item-text="text"
            item-value="value"
            v-model="com_type"
            label="Communication type"
            :error-messages="comTypeErrors"
            @input="$v.title.$touch()"
            @blur="$v.title.$touch()"
            required
          ></v-select>
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
      title: {required},
      com_type: {required}
    },
    data() {
      return {
        devices: [],
        title: '',
        com_type: 0,
        dialog_header: '',
        edit_id: null,
        addDialog: false,
        headers: [
          {
            text: 'Title',
            align: 'left',
            value: 'title'
          },
          {text: 'Type', value: 'com_type'},
          {text: 'Online', value: 'online'},
          {text: 'Approved', value: 'approved_at'},
          {text: 'Token', value: 'token'},
          {text: 'Created', value: 'created_at'},
          {text: 'Actions', sortable: false}
        ],
        com_types: [
          {text: 'REST Api', value: 0},
          {text: 'TCP', value: 1}
        ]
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
        this.edit_id = device.id
        this.title = device.title
        this.addDialog = true
      },
      getDevices() {
        this.$http.get('/houses/' + this.$route.params.id + '/devices', {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.devices = response.body
        }, response => {
          this.$emit('show-error', ['Server error'])
        })
      },
      saveDevice() {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          var formData = new FormData();
          formData.append('title', this.title);
          formData.append('com_type', this.com_type);

          if (this.edit_id === null) {
            this.$http.post('/houses/' + this.$route.params.id + '/devices', formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
              this.getDevices()
              this.addDialog = false
            }, response => {
              this.$emit('show-error', response.body)
            });
          } else {
            this.$http.put('/houses/' + this.$route.params.id + '/devices/' + this.edit_id, formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
              this.getDevices()
              this.addDialog = false
            }, response => {
              this.$emit('show-error', response.body)
            });
          }
        }
      },
      approve(device) {
        var formData = new FormData();
        formData.append('approved', device.approved_at);

        this.$http.post('/houses/' + this.$route.params.id + '/devices/' + device.id + '/approved', formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.getDevices()
        }, response => {
          this.$emit('show-error', response.body)
        });
      },
      deleteDevice(device) {
        let answer = confirm('Remove Device ' + device.title + '?')
        if (answer) {
          this.$http.delete('/houses/' + this.$route.params.id + '/devices/' + device.id, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
            this.getDevices()
          }, response => {
            this.$emit('show-error', ['Server error'])
          })
        }
      },
    },
    computed: {
      titleErrors() {
        const errors = []
        if (!this.$v.title.$dirty) return errors
        !this.$v.title.required && errors.push('Title is required.')
        return errors
      },
      comTypeErrors() {
        const errors = []
        if (!this.$v.com_type.$dirty) return errors
        !this.$v.com_type.required && errors.push('Communication type is required.')
        return errors
      }
    }
  }
</script>
