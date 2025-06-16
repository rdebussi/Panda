<template>
  <div class="grey lighten-5" style="min-height: 100vh;">
    <v-app-bar app color="white" light flat dense style="border-bottom: 2px solid #3f55ee !important;">
      <v-btn text @click="goBack" class="text-none">
        <v-icon left>mdi-arrow-left</v-icon>
        Voltar para a lista
      </v-btn>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-md-8 pa-4">
        <v-row v-if="loading" justify="center" class="my-16">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 grey--text text--darken-1">Carregando dados do vídeo...</p>
          </v-col>
        </v-row>
        <v-alert v-else-if="error" type="error" prominent border="left" class="mx-auto" max-width="800px">
          <h3 class="text-h6">Ocorreu um erro</h3>
          <p>{{ error }}</p>
          <v-btn outlined @click="goBack">Voltar</v-btn>
        </v-alert>

        <v-row v-else-if="video" justify="center">
          
          <v-col cols="12" lg="8">
            <v-card flat outlined class="mb-6">
              <div class="player-container">
                <iframe :src="video.video_player" title="Player de Vídeo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            
            <v-card flat outlined class="mb-6">
              <v-card-text class="pa-4">
                
                <div class="d-flex align-start mb-4">
                  <div class="editable-container flex-grow-1">
                    <h2 class="text-h5 font-weight-bold text--primary view-mode-text" :class="{ 'is-invisible': isEditing }">
                      {{ video.title }}
                    </h2>
                    <v-text-field
                      :class="{ 'is-invisible': !isEditing }"
                      v-model="editableTitle"
                      label="Título do Vídeo"
                      outlined
                      dense
                      hide-details="auto"
                      counter
                      maxlength="255"
                      :rules="titleRules"
                      :error="titleError"
                      :error-messages="titleErrorMessage"
                    ></v-text-field>
                  </div>
                  <v-btn v-if="!isEditing" icon small @click="startEditing" title="Editar informações" class="ml-2">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </div>
                
                <div class="editable-container">
                    <p class="body-2 grey--text text--darken-2 view-mode-text" :class="{ 'is-invisible': isEditing }" style="white-space: pre-wrap; line-height: 1.6;">
                      {{ video.description || 'Sem descrição.' }}
                    </p>
                    <v-textarea
                      :class="{ 'is-invisible': !isEditing }"
                      v-model="editableDescription"
                      label="Descrição"
                      outlined
                      dense
                      hide-details="auto"
                      auto-grow
                      rows="3"
                      placeholder="Adicione uma descrição..."
                      counter
                      maxlength="5000"
                    ></v-textarea>
                </div>
                
                <v-card-actions class="pa-0 mt-4" :class="{ 'is-invisible': !isEditing }">
                  <v-spacer></v-spacer>
                  <v-btn text @click="cancelEditing" :disabled="isSaving" class="text-none">Cancelar</v-btn>
                  
                  <v-btn 
                    color="primary" 
                    depressed 
                    @click="saveChanges" 
                    :loading="isSaving" 
                    :disabled="!canSave || isSaving"
                    class="text-none"
                  >
                    Salvar
                  </v-btn>
                </v-card-actions>
                
              </v-card-text>
            </v-card>

            <v-card flat outlined>
              <v-list dense subheader two-line class="details-list">
                <v-subheader>Detalhes do Vídeo</v-subheader>
                <v-list-item>
                  <v-list-item-icon><v-icon color="grey darken-1">mdi-check-circle-outline</v-icon></v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-chip :color="statusColor(video.status)" small dark class="font-weight-bold">{{ formatStatus(video.status) }}</v-chip>
                    </v-list-item-title>
                    <v-list-item-subtitle>Status</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon><v-icon color="grey darken-1">mdi-calendar-plus</v-icon></v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ formatDate(video.created_at) }}</v-list-item-title>
                    <v-list-item-subtitle>Enviado em</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item>
                  <v-list-item-icon><v-icon color="grey darken-1">mdi-timer-outline</v-icon></v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ formatDuration(video.length) }}</v-list-item-title>
                    <v-list-item-subtitle>Duração</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon><v-icon color="grey darken-1">mdi-aspect-ratio</v-icon></v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ video.width }} x {{ video.height }}</v-list-item-title>
                    <v-list-item-subtitle>Dimensões</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon><v-icon color="grey darken-1">mdi-database</v-icon></v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ formatSize(video.storage_size) }}</v-list-item-title>
                    <v-list-item-subtitle>Tamanho em disco</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                <v-list-item>
                  <v-list-item-content>
                      <v-list-item-subtitle class="mb-2">Resoluções Disponíveis</v-list-item-subtitle>
                      <v-list-item-title class="d-flex flex-wrap">
                        <v-chip outlined small color="grey darken-1" class="mr-1 mb-1" v-for="res in video.available_resolutions" :key="res">{{ res }}</v-chip>
                      </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="my-2"></v-divider>
                 <v-list-item>
                    <v-list-item-icon><v-icon color="grey darken-1">mdi-pound</v-icon></v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title class="caption font-weight-bold">{{ video.id }}</v-list-item-title>
                      <v-list-item-subtitle>ID do Vídeo</v-list-item-subtitle>
                    </v-list-item-content>
                 </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000" bottom right>
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false" class="text-none">Fechar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import api from '@/services/api.js';

export default {
  name: 'VideoPlayerPage',
  data() {
    return {
      video: null,
      loading: true,
      error: null,
      isEditing: false,
      isSaving: false,
      editableTitle: '',
      editableDescription: '',
      titleRules: [
        v => !!v && v.trim().length > 0 || 'O título é obrigatório',
        v => (v && v.length <= 255) || 'O título deve ter no máximo 255 caracteres'
      ],
      snackbar: {
        show: false,
        text: '',
        color: 'success',
      },
    };
  },
  computed: {
    hasChanges() {
      if (!this.isEditing || !this.video) {
        return false;
      }
      const titleChanged = this.editableTitle !== this.video.title;
      const descriptionChanged = this.editableDescription !== (this.video.description || '');
      
      return titleChanged || descriptionChanged;
    },
    isTitleValid() {
      return this.editableTitle && this.editableTitle.trim().length > 0 && this.editableTitle.length <= 255;
    },
    titleError() {
      if (!this.isEditing) return false;
      return !this.isTitleValid;
    },
    titleErrorMessage() {
      if (!this.isEditing) return '';
      if (!this.editableTitle || this.editableTitle.trim().length === 0) {
        return 'O título é obrigatório';
      }
      if (this.editableTitle.length > 255) {
        return 'O título deve ter no máximo 255 caracteres';
      }
      return '';
    },
    canSave() {
      return this.hasChanges && this.isTitleValid;
    }
  },
  created() {
    const videoId = this.$route.params.id;
    if (videoId) {
      this.fetchVideoData(videoId);
    } else {
      this.error = "Nenhum ID de vídeo foi fornecido.";
      this.loading = false;
    }
  },
  methods: {
    async fetchVideoData(videoId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/videos/${videoId}`);
        this.video = response.data;
      } catch (err) {
        console.error("Falha ao buscar dados do vídeo:", err);
        if (err.response && err.response.status === 404) {
          this.error = "Vídeo não encontrado. Verifique o ID e tente novamente.";
        } else if (err.response && err.response.status === 401) {
          this.error = "Sessão inválida. Por favor, faça o login novamente.";
          this.$router.push('/login');
        } else {
          this.error = "Não foi possível carregar os dados do vídeo. Tente novamente mais tarde.";
        }
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.$router.push('/');
    },
    startEditing() {
      this.editableTitle = this.video.title;
      this.editableDescription = this.video.description || '';
      this.isEditing = true;
    },
    cancelEditing() {
      this.isEditing = false;
    },
    async saveChanges() {
      if (!this.isTitleValid) {
        this.showSnackbar('O título é obrigatório e não pode ser vazio.', 'error');
        return;
      }
      
      if (!this.hasChanges) {
        this.showSnackbar('Nenhuma alteração foi feita.', 'info');
        this.isEditing = false;
        return;
      }
      
      this.isSaving = true;
      const payload = {};
      const originalTitle = this.video.title;
      const newTitle = this.editableTitle.trim();
      if (newTitle !== originalTitle) {
        payload.title = newTitle;
      }

      const originalDescription = this.video.description || '';
      const newDescription = this.editableDescription;

      if (newDescription !== originalDescription) {
        payload.description = newDescription.trim() === '' ? null : newDescription;
      }
      
      try {
        const videoId = this.video.id;
        const response = await api.put(`/videos/${videoId}`, payload);
        this.video = response.data; 
        this.isEditing = false;
        this.showSnackbar('Vídeo atualizado com sucesso!', 'success');
      } catch (err) {
        console.error("Falha ao salvar alterações:", err);
        const errorMessage = err.response?.data?.message || 'Não foi possível salvar as alterações.';
        this.showSnackbar(`Erro: ${errorMessage}`, 'error');
      } finally {
        this.isSaving = false;
      }
    },
    showSnackbar(text, color = 'success') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
    },
    formatDuration(totalSeconds) {
      if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      let result = '';
      if (hours > 0) {
        result += `${String(hours).padStart(2, '0')}:`;
      }
      result += `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      return result;
    },
    formatSize(bytes) {
      if (!bytes || bytes === 0) return '0 B';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
    },
    formatStatus(status) {
      const map = { 'CONVERTED': 'Disponível', 'processing': 'Processando', 'error': 'Erro' };
      return map[status] || status;
    },
    statusColor(status) {
      const map = { 'CONVERTED': 'green', 'processing': 'orange', 'error': 'red' };
      return map[status] || 'grey';
    },
  },
};
</script>

<style scoped>
.player-container {
  position: relative;
  padding-bottom: 56.25%; 
  height: 0;
  overflow: hidden;
  background-color: #000;
  border-radius: 4px; 
}
.player-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.editable-container {
  display: grid;
  align-items: center;
}
.editable-container > * {
  grid-area: 1 / 1 / auto / auto;
  margin: 0; 
}
.is-invisible {
  visibility: hidden;
  pointer-events: none;
}
.view-mode-text {
  padding-top: 4px;
  padding-bottom: 4px;
}
.details-list >>> .v-list-item__icon {
  align-self: center !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>