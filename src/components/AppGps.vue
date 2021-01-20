<template>
  <div class="wtbutton">
    <button v-on:click="locClick()" v-bind:style="styleObject" >
            <span  class="mdi mdi-24px wtpadding"
                  :class="ButtonImg"></span>
    {{ButtonText}}
    </button>
  </div>
</template>
<script>

// ============== ------------------

// possible tooltip components:
// 1) https://github.com/chronotruck/vue-ctk-tooltip
// 2) https://github.com/vue-garden/vue-tooltip

// ============== ------------------

// --- switch over to materialdesignicons
// https://cdn.materialdesignicons.com/5.2.45/
// https://cdn.materialdesignicons.com/5.2.45/  ; WORKS!

// possible symbols for fetch state:
//    yellow pages: mdi-alpha-y-circle
//                  mdi-alpha-y-circle-outline
//    openstreetmap: mdi-earth
//                   mdi-earth-?????
//    -- or possibly -- : mdi-map-search
//                        mdi-map-search-outline

// ======================== button  ===========================

// consider: including color and cursor in state info

// STATE USAGE #1: just do current items, WITHOUT concern for map click
// STATE USAGE #2: use map click

const states = {

    Armed:   { btn_txt: "click to query viewport",
               color  : 'yellow',
               img    : "mdi-crosshairs" },

    Idle:    { btn_txt: "click on icon",
               color  : '#fc6',
               img    : "mdi-crosshairs" },

    Searching: { btn_txt: "searching",
               color  : '#690',
               //color  : '#fc6',
               cursor : {'cursor' : 'wait'},
               img    : "mdi-crosshairs-question" },

    Tracking: { btn_txt: "tracking",
               color   : '#690',
               //color   : '#9f6',
               img     : "mdi-crosshairs-gps" },

    //Mouse:  { btn_txt: "click somewhere",
    //           color  : 'magenta'  }
};

// -------------------------------------------------------------------

export default {

  data () {
    return {
      location        : null,
      gettingLocation : false,
      errorStr        : null,
      doingLocation   : false,
      nowIs           : "empty",
      posTime         : "empty",

      // TODO: put all of these together!!!
      gstate          : states.Armed,   // state of map and objects
      ButtonImg       : states.Armed.img,
      ButtonText      : states.Armed.btn_txt,
      styleObject: {
        color              : 'black',
        fontSize           : '16px',
        font               : '16px BellTopoSans,sans-serif',
        'background-color' : states.Armed.color
      }
   }
  },

  // =======================================
  created() {
    this.updateFreq();
  },
  // =======================================

  mounted () {

        // there was a click on the map; need to pass the event _here_ to check
        // the state, and then forward on to AppBbq if appropriate

        // should we do anything?
        //this.$root.$on('map_click', (map_loc) => <ab>
        this.$root.$on('map_click', (extents) => {

        console.log('AppGps received map_click');

        // if Armed, then mouse click centers & queries

        if (this.gstate == states.Armed) {  // include other states here!!!

          //this.location = map_loc;
          //this.center   = [ map_loc.coords.longitude,
          //                  map_loc.coords.latitude ];

          // tell AppBbq about it
          //this.$root.$emit('position_map', (map_loc) );

          // nope, let map stay put (besides, have now switched from center to extents
          this.$root.$emit('position_map', (extents) );

          // state transition
          /*******************/
          this.gstate = states.Idle;
          this.ButtonText = this.gstate.btn_txt;  // todo: incl spin cursor
          this.styleObject.color = 'white';
          this.styleObject['background-color'] = this.gstate.color;
          }
        })
  },
  // =======================================
  methods: {

    // --------------------------------------
    //  state   color    button    ;  mouse
    // Armed   (yellow)  -> Idle   ; initiates query (and switches to Idle)
    //
    // Idle    (orange)  -> Search ; passed to popup handler
    //
    // Searching (blue?) -> ??     ; passed to popup handler
    //
    // Tracking (green)  -> Armed  ; passed to popup handler

    locClick() {
//console.log("button click, while in state:", this.gstate.btn_txt);

        if (this.gstate == states.Armed) {
console.log("button click, while in Armed");
            // state transition
            this.gstate     = states.Idle;
            this.ButtonText = this.gstate.btn_txt;  // todo: incl spin cursor
            this.ButtonImg  = this.gstate.img;
            this.styleObject.color = 'white';
            this.styleObject['background-color'] = this.gstate.color;

        } else
        if (this.gstate == states.Idle) {
console.log("button click, while in Idle");
            this.doingLocation = true;

            // state transition
            this.gstate     = states.Searching;
            this.ButtonText = this.gstate.btn_txt;  // todo: incl spin cursor
            this.ButtonImg  = this.gstate.img;
            this.styleObject.color = 'yellow';
            this.styleObject['background-color'] = this.gstate.color;

        } else
        if (this.gstate == states.Searching ||
            this.gstate == states.Tracking)   {
console.log("button click, while in Search or Track");

            this.doingLocation = false;  // Q: how to DISABLE searching???

            // state transition
            this.gstate     = states.Armed;
            this.ButtonText = this.gstate.btn_txt;  // todo: incl spin cursor
            this.ButtonImg  = this.gstate.img;
            this.styleObject.color = 'red';
            this.styleObject['background-color'] = this.gstate.color;

        } else {
console.log("locClick:HELP");
        }
    },
    // --------------------------------------

    async getLocation() {

      return new Promise((resolve, reject) => {

        if(!("geolocation" in navigator)) {
          reject(new Error('Geolocation is not available.'));
        }

        navigator.geolocation.getCurrentPosition(pos => {
          resolve(pos);
        }, err => {
          reject(err);
        });
      });
    },

    // =======================================

    async locateMe() {

      this.gettingLocation = true;  // TODO: incorporate this into STATE
      try {

        this.gettingLocation = false;
        this.location = await this.getLocation();

        console.log("locateMe+getLocation");

        // Q: do we still want this???
        if (this.gstate == states.Searching ||
            this.gstate == states.Tracking)   {

                // state transition
                this.gstate     = states.Tracking;
                this.ButtonText = this.gstate.btn_txt;  // todo: incl spin cursor
                this.ButtonImg  = this.gstate.img;
                this.styleObject.color = 'yellow';   // debug/testing color
                this.styleObject['background-color'] = this.gstate.color;

                this.posTime = Date(Date.now()).toString();

                // tell AppIceCream about it:
                this.$root.$emit('position', (this.location) );

                // tell AppBbq about it:
                this.$root.$emit('position_gps', (this.location) );
            } else {
                console.log("locateMe+getLocation; BUT position not wanted");
            }

      } catch(e) {
          this.ButtonText = "error";
          this.ButtonImg  = "mdi-crosshairs-off";  // help!
          alert(e.message);  // android
          // android says: "Unknown error acquiring position"

          this.gettingLocation = false;
          this.errorStr = e.message;
      }
    },
    // =======================================
    updateFreq: function () {
      if (this.doingLocation) {
          this.locateMe();
      }
      this.nowIs = Date(Date.now()).toString();

      // 2 secs: setTimeout(this.updateFreq, 2000);
      setTimeout(this.updateFreq, 20000); // 20 seconds for DEBUGGING
    },
    // =======================================
  }
}

</script>

<style lang="scss">
/* npm install sass-loader node-sass style-loader --save-dev */
/* just a test (and it works fine): */
p { text-decoration: underline; }

.wtbutton {
    position: absolute;
    top: 10px;
    left: 50px;
    height: 90px; /* inop */
    }
.wtpadding {
    /* top right bottom left */
    /* top and bottom don't seem to work: (maybe overridden by button size?) */
    padding: 8px 8px 8px 8px;
}

</style>
