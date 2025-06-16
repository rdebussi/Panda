<template>
    <v-container fill-height fluid class="text-center">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-icon size="100" color="grey lighten-1">mdi-hammer-wrench</v-icon>
          <h1 class="text-h4 mt-6 grey--text text--darken-1">
            Funcionalidade em Desenvolvimento
          </h1>
          <p class="body-1 mt-4 grey--text text--darken-1">
            Estamos trabalhando para trazer esta nova feature para você em breve.
            <br>
            Enquanto isso, explore as outras áreas da plataforma!
          </p>
          <v-btn
            color="primary"
            class="mt-6"
            to="/"
          >
            <v-icon left>mdi-arrow-left</v-icon>
            Voltar para Vídeos
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
</template>
  
<script>
  export default {
    name: 'NewFeature',
  };
</script>
  
<style scoped>
  .container {
    height: calc(100vh - 64px); 
  }
</style>