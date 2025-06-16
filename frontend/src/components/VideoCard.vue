<template>
    <v-card
      class="video-card d-flex flex-column flex-grow-1 rounded-lg"
      outlined
      hover
      @click="$emit('card-click')"
    >
      <v-img :src="video.thumbnail" height="240px" class="align-end white--text" gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,0.7)">
        <div class="play-icon-overlay">
          <v-icon color="white" size="64">mdi-play-circle-outline</v-icon>
        </div>
        <div class="info-badges">
          <v-chip v-if="video.length" small dark color="rgba(0, 0, 0, 0.75)" class="mr-1">
            <v-icon left small>mdi-clock-outline</v-icon> {{ formatDuration(video.length) }}
          </v-chip>
          <v-chip v-if="video.available_resolutions && video.available_resolutions.length" small dark color="rgba(0, 0, 0, 0.75)">
            <v-icon left small>mdi-high-definition</v-icon> {{ video.available_resolutions[video.available_resolutions.length - 1] }}
          </v-chip>
        </div>
        <v-card-title class="text-subtitle-1 font-weight-bold pb-2">{{ video.title }}</v-card-title>
      </v-img>
      <v-card-text class="pt-3 px-3 flex-grow-1">
        <v-chip :color="statusColor(video.status)" small dark class="mb-2 mr-2 font-weight-bold">
          <v-icon left small>{{ statusIcon(video.status) }}</v-icon> {{ formatStatus(video.status) }}
        </v-chip>
        <v-chip v-if="video.storage_size" small dark color="blue-grey" class="mb-2 font-weight-bold">
          <v-icon left small>mdi-database-outline</v-icon> {{ formatSize(video.storage_size) }}
        </v-chip>
        <p class="text-body-2 grey--text text--darken-3 description-text pt-1">
          {{ video.description || 'Este vídeo não possui descrição.' }}
        </p>
      </v-card-text>
      <v-card-actions class="px-3 pt-0 pb-3">
        <span class="text-caption grey--text">{{ formatDate(video.created_at) }}</span>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" @click.stop="$emit('card-click')">
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
</template>
  
<script>
  export default {
    name: 'VideoCard',
    props: {
      video: {
        type: Object,
        required: true,
      },
    },
    methods: {
      formatStatus(status) {
        const map = { 'CONVERTED': 'Processado', 'finished': 'Finalizado', 'processing': 'Processando', 'error': 'Erro' };
        return map[status] || status;
      },
      statusColor(status) {
        const map = { 'CONVERTED': 'green darken-1', 'processing': 'orange darken-1', 'error': 'red darken-1' };
        return map[status] || 'grey';
      },
      statusIcon(status) {
        const map = { 'CONVERTED': 'mdi-check-circle', 'processing': 'mdi-sync', 'error': 'mdi-alert-circle' };
        return map[status] || 'mdi-help-circle';
      },
      formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
      },
      formatDuration(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      },
      formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
      }
    }
  }
</script>
  
<style scoped>
  .video-card {
      transition: transform .2s ease-in-out, box-shadow .2s ease-in-out !important;
  }

  .video-card:hover {
    transform: translateY(-4px);
    box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.12) !important;
  }
  .play-icon-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .video-card:hover .play-icon-overlay {
    opacity: 1;
  }
  .info-badges {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
  }
  .description-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>