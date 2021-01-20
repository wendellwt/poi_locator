<template>
  <div fullscreen class="mapContainer" style="background-color: orange">

    <vl-map  :load-tiles-while-animating="true"
             :load-tiles-while-interacting="true"
             data-projection="EPSG:4326"
ref="map"
@click="mapClicked"
           >

    <vl-view ref="view"
             :zoom.sync="zoom"
             :center.sync="center"
             :rotation.sync="rotation"
             @mounted="viewMounted"></vl-view>

      <!-- map tiles -->
      <vl-layer-tile>
        <!-- vl-source-osm></vl-source-osm -->
        <vl-source-osm :crossOrigin="null" />
        <!-- vl-source-xyz :url="stamenLayerUrl"></vl-source-xyz -->
      </vl-layer-tile>

<!-- yp features layer -->
<vl-feature v-if="featurelist_yp && featurelist_yp.length">
<vl-feature v-for="feature in featurelist_yp"
            :key="feature.properties.newkey"
            :id="feature.properties.newkey"
            :properties="feature.properties">

        <vl-geom-point :coordinates="feature.geometry.coordinates" />
        <vl-style-func :factory="myStyleFactory_yp"></vl-style-func>
</vl-feature>
</vl-feature>
<!-- // yp features layer -->

<!-- osm features layer -->
<vl-feature v-if="featurelist_osm && featurelist_osm.length"
            ref="osm_layer" >
<vl-feature v-for="feature in featurelist_osm"
            :key="feature.properties.newkey"
            :id="feature.properties.newkey"
            :properties="feature.properties">

        <!-- vl-geom-multi-line-string :coordinates="feature.geometry.coordinates" / -->
        <vl-geom-point :coordinates="feature.geometry.coordinates" />

        <vl-style-func :factory="myStyleFactory_osm"></vl-style-func>
</vl-feature>
</vl-feature>
<!-- // osm features layer -->

    <!-- interactions -->
    <vl-interaction-select @select="onSelect" @unselect="onUnselect" :features.sync="selectedFeatures"
                           :hit-tolerance="10" >

        <p>Hello Sailor!</p>
    </vl-interaction-select>

    <!--// interactions -->

    </vl-map>   <!-- // map -->

    <wt-card v-if="showpopup" v-bind="cardprops"></wt-card>

  </div>
</template>

<script>

// key error:
// Custom elements in iteration require 'v-bind:key' directives
//    (vue/valid-v-for) at src/components/AppOL.vue:30:9:
// notes on interaction:
// https://www.gitmemory.com/issue/ghettovoice/vuelayers/187/524211979

// ===================================================

// TODO: card-content from demo:
// https://github.com/ghettovoice/vuelayers-demo/blob/master/src/App.vue

import Vue from 'vue'

import { createStyle } from 'vuelayers/lib/ol-ext'
import { VectorLayer } from 'vuelayers'      // just what does this do?:
Vue.use(VectorLayer)

import { SelectInteraction } from 'vuelayers'
Vue.use(SelectInteraction)

import Icon    from 'ol/style/Icon'
import Text    from 'ol/style/Text'
import Fill    from 'ol/style/Fill'
import Stroke  from 'ol/style/Stroke'

import { transformExtent } from 'ol/proj'   // from looking at ol source

import MyCard  from './AppCard.vue'

export default {

  components: {
    'wt-card'  : MyCard
  },

    data () {
      return {

        zoom: 14,
        // center: [-77.1660000, 39.1683333],   // KGAI
        center: [-77.031414,  39.032967],   // Lester st
        rotation: 0,
        overlay: true,

        selectedFeatures: [ "hello", "sailor"],  // new tue 406pm
        //zindex: 99, //:z-index="zindex"

        // ============================ my own tiles
stamenLayerUrl: `https://stamen-tiles-{a-d}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg`,
ifrLayerUrl: `https://tiles.ilikecarrots.com/tiles/{z}/{x}/{-y}.png`,
        // ============================

        featurelist_yp: [],
        featurelist_osm: [],

        showpopup: false,
        cardprops : { mytitle    : "cname",
                      mysubtitle : "category",   // UNUSED
                      mycontents : "phone"
                    },

        extent: undefined    // may13
        }
    },

// =============================================

// saw a crs here:
// https://openlayers.org/en/latest/examples/geojson.html
//  possible vuelayers blog / trackere:
// https://www.bountysource.com/teams/vuelayers/issues?tracker_ids=56586591
// useful: https://jsfiddle.net/ghettovoice/nu13vkxe/

    mounted () {

        // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Ice Cream

        this.$root.$on('position', (gps_loc) => {

console.log('OL received location');
          this.location = gps_loc;
          this.center   = [ gps_loc.coords.longitude,
                            gps_loc.coords.latitude ];
        })

        // ----------------------------------------

        // Warning: arg is the ENTIRE (contents of the) geojson FeatureCollecion

        // ------------------------------- Ice Cream
        this.$root.$on('features_ice', (featurelist_arg) => {
console.log('OL received features: icecream');

            // special: set key to name + addr and use this for ID !!!
            featurelist_arg.forEach( val => {
                //val['properties']['newkey'] = val['properties']['name'] + ', ' + val['properties']['addr']
                val['properties']['newkey'] = val['properties']['name'] + Math.floor(Math.random() * 987654321);
            });

            this.featurelist_ice = featurelist_arg;
         })

// ------------------------ BBQ
        this.$root.$on('features_bbq', (featurelist_arg) => {
console.log('OL received features: bbq/yp[' + featurelist_arg.length + ']');

            // special: set key to name + random no.
            featurelist_arg.forEach( val => {
                val['properties']['newkey'] = val['properties']['name'] + Math.floor(Math.random() * 987654321);
            });

            this.featurelist_yp = featurelist_arg;
        })

        // ------------------------ child close
        // trap the emit from our child
        this.$on('closeMe3', () => {
            this.showpopup = false;
        })
// ------------------------------
// ------------------------ OSM
        this.$root.$on('features_osm', (featurelist_arg) => {
console.log('OL received features: osm[' + featurelist_arg.length + ']');

            // special: set key to name + addr
            featurelist_arg.forEach( val => {
                val['properties']['newkey'] = "" + Math.floor(Math.random() * 987654321);
            });

            this.featurelist_osm = featurelist_arg;
        })

        // ------------------------ child close
        // trap the emit from our child
        this.$on('closeMe3', () => {
            this.showpopup = false;
        })
// ------------------------------

    },   // end of mounted()

/************** openlayer.html ***************/

  methods: {

    // ------------------------------------ may13
    // have no idea why this is needed; just copied it from the fiddle page
    // https://jsfiddle.net/ghettovoice/nLmq5vux/

    viewMounted () {
        this.updateExtent()
    },

    // ------------------------------------ may13
    // this is what we really want to do (we think):
    // but prob. not this function
    updateExtent () {
        const olView = this.$refs.view.$view
        if (olView == null) return
        this.extent = transformExtent(olView.calculateExtent(), 'EPSG:3857', 'EPSG:4326')
    },

    // ------------------------------------ mon 445pm

    mapClicked(evt) {

const olView = this.$refs.view.$view
if (olView !== null) {
  let cur_res = olView.getResolution();
  console.log("DEBUG: cur_res:" + cur_res);
}

/***************************/

// refs:
// https://github.com/ghettovoice/vuelayers/issues/59
// gis/applications/ol5+node/myfiles/code/main.js

// ref="osm_layer" >
//lint: let osmlyr = this.$refs.osm_layer;

        // see if this click was on any feature in a vector layer
        let feature = this.$refs.map.forEachFeatureAtPixel( evt.pixel,
             function(feature) {
                return feature;
             });

        // if not, then handle it ourselves
        // (otherwise, then let 'selected' handle it)

        if (!feature) {
            console.log("fEFAP:no, send query (if idle)");

            const olView = this.$refs.view.$view
            if (olView == null) return  // ????

            // caution: OL extent array is left, bottom, right, top
            // (multi_osm.py will fix it)
            // which seems backwards/different than most others; you have been warned.

            this.extent = transformExtent(olView.calculateExtent(), 'EPSG:3857', 'EPSG:4326');

            // if NOT TRACKING, then do this:
            // Q: how to tell button state from this module???
            // A: always send to AppGps and let them figure it out
            // A: however, auto-center will be inop/messed-up
            // A: now have Armed state, so map_click may need EITHER center or extents

            //let looks_like_gps = { coords: { longitude : evt.coordinate[0],
            //                             latitude  : evt.coordinate[1] }};
            // tell AppGps about it:
            this.$root.$emit('map_click', (this.extent) );
        }
    },

    // ------------------------------------ tue 406pm

    onSelect(payload) {
        console.log("select: name:" + payload.values_.name);

        // display the <wt-card>
        this.showpopup = true;

        //var pcont = "<b>items still as keys:</b><br>";
        var pcont = "";

        // until python dust settles...
        for(var key in payload.values_) {

          switch(key) {

            // fixed (part of system), and not removed by py:
            case "name":
            case "cname":
            case "ctext":
            case "icon":
            case "geometry":
            case "tag":
            case "newkey":
                break;

            default:
              pcont = pcont + key + " : " + payload.values_[key] + "<br>";
          }
        }
        pcont = pcont + payload.values_['ctext'];

        // instantiate the <wt-card> component and pass it a
        // struct/object via 'props'
        this.cardprops = { mytitle    : payload.values_.cname,
                           mysubtitle : payload.values_.cate,    // UNUSED
                           //mycontents : payload.values_.phon <ab>
                           mycontents : pcont };
    },

    // ------------------------------------

    // this for click away from an icon
    onUnselect(payload) {
        console.log("unselect: name:" + payload.values_.name);
        this.showpopup = false;
    },

    // ------------------------------------

    // use different style factories to get different colors for yp vs. osm

     myStyleFactory_yp () {
        return feature => {
           return this.myStyleFactory(feature, "#9f6");
       }
     },
     myStyleFactory_osm () {
        return feature => {
           return this.myStyleFactory(feature, '#fc6');
       }
     },

     // the 'base' (common) style factory
     myStyleFactory (feature, myStroke) {

            // ========= get icon (and scale)

            // default values:
            let use_icon = "/images/icons8-marker-96.png";  // artful map-pin

            switch (feature.get('tag')) {

              case "bbq": use_icon = "/images/pig_48.png";            break;
              case "ice": use_icon = "/images/marker-gelato.png";     break;
              case "osm": use_icon = "/images/icons8-marker-96.png";  break;
              default   : use_icon = "/images/marker-sm.png";
            }

            //if( feature.get("icon") !== undefined) <cb>
            if ("icon" in feature.values_) {
              use_icon = "/images/" + feature.get("icon");
            }

            // --------- the image/icon identified above
            let the_icon_image = new Icon({
                //   default is 0.5, 0.5:
                //anchor       : [0.5, 48],   // prob. not at all right!
                //anchorXUnits : 'fraction',
                //anchorYUnits : 'pixels',
                //size         : [48,48],     // warning: this _crops_, what is wanted is _scaling_
                src          : use_icon     // from above
            });


let the_text_prop =  new Text({ } );

const olView = this.$refs.view.$view
if (olView !== null) {
  let cur_res = olView.getResolution();
  //console.log("cur_res:" + cur_res);

  if (cur_res < 36) {  // pretty close-in

          // (python should have tidy'ed up the name into cname)
          let text_str = (feature.get('name') !== undefined) ? feature.get('name') : feature.get('cname');
          the_text_prop =  new Text({
                    font      : '16px BellTopoSans,sans-serif',  // Sarah Bell's font:
                    fill      : new Fill({   color: 'black'  }),
                    stroke    : new Stroke({ color: myStroke, width : 5 }),
                    text         : text_str,
                    textAlign    : 'end',
                    textBaseline : 'middle',
                });
}
}

          // ========= create the style (array); Q: why is this a 'const' ???

          const styles = [

            createStyle({
                fillColor     : 'red', // unused for image
                //rokeColor   : '#fc6',
                strokeColor   : myStroke,  // unused
                strokeWidth   : 2,
                imageRadius   : 10,
                text          : the_text_prop,
                image         : the_icon_image
              })
            ]

            // ========= now return that style we just created
            return styles
        },

    // ------------------------------------
  }
}

</script>

<style lang="scss">
/* ~/gis/applications/ol5+node/myfiles/css/w-main.css */

.ol-control button{
    background-color: rgba(255, 153, 0, 0.85) !important;
}

.ol-control button:hover,
.ol-control button:focus {
    background-color: rgba(255, 204, 102, 0.85) !important;
}

.mapContainer {
    position: absolute;
    left  : 0px;
    top   : 0px;
    width : 100%;
    height: 100%;
  }

</style>
