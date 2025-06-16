<template>
  <v-navigation-drawer
    v-model="drawerModel"
    app
    light
    color="white"
    width="210"
  >
    <v-list-item class="px-2 py-4 sidebar-header-item">
      <v-list-item-avatar color="white">
        <img src="@/assets/pandaICO.png"/>
      </v-list-item-avatar>
      <v-list-item-title class="primary--text font-weight-bold">Panda Vídeo</v-list-item-title>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav color="white">
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.route"
        link
        active-class="active-sidebar-item"
        exact
        class="sidebar-nav-item-precise"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <template v-slot:append>
      <div class="pa-2 text-caption grey--text text--darken-1 text-center">
        Panda Video - Desafio Técnico v1.0
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        items: [
          { title: 'Vídeos', icon: 'mdi-video', route: '/' },
          { title: 'Lives', icon: 'mdi-play-circle', route: '/lives' },
          { title: 'Analytics', icon: 'mdi-chart-line', route: '/analytics' },
          { title: 'Configurações', icon: 'mdi-cog', route: '/settings' },
        ],
      };
    },
    computed: {
      drawerModel: {
        get() {
          return this.value;
        },
        set(newValue) {
          this.$emit('input', newValue);
        },
      },
    },
  };
</script>

<style scoped>
  .sidebar-header-item.v-list-item {
    display: flex;
    align-items: center;
    padding-left: 16px !important;
  }

  .sidebar-header-item .v-list-item__avatar {
    margin-right: 16px !important;
  }

  .sidebar-header-item .v-list-item__title {
    flex-grow: 1;
    text-align: left;
  }

  .sidebar-nav-item-precise.v-list-item {
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 0 16px !important;
    margin: 8px 0; 
  }

  .sidebar-nav-item-precise .v-list-item__icon {
    align-self: center !important;
    margin: 0 16px 0 0 !important;
    min-width: 24px !important;
  }

  .sidebar-nav-item-precise .v-list-item__content {
    flex-grow: 1;
    overflow: hidden;
    padding: 0 !important;
  }

  .sidebar-nav-item-precise .v-list-item__title {
    text-align: left !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .active-sidebar-item {
    color: #3f55ee !important;
    border-radius: 8px;
  }
</style>