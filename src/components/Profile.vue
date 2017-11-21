<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <form>
        <v-text-field
          label="Username"
          v-model="username"
        ></v-text-field>
        <v-text-field
          label="E-mail (readonly)"
          v-model="email"
          readonly
        ></v-text-field>
        <v-text-field
          label="Password"
          v-model="password"
          type="password"
          :error-messages="passwordErrors"
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
          required
        ></v-text-field>

        <v-btn @click="submit">Update profile</v-btn>
        <v-btn @click="clear">clear</v-btn>
      </form>
    </v-layout>
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, minLength, email } from 'vuelidate/lib/validators'

  export default {
    mixins: [validationMixin],
    validations: {
      password: { minLength: minLength(8) }
    },
    data () {
      return {
        username: '',
        password: '',
        email: ''
      }
    },
    localStorage: {
      userToken: ''
    },
    mounted () {
      var userToken = this.$localStorage.get('userToken')
      if (userToken != 'undefined' && userToken != '') {
        this.$http.get('/users/by_token', {headers: {'Authorization': 'Bearer ' + userToken}}).then(response => {
          this.username = response.body.username
          this.email = response.body.email
        }, response => {
          this.showError(['Please re-login!'])
        });
      }
    },
    methods: {
      submit () {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          var formData = new FormData();
          formData.append('username', this.username);
          formData.append('password', this.password);

          this.$http.post('/users/update', formData, {headers: {'Authorization': 'Bearer ' + this.$localStorage.get('userToken')}}).then(response => {
            this.$emit('show-success-message', 'Profile updated!')
          }, response => {
            this.$emit('show-error', response.body)
          });
        }
      },
      clear () {
        this.$v.$reset()
        this.username = ''
        this.password = ''
      }
    },
    computed: {
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.minLength && errors.push('Password must be at least 8 characters long')
        return errors
      }
    }
  }
</script>
