<template>
  <v-container fluid class="pa-md-6 pa-sm-4 pa-2 grey lighten-5">
    <v-card flat outlined class="pa-4 rounded-lg">
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col cols="12" md="6" class="d-flex align-center overflow-hidden">
          <v-breadcrumbs :items="breadcrumbItems" class="pa-0 breadcrumb-container">
            <template #item="{ item }">
              <v-breadcrumbs-item
                :disabled="item.disabled"
                :class="item.class"
                class="text-h5 font-weight-bold"
                @click="item.action ? item.action() : null"
              >
                <span class="d-inline-block text-truncate" style="max-width: 200px;">
                  {{ item.text }}
                </span>
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <div class="search-container">
            <v-text-field
              v-model="searchQuery"
              :placeholder="searchPlaceholder"
              :loading="isSearching"
              prepend-inner-icon="mdi-magnify"
              filled
              rounded
              dense
              clearable
              hide-details
              background-color="grey lighten-4"
              loader-height="2"
              class="custom-search-field"
              @input="handleSearchInput"
              @click:clear="clearSearch"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>

      <v-alert
        v-if="errorMessage"
        type="error"
        prominent
        icon="mdi-alert-circle-outline"
        dismissible
        class="mb-6 rounded-lg"
      >
        {{ errorMessage }}
      </v-alert>

      <div class="main-content-container">
        <v-row v-if="initialLoading || itemsLoading" justify="center" align="center" class="loading-state">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
            <p class="mt-6 text-subtitle-1 grey--text text--darken-2">
              {{ loadingMessage }}
            </p>
          </v-col>
        </v-row>
        
        <div v-else class="content-area">
          <div v-if="isContentEmpty" class="empty-state-container">
            <div class="empty-state-content">
              <v-icon size="100" color="grey lighten-2">{{ emptyStateIcon }}</v-icon>
              <h3 class="text-h5 grey--text text--darken-1 mt-6">{{ emptyStateTitle }}</h3>
              <p class="body-1 grey--text mt-2">{{ emptyStateSubtitle }}</p>
            </div>
          </div>
          
          <div v-else class="items-content">
            <div v-if="displayedFolders.length > 0">
              <v-subheader class="pl-0 text-subtitle-1 font-weight-medium grey--text text--darken-1">Pastas</v-subheader>
              <v-row>
                <v-col v-for="folder in displayedFolders" :key="folder.id" cols="12" sm="6" md="4" lg="3">
                  <div class="folder-item pa-3 rounded-lg d-flex align-center" @click="enterFolder(folder)">
                    <v-icon size="32" class="mr-4" color="blue-grey">mdi-folder-outline</v-icon>
                    <div class="flex-grow-1 overflow-hidden">
                      <div class="font-weight-bold text--primary text-truncate">{{ folder.name }}</div>
                      <div class="text-caption grey--text">{{ folder.videos_count }} vídeo(s)</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-row v-if="hasMoreFoldersToShow" class="mt-4">
                <v-col cols="12" class="text-right">
                  <v-btn text color="primary" @click="toggleShowAllFolders" class="text-none">
                    {{ showAllFolders ? 'Ver menos pastas' : 'Ver todas as pastas' }}
                    <v-icon right>{{ showAllFolders ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <v-divider v-if="displayedFolders.length > 0 && videos.length > 0" class="my-6"></v-divider>

            <div v-if="videos.length > 0">
              <v-subheader class="pl-0 text-subtitle-1 font-weight-medium grey--text text--darken-1">Vídeos</v-subheader>
              
              <div v-if="videosLoading" class="videos-loading-container">
                <v-row justify="center" align="center" class="py-8">
                  <v-col cols="12" class="text-center">
                    <v-progress-circular indeterminate color="primary" size="48" width="4"></v-progress-circular>
                    <p class="mt-4 text-subtitle-2 grey--text text--darken-2">Carregando vídeos...</p>
                  </v-col>
                </v-row>
              </div>
              
              <v-row v-else>
                <v-col v-for="video in videos" :key="video.id" cols="12" sm="6" md="4" lg="3" class="d-flex">
                  <VideoCard :video="video" @card-click="viewVideoDetails(video.id)" />
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
      </div>

      <v-row v-if="totalPages > 1 && !initialLoading && !itemsLoading" justify="center" class="mt-6">
        <v-col cols="auto">
          <v-pagination v-model="page" :length="totalPages" :total-visible="7" :disabled="isSearching || videosLoading"></v-pagination>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/services/api.js';
import VideoCard from './VideoCard.vue';

const SEARCH_DEBOUNCE_MS = 750;
const FOLDERS_INITIAL_LIMIT = 8;

export default {
  name: 'VideoList',
  components: {
    VideoCard,
  },
  data() {
    return {
      videos: [],
      folders: [],
      initialLoading: true,
      itemsLoading: false,
      videosLoading: false, 
      isSearching: false,
      errorMessage: '',
      searchQuery: '',
      searchTimeout: null,
      page: 1,
      totalPages: 1,
      limit: 8,
      navigationStack: [],
      showAllFolders: false,
      folderCache: new Map(),
      contentCache: new Map(),
      videoPageCache: new Map(),
    };
  },
  computed: {
    currentFolderId() {
      return this.navigationStack.length > 0
        ? this.navigationStack[this.navigationStack.length - 1].id
        : null;
    },
    breadcrumbItems() {
      const homeCrumb = {
        text: 'Seus Arquivos',
        disabled: false, 
        action: () => this.navigateToHome(),
        class: (this.navigationStack.length > 0 || this.searchQuery) 
              ? 'primary--text cursor-pointer' 
              : 'grey--text text--darken-2 cursor-pointer',
      };
      const folderCrumbs = this.navigationStack.map((folder, index) => ({
        text: folder.name,
        disabled: index === this.navigationStack.length - 1,
        action: () => this.navigateTo(index),
        class: index < this.navigationStack.length - 1 ? 'primary--text cursor-pointer' : 'grey--text text--darken-2',
      }));
      return [homeCrumb, ...folderCrumbs];
    },
    sortedFolders() {
      return Array.isArray(this.folders) 
        ? [...this.folders].sort((a, b) => b.videos_count - a.videos_count)
        : [];
    },
    displayedFolders() {
      if (this.showAllFolders) {
        return this.sortedFolders;
      }
      return this.sortedFolders.slice(0, FOLDERS_INITIAL_LIMIT);
    },
    hasMoreFoldersToShow() {
        return !this.searchQuery && !this.isSearching && this.sortedFolders.length > FOLDERS_INITIAL_LIMIT;
    },
    searchPlaceholder() {
      if (this.currentFolderId) {
        const currentFolder = this.navigationStack[this.navigationStack.length - 1];
        const folderName = currentFolder.name.length > 20
            ? `${currentFolder.name.substring(0, 18)}...`
            : currentFolder.name;
        return `Buscar em "${folderName}"...`;
      }
      return 'Buscar vídeos e pastas...';
    },
    isContentEmpty() {
      return !this.isSearching && !this.itemsLoading && !this.initialLoading && !this.videosLoading && this.videos.length === 0 && this.displayedFolders.length === 0;
    },
    loadingMessage() {
      if (this.initialLoading) return 'Buscando seus arquivos...';
      if (this.itemsLoading) return 'Carregando...';
      return 'Buscando seus arquivos...';
    },
    emptyStateIcon() {
        return this.searchQuery ? 'mdi-magnify-close' : 'mdi-folder-zip-outline';
    },
    emptyStateTitle() {
      if (this.searchQuery) return 'Nenhum resultado encontrado';
      if (this.currentFolderId) return 'Esta pasta está vazia';
      return 'Nenhum arquivo na sua conta';
    },
    emptyStateSubtitle() {
      if (this.searchQuery) return 'Tente uma busca com termos diferentes.';
      if (this.currentFolderId) return 'Esta pasta não contém vídeos ou sub-pastas.';
      return 'Quando você fizer o upload, seus vídeos e pastas aparecerão aqui.';
    },
  },
  watch: {
    page(newPage, oldPage) {
      if (newPage !== oldPage) {
        this.fetchData(true);
      }
    },
  },
  created() {
    this.navigateTo(null); 
  },
  methods: {
    handleSearchInput() {
      this.clearSearchTimeout();      
      if (!this.searchQuery || this.searchQuery.trim() === '') {
        this.clearSearch();
        return;
      }      
      this.isSearching = true;      
      this.searchTimeout = setTimeout(() => {
        this.page = 1;
        this.fetchData();
      }, SEARCH_DEBOUNCE_MS);
    },
    clearSearch() {
      this.clearSearchTimeout();      
      this.searchQuery = '';
      this.isSearching = false;
      this.page = 1;
      this.showAllFolders = false;
      this.fetchData();
    },
    clearSearchTimeout() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      }
    },
    toggleShowAllFolders() {
      this.showAllFolders = !this.showAllFolders;
    },
    viewVideoDetails(videoId) {
      this.$emit('view-details', videoId);
    },
    navigateTo(index) {
        this.clearSearchTimeout();
        if (index === null) {
            this.navigationStack = [];
        } else {
            this.navigationStack = this.navigationStack.slice(0, index + 1);
        }
        this.page = 1;
        this.searchQuery = '';
        this.isSearching = false;
        this.showAllFolders = false;
        
        this.itemsLoading = true;
        this.videosLoading = false;
        this.videos = [];
        this.folders = [];
        this.videoPageCache.clear();
        this.fetchData();
    },
    async enterFolder(folder) {
        this.clearSearchTimeout();
        
        if (this.searchQuery && folder.parent_folder_id) {
            const isParentInStack = this.navigationStack.some(f => f.id === folder.parent_folder_id);
            if (!isParentInStack) {
                try {
                    const pathToFolder = await this._buildPathToFolder(folder);
                    this.navigationStack = pathToFolder;
                } catch (error) {
                    this.handleApiError(error, 'Não foi possível reconstruir o caminho da pasta.');
                    return;
                }
            }
        }
        
        this.navigationStack.push(folder);
        this.page = 1;
        this.searchQuery = '';
        this.isSearching = false;
        
        this.itemsLoading = true;
        this.videosLoading = false;
        this.videos = [];
        this.folders = [];
        this.videoPageCache.clear(); 
        this.fetchData();
    },
    
    async fetchData(isPagination = false) {
      const cacheKey = this.currentFolderId || 'root';
      const videoCacheKey = `${cacheKey}-page-${this.page}`;
      const isRootAndNotSearching = !this.currentFolderId && !this.searchQuery;

      if (isPagination && !this.searchQuery && this.videoPageCache.has(videoCacheKey)) {
        const cachedData = this.videoPageCache.get(videoCacheKey);
        this.videos = cachedData.videos;
        this.totalPages = cachedData.totalPages;
        return;
      }
      if (!isPagination && !this.searchQuery && this.contentCache.has(cacheKey)) {
        const cachedData = this.contentCache.get(cacheKey);
        this.folders = cachedData.folders;
        this.videos = cachedData.videos;
        this.totalPages = cachedData.totalPages;
        this.itemsLoading = false;
        this.initialLoading = false;
        return;
      }

      if (isPagination) {
        this.videosLoading = true;
      } else {
        this.itemsLoading = true;
      }

      this.errorMessage = '';
      const foldersEndpoint = isRootAndNotSearching ? '/folders/root' : '/folders';
      const videosEndpoint = isRootAndNotSearching ? '/videos?root_folder=1' : '/videos';
      const folderParams = {};
      if (this.searchQuery) folderParams.name = this.searchQuery;
      if (this.currentFolderId) folderParams.parent_folder_id = this.currentFolderId;
      
      const videoParams = { page: this.page, limit: this.limit };
      if (this.searchQuery) videoParams.title = this.searchQuery;
      if (this.currentFolderId) videoParams.folder_id = this.currentFolderId;

      try {
        const promiseFolders = isPagination
          ? Promise.resolve(null) 
          : api.get(foldersEndpoint, { params: folderParams });
        const promiseVideos = api.get(videosEndpoint, { params: videoParams });
        const [foldersResponse, videosResponse] = await Promise.all([promiseFolders, promiseVideos]);

        if (!isPagination && foldersResponse) {
          if (foldersResponse.data && Array.isArray(foldersResponse.data.folders)) {
            this.folders = foldersResponse.data.folders;
          } else if (Array.isArray(foldersResponse.data)) {
            this.folders = foldersResponse.data;
          } else {
            this.folders = [];
          }
        }

        if (videosResponse.data && Array.isArray(videosResponse.data.videos)) {
          this.videos = videosResponse.data.videos;
          this.totalPages = videosResponse.data.pages || 1;
        } else {
          this.videos = Array.isArray(videosResponse.data) ? videosResponse.data : [];
          this.totalPages = 1;
        }
        
        if (!this.searchQuery) {
          this.videoPageCache.set(videoCacheKey, {
            videos: [...this.videos],
            totalPages: this.totalPages,
          });

          if (!isPagination && this.page === 1) {
            this.contentCache.set(cacheKey, {
              folders: [...this.folders],
              videos: [...this.videos],
              totalPages: this.totalPages,
            });
          }
        }
      } catch (error) {
        this.handleApiError(error);
      } finally {
        this.initialLoading = false;
        this.isSearching = false;
        this.itemsLoading = false;
        this.videosLoading = false;
      }
    },
    processVideosResponse(videosResponse) {
      if (videosResponse.data && Array.isArray(videosResponse.data.videos)) {
        this.videos = videosResponse.data.videos;
        this.totalPages = videosResponse.data.pages || 1;
      } else if (Array.isArray(videosResponse.data)) {
        this.videos = videosResponse.data;
        this.totalPages = 1;
      } else {
        this.videos = [];
        this.totalPages = 1;
      }
    },

    saveToCache(cacheKey, videoCacheKey, isPagination) {
      this.videoPageCache.set(videoCacheKey, {
        videos: [...this.videos], 
        totalPages: this.totalPages,
      });

      if (!isPagination && this.page === 1) {
        this.contentCache.set(cacheKey, {
          folders: [...this.folders], 
          videos: [...this.videos],
          totalPages: this.totalPages,
        });
      }
    },
    
    async _buildPathToFolder(targetFolder) {
        const path = [];
        let current = targetFolder;
        while (current && current.parent_folder_id) {
            let parentFolder = this.folderCache.get(current.parent_folder_id);
            if (!parentFolder) {
                const response = await api.get(`/folders/${current.parent_folder_id}`);
                parentFolder = response.data;
                this.folderCache.set(parentFolder.id, parentFolder);
            }
            path.unshift(parentFolder);
            current = parentFolder;
        }
        return path;
    },
    handleApiError(error, customMessage) {
      console.error('Erro na API:', error);
      this.videos = [];
      this.folders = [];
      this.totalPages = 1;
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;
        
        if (status === 401) {
          this.errorMessage = 'Sessão expirada. Faça login novamente.';
        } else if (status === 403) {
          this.errorMessage = 'Você não tem permissão para acessar este conteúdo.';
        } else if (status === 404) {
          this.errorMessage = 'Conteúdo não encontrado.';
        } else if (status >= 500) {
          this.errorMessage = 'Erro no servidor. Tente novamente em alguns instantes.';
        } else {
          this.errorMessage = message || customMessage || 'Ocorreu um erro inesperado.';
        }
      } else if (error.request) {
        this.errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else {
        this.errorMessage = customMessage || 'Ocorreu um erro inesperado.';
      }
    },
    navigateToHome() {
      this.clearSearchTimeout();
      this.navigationStack = [];
      this.page = 1;
      this.searchQuery = '';
      this.isSearching = false;
      this.showAllFolders = false;
      
      this.itemsLoading = true;
      this.videosLoading = false;
      this.videos = [];
      this.folders = [];
      this.videoPageCache.clear();
      this.fetchData();
    }
  },  
  beforeDestroy() {
    this.clearSearchTimeout();
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.folder-item {
  border: 1px solid #e0e0e0;
  background-color: #fafafa;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
  cursor: pointer;
}
.folder-item:hover {
  transform: translateY(-4px);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.09);
  background-color: rgba(63, 85, 238, 0.09);
}
.breadcrumb-container {
  flex-shrink: 1;
  min-width: 0;
}
.main-content-container {
  min-height: 78vh;
  position: relative;
}
.loading-state, .empty-state-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-area {
  min-height: 78vh;
  position: relative;
}
.empty-state-content {
  text-align: center;
  max-width: 400px;
  padding: 20px;
}
.videos-loading-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.items-content {
  position: relative;
  min-height: 100%;
}

.search-container {
  position: relative;
}

.custom-search-field {
  overflow: hidden;
}

.custom-search-field ::v-deep .v-input__slot {
  overflow: hidden;
}

.custom-search-field ::v-deep .v-progress-linear {
  border-radius: 0 0 28px 28px;
  overflow: hidden;
}

.custom-search-field ::v-deep .v-text-field__details {
  overflow: hidden;
}

.custom-search-field ::v-deep .v-input__control {
  overflow: hidden;
  border-radius: 28px;
}
</style>