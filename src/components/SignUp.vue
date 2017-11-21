<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <form>
        <v-text-field
          label="Username"
          v-model="username"
        ></v-text-field>
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
        <v-checkbox
          label="Agree with Terms?"
          v-model="checkbox"
          :error-messages="checkboxErrors"
          @change="$v.checkbox.$touch()"
          @blur="$v.checkbox.$touch()"
          required
        ></v-checkbox>

        <v-btn @click="submit">Sign Up</v-btn>
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
      email: { required, email },
      checkbox: { required }
    },
    data () {
      return {
        username: '',
        password: '',
        email: '',
        checkbox: false
      }
    },
    methods: {
      submit () {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          var formData = new FormData();
          formData.append('username', this.username);
          formData.append('email', this.email);
          formData.append('password', this.password);

          this.$http.post('/users', formData).then(response => {
            this.$router.push('/login')
            this.$emit('show-success-message', 'Thank you for joining! Now you can login!')
          }, response => {
            this.$emit('show-error', response.body)
          });
        }
      },
      clear () {
        this.$v.$reset()
        this.username = ''
        this.password = ''
        this.email = ''
        this.checkbox = false
      }
    },
    computed: {
      checkboxErrors () {
        const errors = []
        if (!this.$v.checkbox.$dirty) return errors
        !this.$v.checkbox.required && errors.push('You must agree to continue!')
        return errors
      },
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
