<template>
    <div>
        <!-- Display a welcome message if the user is signed in -->
        <h2 v-if="user">Welcome, {{ user.email }}</h2>
        <!-- Otherwise, show the sign-in form -->
        <div v-else>
            <input v-model="email" placeholder="Email" />
            <input v-model="password" type="password" placeholder="Password" />
            <button @click="signIn">Sign In</button>
            <button @click="signInWithGoogle">Sign In with Google</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script>
import { auth } from '@/firebase'; // Adjust the path according to your project structure
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
    data() {
        return {
            email: '',
            password: '',
            user: null,
            errorMessage: ''
        };
    },
    created() {
        // Listen for authentication state changes and update the component state
        auth.onAuthStateChanged(user => {
            this.user = user;
        });
    },
    methods: {
        signIn() {
            // Attempt to sign in using the provided email and password
            auth.signInWithEmailAndPassword(this.email, this.password)
                .then(credential => {
                    this.user = credential.user;
                    this.errorMessage = '';
                })
                .catch(error => {
                    // Handle authentication errors by updating the errorMessage state
                    this.errorMessage = error.message;
                    console.error("Authentication error:", error);
                });
        },
        signInWithGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then(result => {
                    this.user = result.user;
                    this.errorMessage = '';
                })
                .catch(error => {
                    this.errorMessage = error.message;
                    console.error("Google sign-in error:", error);
                });
        }
    },
};
</script>

<style scoped>
.error {
    color: red;
    font-size: 0.9em;
}
</style>