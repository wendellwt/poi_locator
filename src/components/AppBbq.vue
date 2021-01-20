<template>
  <div>
  </div>
</template>
<script>

import { Fetcher } from "../utils/FetcherClass.js";

export default {
  name: 'app',

  data () {
      return {

      yp_item : new Fetcher('bbq',    // used to tell OL what icon to draw
                            'yp',    // 'osm' for openstreetmap query,
                                      // else yellowpages topic
                            'pig.png'),  // unused, was attempt to be OL icon,
                            // now s.b. detected from GeoJSON.feature.properties

      osm_item : new Fetcher('osm', 'osm', 'marker-sm.png')
   }
  },

  // =======================================
  mounted () {

      // we received parent position from gps, call all of the classes

      this.$root.$on('position_gps', (gps_pos) => {

          this.yp_item.getPOIdata(gps_pos, "timer", this );
          this.osm_item.getPOIdata(gps_pos, "timer", this );
      }),

      // we received parent position manually, call all of the classes
      this.$root.$on('position_map', (extent) => {

          this.yp_item.getPOIdata_ext(extent, "now", this );
          this.osm_item.getPOIdata_ext(extent, "now", this );
      })
  },
}

</script>

