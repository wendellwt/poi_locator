<template>
  <v-container :fullscreen="true" :style="wtFullScreen">
    <v-app id="myvapp" :fullscreen="true" >

      <app-ol></app-ol>
      <app-bbq></app-bbq>
      <!-- Q: put this last so button will be on top? A: yes! -->
      <app-gps></app-gps>

    </v-app>
  </v-container>
</template>

<script>

import AppGps  from "./components/AppGps.vue";
import AppBbq  from "./components/AppBbq.vue";
import AppOL   from "./components/AppOL.vue";

export default {
  name: 'app',
  components: {
    'app-gps' : AppGps,
    'app-bbq' : AppBbq,
    'app-ol'  : AppOL
  },

  data () {
    return {
        location  : null,

// didn't get this to work:
wtFullScreen: {
    padding: '0',
    'max-width': '3555px',
    'background-color': 'red',
},

   }
  }
}

</script>

<style lang="scss">
/* attempt at mobile full-screen (before vuetify) */

html, body, .map {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 600px;
        font-family: 'BellTopoSans', Fallback, sans-serif;
}

section {
        margin: 0;
        padding: 0;
        width: 100%;
        height:  600px;
}

.section {
        margin: 0;
        padding: 0;
        width: 100%;
        height:  600px;
}

container {
        margin: 0;
        padding: 0;
        width: 100%;
        height:  600px;
    max-width: 3888px;
}

/* this is the one that is getting overridden: */
.container {
        margin: 0;
        padding: 0;
        width: 100%;
        height:  600px;
    max-width: 3777px;
}

/* Sarah Bell's fonts */

@font-face {
    font-family: BellTopoSans;
    src: url("../fonts/BellTopoSans.otf") format("opentype");
}
</style>
