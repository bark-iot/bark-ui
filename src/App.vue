<template>
  <v-app dark>
    <v-navigation-drawer
      clipped
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <template v-for="item in menuItems">
          <v-list-tile :key="item.title" @click="goTo(item.path)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Bark IoT</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat v-if="loggedIn" @click="handleLogout">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <router-view
            @show-error="showError"
            @show-success-message="showSuccessMessage"
            @login="handleLogin"
          ></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <v-spacer></v-spacer>
      <div>© {{ new Date().getFullYear() }}</div>
    </v-footer>
    <v-snackbar error top multi-line
                :timeout="6000"
                v-model="errorSnackbar"
    >
      <p v-for="(error, index) in errors">{{ error }} </p>
      <v-btn dark flat @click.native="errorSnackbar = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar success top multi-line
                :timeout="6000"
                v-model="successSnackbar"
    >
      <p>{{ successMessage }} </p>
      <v-btn dark flat @click.native="successSnackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: false,
        anonymMenuItems: [
          { title: 'Home', icon: 'info_outline', path: '/' },
          { title: 'Login', icon: 'arrow_forward', path: '/login' },
          { title: 'Sign up', icon: 'add', path: '/sign-up' }
        ],
        userMenuItems: [
          { title: 'Profile', icon: 'info_outline', path: '/profile' },
          { title: 'Houses', icon: 'info_outline', path: '/houses' }
        ],
        loggedIn: false,
        errors: [],
        successMessage: '',
        errorSnackbar: false,
        successSnackbar: false,
        loggedInUser: null
      }
    },
    localStorage: {
      userToken: ''
    },
    mounted () {
      var userToken = this.$localStorage.get('userToken')
      if (userToken != 'undefined' && userToken != '') {
        this.handleLogin(userToken)
      }
    },
    methods: {
      goTo (path) {
        this.$router.push(path)
      },
      showError (errors) {
        this.errors = errors
        this.errorSnackbar = true
      },
      showSuccessMessage (msg) {
        this.successMessage = msg
        this.successSnackbar = true
      },
      handleLogin (token) {
        this.$http.get('/users/by_token', {headers: {'Authorization': 'Bearer ' + token}}).then(response => {
          this.loggedIn = true
          this.loggedInUser = response.body
          this.$localStorage.set('userToken', token)
          this.showSuccessMessage('You are logged in!')
          this.$router.push('/profile')
        }, response => {
          this.showError(['Please re-login!'])
        });
      },
      handleLogout () {
        this.loggedIn = false
        this.loggedInUser = null
        this.$localStorage.remove('userToken')
        this.showSuccessMessage('You are logged out!')
        this.$router.push('/')
      }
    },
    computed: {
      menuItems: function () {
        return this.loggedIn ? this.userMenuItems : this.anonymMenuItems;
      }
    }
  }

</script>
