<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    const css = `
      .v-application,
      .v-application .display-4, .v-application .display-3, .v-application .display-2, .v-application .display-1,
      .v-application .headline, .v-application .title, .v-application .subtitle-1, .v-application .subtitle-2,
      .v-application .body-1, .v-application .body-2, .v-application .caption, .v-application .overline,
      .v-application .text-h1, .v-application .text-h2, .v-application .text-h3, .v-application .text-h4, .v-application .text-h5, .v-application .text-h6,
      .v-application .text-subtitle-1, .v-application .text-subtitle-2, .v-application .text-body-1, .v-application .text-body-2,
      .v-application .text-button, .v-application .text-caption, .v-application .text-overline,
      .v-btn,
      .v-text-field__slot .v-label, .v-text-field__slot input, .v-textarea__slot textarea, .v-list-item__title
      {
        font-family: 'Inter', sans-serif !important;
      }
    `;
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.id = 'font-override-style';
    styleElement.appendChild(document.createTextNode(css));
    document.head.appendChild(styleElement);
  }
};
</script>
<style>

</style>