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
        <v-text-field
          label="Key"
          v-model="key"
          :error-messages="keyErrors"
          @input="$v.key.$touch()"
          @blur="$v.key.$touch()"
          required
        ></v-text-field>

        <v-btn @click="save" color="orange">Save Trigger</v-btn>
      </form>
    </v-layout>
  </v-container>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],
    validations: {
      title: {required},
      key: {required}
    },
    data() {
      return {
        trigger: null,
        title: null,
        key: null
      }
    },
    mounted() {
      if (this.$route.params.id) {
        this.getTrigger()
      }
    },
    methods: {
      goTo(path) {
        this.$router.push(path)
      },
      getTrigger() {
        this.$http.get('/houses/' + this.$route.params.house_id + '/devices/' + this.$route.params.device_id + '/triggers/' + this.$route.params.id, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.trigger = response.body
          this.title = response.body.title
          this.key = response.body.key
        }, response => {
          bus.$emit('show-error', ['Server error'])
        })
      },
      save() {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          var formData = new FormData();
          formData.append('title', this.title);
          formData.append('key', this.key);

          var basePath = '/houses/' + this.$route.params.house_id + '/devices/' + this.$route.params.device_id + '/triggers';
          if (this.trigger === null) {
            this.$http.post(basePath, formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
              this.goTo(basePath + '/' + response.body.id);
              bus.$emit('show-success-message', 'Trigger saved!')
            }, response => {
              bus.$emit('show-error', response.body)
            });
          } else {
            this.$http.put(basePath + '/' + this.trigger.id, formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
              this.goTo(basePath + '/' + response.body.id);
              bus.$emit('show-success-message', 'Trigger saved!')
            }, response => {
              bus.$emit('show-error', response.body)
            });
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
      keyErrors() {
        const errors = []
        if (!this.$v.key.$dirty) return errors
        !this.$v.key.required && errors.push('Key is required')
        return errors
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
