<template>
  <div class="login-signup-container">
    <div class="form-card">
      <h2 class="form-title">{{ isLogin ? 'Entrar' : 'Cadastrar' }}</h2>
      
      <v-alert v-if="signupSuccessMessage" type="success" text class="mb-4">
        {{ signupSuccessMessage }}
      </v-alert>
      <v-alert v-if="errorMessage" type="error" text class="mb-4">
        {{ errorMessage }}
      </v-alert>

      <v-form ref="form" v-model="isFormValid" @submit.prevent="isLogin ? handleLogin() : handleSignup()">
        
        <v-text-field
          v-model="email"
          label="Email"
          placeholder="exemplo@email.com"
          outlined
          dense
          required
          :rules="emailRules"
        ></v-text-field>

        <v-text-field
          v-if="!isLogin"
          v-model="username"
          label="Nome de Usuário"
          placeholder="meuusuario123"
          outlined
          dense
          required
          :rules="usernameRules"
          class="mt-4"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Senha"
          placeholder="••••••••"
          outlined
          dense
          required
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          :rules="passwordRules"
          class="mt-4"
        ></v-text-field>

        <v-btn 
          type="submit" 
          color="primary"
          block 
          large
          depressed
          :disabled="!isFormValid" 
          class="mt-6 submit-button"
        >
          {{ isLogin ? 'Entrar' : 'Criar Conta' }}
        </v-btn>
      </v-form>

      <p class="toggle-text">
        {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
        <a href="#" @click.prevent="toggleForm" class="toggle-link">
          {{ isLogin ? 'Cadastre-se' : 'Faça login' }}
        </a>
      </p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api.js';

export default {
  name: 'LoginSignup',
  data() {
    return {
      isLogin: true,
      isFormValid: false,
      showPassword: false,
      email: '',
      username: '',
      password: '',
      signupSuccessMessage: '',
      errorMessage: '',
      
      emailRules: [
        v => !!v || 'Email é obrigatório',
        v => /.+@.+\..+/.test(v) || 'Formato de email inválido',
      ],
      usernameRules: [
        v => !!v || 'Nome de usuário é obrigatório',
        v => (v && v.length >= 3) || 'O nome de usuário deve ter pelo menos 3 caracteres',
      ],
      passwordRules: [
        v => !!v || 'Senha é obrigatória',
        v => this.isLogin || (v && v.length >= 6) || 'A senha deve ter pelo menos 6 caracteres',
      ],
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.clearAllFields();
      this.$nextTick(() => {
        this.$refs.form.resetValidation();
      });
    },
    clearAllFields() {
      this.email = '';
      this.username = '';
      this.password = '';
    },
    
    async handleSignup() {
      if (!this.isFormValid) return;
      
      this.signupSuccessMessage = '';
      this.errorMessage = '';

      try {
        const payload = {
          email: this.email,
          username: this.username,
          password: this.password
        };
        const response = await api.post('/users', payload);        
        const successMsg = response.data.message || 'Conta criada com sucesso!';
        this.clearAllFields();        
        this.isLogin = true;
        this.signupSuccessMessage = successMsg;        
        this.$nextTick(() => {
            this.$refs.form.resetValidation();
        });

      } catch (error) {
        console.error('Erro no cadastro:', error);
        this.errorMessage = error.response?.data?.error || 'Não foi possível criar a conta.';
      }
    },
    
    async handleLogin() {
      if (!this.isFormValid) return;

      this.errorMessage = '';
      this.signupSuccessMessage = '';

      try {
        const payload = {
          email: this.email,
          password: this.password
        };
        const response = await api.post('/login', payload);        
        localStorage.setItem('jwt_token', response.data.token);
        this.$router.push('/'); 
        
      } catch (error) {
        console.error('Erro no login:', error);
        this.errorMessage = error.response?.data?.error || 'Credenciais inválidas ou erro de conexão.';
      }
    }
  }
};
</script>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f0f2f5; 
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; 
  width: 100%;
}
.form-card {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%; 
}
.form-title {
  color: #3f55ee;
  margin-bottom: 25px;
  font-size: 2.2em;
  font-weight: 600;
}

.submit-button {
  font-weight: 600;
  text-transform: none; 
}

.toggle-text {
  margin-top: 25px;
  color: #666;
  font-size: 0.95em;
}
.toggle-link {
  color: #3f55ee;
  text-decoration: none;
  font-weight: 600;
}
</style>
