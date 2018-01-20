<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <form>
        <v-text-field
          label="Title"
          v-model="title"
          :error-messages="titleErrors"
          @input="$v.title.$touch()"
          @blur="$v.title.$touch()"
          required
        ></v-text-field>
        <h3 class="orange--text">Trigger</h3>
        <v-select
          v-bind:items="devices"
          item-text="title"
          item-value="id"
          v-model="trigger_device_id"
          label="Trigger Device"
          :error-messages="triggerDeviceErrors"
          @input="$v.trigger_device_id.$touch()"
          @blur="$v.trigger_device_id.$touch()"
          required>
        </v-select>
        <v-select
          v-bind:items="triggers"
          item-text="title"
          item-value="id"
          v-model="trigger_id"
          label="Trigger"
          :error-messages="triggerErrors"
          @input="$v.trigger_id.$touch()"
          @blur="$v.trigger_id.$touch()"
          required>
        </v-select>
        <h3 class="orange--text">Action</h3>
        <v-select
          v-bind:items="devices"
          item-text="title"
          item-value="id"
          v-model="action_device_id"
          label="Action Device"
          :error-messages="actionDeviceErrors"
          @input="$v.action_device_id.$touch()"
          @blur="$v.action_device_id.$touch()"
          required>
        </v-select>
        <v-select
          v-bind:items="actions"
          item-text="title"
          item-value="id"
          v-model="action_id"
          label="Action"
          :error-messages="actionErrors"
          @input="$v.action_id.$touch()"
          @blur="$v.action_id.$touch()"
          required>
        </v-select>
        <h3 class="orange--text">Mappings</h3>
        <bark-mappings
          v-model="mappings"
          :outputs="outputs"
          @add="addMapping"
          @remove="removeMapping"></bark-mappings>
        <h3 class="orange--text">Settings</h3>
        <setting-fields
          v-model="settings"
          @add="addSetting"
          @remove="removeSetting"></setting-fields>
        <v-btn @click="save" color="orange">Save Bark</v-btn>
      </form>
    </v-layout>
  </v-container>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import SettingFields from '@/components/SettingFields'
  import BarkMappings from '@/components/BarkMappings'

  export default {
    mixins: [validationMixin],
    validations: {
      title: {required},
      trigger_device_id: {required},
      action_device_id: {required},
      trigger_id: {required},
      action_id: {required},
    },
    components: {
      'setting-fields': SettingFields,
      'bark-mappings': BarkMappings,
    },
    data() {
      return {
        bark: null,
        triggers: [],
        actions: [],
        devices: [],
        trigger_device_id: null,
        action_device_id: null,
        trigger_id: null,
        action_id: null,
        title: null,
        settings: [],
        mappings: [],
        outputs: [],
        initializing: true
      }
    },
    mounted() {
      this.getDevices()
      if (this.$route.params.bark_id) {
        this.getBark()
      }
    },
    methods: {
      goTo(path) {
        this.$router.push(path)
      },
      getBark() {
        this.$http.get('/houses/' + this.$route.params.id + '/barks/' + this.$route.params.bark_id, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.bark = response.body
          this.title = response.body.title
          if (response.body.settings !== null) {
            this.settings = JSON.parse(response.body.settings)
          }
          if (response.body.mappings !== null) {
            this.mappings = JSON.parse(response.body.mappings)
          }
          this.$http.get('/houses/' + this.$route.params.id + '/triggers/' + response.body.trigger_id + '/validate', {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
            this.trigger_device_id = response.body.device_id ? response.body.device_id : 0
            this.getTriggers(this.trigger_device_id, response.body.id)
          }, response => {
            bus.$emit('show-error', ['Server error'])
          })
          this.$http.get('/houses/' + this.$route.params.id + '/actions/' + response.body.action_id + '/validate', {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
            this.action_device_id = response.body.device_id ? response.body.device_id : 0
            this.getActions(this.action_device_id, response.body.id)
          }, response => {
            bus.$emit('show-error', ['Server error'])
          })
        }, response => {
          bus.$emit('show-error', ['Server error'])
        })
      },
      getDevices() {
        this.$http.get('/houses/' + this.$route.params.id + '/devices', {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.devices = response.body
          this.devices.unshift({'id': 0, 'title': 'System'})
        }, response => {
          bus.$emit('show-error', ['Server error'])
        })
      },
      getTriggers(trigger_device_id, trigger_id = null) {
        let url = '/houses/' + this.$route.params.id + '/devices/' + trigger_device_id + '/triggers'
        if (trigger_device_id === 0) { //System
          url = '/triggers/system'
        }
        this.$http.get(url, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.triggers = response.body
          if (trigger_id) {
            this.trigger_id = trigger_id
          }
        }, response => {
          bus.$emit('show-error', ['Server error'])
        })
      },
      getActions(action_device_id, action_id = null) {
        let url = '/houses/' + this.$route.params.id + '/devices/' + action_device_id + '/actions'
        if (action_device_id === 0) { //System
          url = '/actions/system'
        }
        this.$http.get(url, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.actions = response.body
          if (action_id) {
            this.action_id = action_id
          }
        }, response => {
          bus.$emit('show-error', ['Server error'])
        })
      },
      save() {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          var formData = new FormData();
          formData.append('title', this.title);
          formData.append('trigger_id', this.trigger_id);
          formData.append('action_id', this.action_id);
          formData.append('settings', JSON.stringify(this.settings));
          formData.append('mappings', JSON.stringify(this.mappings));

          var basePath = '/houses/' + this.$route.params.id + '/barks';
          if (this.bark === null) {
            this.$http.post(basePath, formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
              this.goTo(basePath + '/' + response.body.id);
              bus.$emit('show-success-message', 'Bark saved!')
            }, response => {
              bus.$emit('show-error', response.body)
            });
          } else {
            this.$http.put(basePath + '/' + this.bark.id, formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
              this.goTo(basePath + '/' + response.body.id);
              bus.$emit('show-success-message', 'Bark saved!')
            }, response => {
              bus.$emit('show-error', response.body)
            });
          }
        }
      },
      addSetting(df) {
        this.settings.push(df)
      },
      removeSetting(index) {
        this.settings.splice(index, 1)
      },
      addMapping(df) {
        this.mappings.push(df)
      },
      removeMapping(index) {
        this.mappings.splice(index, 1)
      }
    },
    watch: {
      trigger_device_id: function (val) {
        this.trigger_id = null
        this.getTriggers(val)
      },
      action_device_id: function (val) {
        this.action_id = null
        this.getActions(val)
      },
      trigger_id: function (val) {
        for (let i = 0; i < this.triggers.length; i++) {
          if (this.triggers[i].id === val) {
            this.outputs = this.triggers[i].output
            return
          }
        }
      },
      action_id: function (val) {
        if (this.$route.params.bark_id && this.initializing) {
          this.initializing = false
          return
        }
        for (let i = 0; i < this.actions.length; i++) {
          if (this.actions[i].id === val) {
            this.mappings = []
            for (let n = 0; n < this.actions[i].input.length; n++) {
              this.mappings.push({input: this.actions[i].input[n].key, val: '', output: ''})
            }
            return
          }
        }
      }
    },
    computed: {
      titleErrors() {
        const errors = []
        if (!this.$v.title.$dirty) return errors
        !this.$v.title.required && errors.push('Title is required.')
        return errors
      },
      triggerDeviceErrors() {
        const errors = []
        if (!this.$v.trigger_device_id.$dirty) return errors
        !this.$v.trigger_device_id.required && errors.push('Trigger Device is required.')
        return errors
      },
      actionDeviceErrors() {
        const errors = []
        if (!this.$v.action_device_id.$dirty) return errors
        !this.$v.action_device_id.required && errors.push('Action Device is required.')
        return errors
      },
      triggerErrors() {
        const errors = []
        if (!this.$v.trigger_id.$dirty) return errors
        !this.$v.trigger_id.required && errors.push('Trigger is required.')
        return errors
      },
      actionErrors() {
        const errors = []
        if (!this.$v.action_id.$dirty) return errors
        !this.$v.action_id.required && errors.push('Action is required.')
        return errors
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
