<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <form>
        <v-text-field
          label="E-mail"
          v-model="email"
          :error-messages="emailErrors"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
          required
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

        <v-btn @click="submit">Login</v-btn>
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
      password: { required, minLength: minLength(8) },
      email: { required, email }
    },
    data () {
      return {
        password: '',
        email: ''
      }
    },
    methods: {
      submit () {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          var formData = new FormData();
          formData.append('email', this.email);
          formData.append('password', this.password);

          this.$http.post('/users/by_email_password', formData).then(response => {
            this.$emit('login', response.body.token)
          }, response => {
            this.$emit('show-error', ['Invalid Email or Password'])
          });
        }
      },
      clear () {
        this.$v.$reset()
        this.password = ''
        this.email = ''
      }
    },
    computed: {
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.minLength && errors.push('Password must be at least 8 characters long')
        !this.$v.password.required && errors.push('Password is required.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      }
    }
  }
</script>
