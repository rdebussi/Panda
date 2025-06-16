<template>
  <div>
    <Sidebar v-model="drawer" />

    <v-app-bar app color="white" style="border-bottom: 2px solid #3f55ee !important;" light flat dense>
      <v-app-bar-nav-icon class="d-lg-none" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-subtitle-1 font-weight-medium">
        Seja bem-vindo(a) ao Dashboard da Panda Vídeo!
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text small @click="logout" class="mr-6 text-none">
        <v-icon left>mdi-logout</v-icon>
        Sair
      </v-btn>
    </v-app-bar>

    <v-main class="grey lighten-4">
      <router-view
        @auth-error="logout"
        @view-details="handleViewDetails"
      />
    </v-main>
  </div>
</template>

<script>
import Sidebar from '@/components/SidebarDash.vue';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      drawer: true, 
    };
  },
  methods: {
    handleViewDetails(videoId) {
      this.$router.push({ name: 'Video', params: { id: videoId }});
    },
    logout() {
      localStorage.removeItem('jwt_token');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
</style>