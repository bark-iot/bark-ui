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
        <h3 class="orange--text">Data Fields</h3>
        <data-fields
          v-model="input"
          @add="addDataField"
          @remove="removeDataField"></data-fields>
        <v-btn @click="save" color="orange">Save Action</v-btn>
      </form>
    </v-layout>
  </v-container>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import DataFields from '@/components/DataFields'

  export default {
    mixins: [validationMixin],
    validations: {
      title: {required},
      key: {required}
    },
    components: {
      'data-fields': DataFields
    },
    data() {
      return {
        action: null,
        title: null,
        key: null,
        input: []
      }
    },
    mounted() {
      if (this.$route.params.id) {
        this.getAction()
      }
    },
    methods: {
      goTo(path) {
        this.$router.push(path)
      },
      getAction() {
        this.$http.get('/houses/' + this.$route.params.house_id + '/devices/' + this.$route.params.device_id + '/actions/' + this.$route.params.id, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
          this.action = response.body
          this.title = response.body.title
          this.key = response.body.key
          if (response.body.input !== null) {
            this.input = response.body.input
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
          formData.append('key', this.key);
          formData.append('input', JSON.stringify(this.input));

          var basePath = '/houses/' + this.$route.params.house_id + '/devices/' + this.$route.params.device_id + '/actions';
          if (this.action === null) {
            this.$http.post(basePath, formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
              this.goTo(basePath + '/' + response.body.id);
              bus.$emit('show-success-message', 'Action saved!')
            }, response => {
              bus.$emit('show-error', response.body)
            });
          } else {
            this.$http.put(basePath + '/' + this.action.id, formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
              this.goTo(basePath + '/' + response.body.id);
              bus.$emit('show-success-message', 'Action saved!')
            }, response => {
              bus.$emit('show-error', response.body)
            });
          }
        }
      },
      addDataField(df) {
        this.input.push(df)
      },
      removeDataField(index) {
        this.input.splice(index, 1)
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
