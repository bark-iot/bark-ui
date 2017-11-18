<template>
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

    <v-btn @click="submit">Login</v-btn>
    <v-btn @click="clear">clear</v-btn>
  </form>
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
        password: '',
        email: '',
        checkbox: false
      }
    },
    methods: {
      submit () {
        this.$v.$touch()
      },
      clear () {
        this.$v.$reset()
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
