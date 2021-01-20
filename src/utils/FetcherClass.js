
import axios from 'axios';

// for vuedc: force to my own server/backend
var ilc_domain = "https://go.ilikecarrots.com";

const poistates = {
        Idle  : 'idle',
        Sent  : 'sent',
        Rcvd  : 'rcvd',
        Error : 'error'
    }

function seconds_since_epoch(){ return Math.floor( Date.now() / 1000 ); }

var this_often = 60;  // num seconds between queries

export class Fetcher {

  constructor( tag, topic, icon) {
    this.tag   = tag;
    this.topic = topic;
    this.icon  = icon;

    // 1586902983 (Epoch) == Tue Apr 14 2020 18:23:03 GMT-0400 (Eastern Daylight Time)
    this.data  = 'none';
    this.stime = 'none';
    this.ntime = 1586902983;
    this.state = poistates.Idle;
  }

/*********** ********/

// private (we hope):

help_send_query(url, xthis) {     // # Q: why isn't 'this' global???
                            // # why do we need to pass it around all the time?

    let ilc_url = ilc_domain + url;  // for vuedc: force to my own server/backend

    console.log("sending query:" + ilc_url);

    this.state = poistates.Sent;

    // Set the cursor ASAP to "Wait"
    document.body.style.cursor='wait';

    axios.get(ilc_url)
        .then(response => {
          // JSON responses are automatically parsed.
          this.data = response;

          // schedule next query in 60 + rand(1..20) seconds:
          // DOESN'T really matter: granularity of gps clock
          // removes the randomness :-(

          this.ntime = seconds_since_epoch() + this_often +
                                 Math.floor(Math.random() * 20) + 1;

          this.stime = Date(Date.now()).toString();
          this.state = poistates.Rcvd;

          console.log("response received: " + this.tag + "; make markers");

          // Set the cursor to normal
          document.body.style.cursor='default';


          // issue: to make it easier for OL to draw, include tag here
          // (which will be used to select icon)

          var send_to_ol = response.data.features;
          send_to_ol.forEach( val => { val.properties['tag'] = this.tag });

          // tell AppOL about it:
          xthis.$root.$emit('features_' + this.tag, send_to_ol);
        })
    .catch(e => {
          this.errorStr = e;
          this.state = poistates.Error;
          console.log("error received");

          // Set the cursor to normal
          document.body.style.cursor='default';
        })
    }

// =======================================
// send url query if:
//         * we have a location
//         * stime is not null
//         * there is no query outstanding
//         * we haven't done a query in X
//           X = [ one minute since last,
//                 4 miles since last (todo) ]
// =======================================

  getPOIdata(gps_pos, delay, xthis ) {

    // ---------- see if we really need/want to do a query

    // hokey, but it may work: delay = 'timer' if working off of gps timer position,
    //                               = 'now' if manual (and need to query _now_)

    if (delay == "timer") {
        if (this.ntime > seconds_since_epoch()) {
            console.log("no query: too soon since last query:" + this.tag);
            return 0;
        }

        if (this.state == poistates.Sent) {
            console.log("no query: one is already outstanding:" + this.tag);
            return 0;
        }
    }

    // ---------- yes, let's query

    console.log("forming query:" + this.tag);

    let url = "placeholder";

    if (this.topic == "osm") {   // ---- osm
        url = "/get_osm?";
    } else {                     // ---- yellowpages
        url = "/get_yp?" + "topic=" + this.topic + '&';
    }

    // and do this for both:
    url = url + "lng=" + gps_pos.coords.longitude + "&lat=" + gps_pos.coords.latitude;

    let results = this.help_send_query(url, xthis);
    return results;
  }

  // =======================================

  getPOIdata_ext(extents, delay, xthis ) {

    console.log("forming bbox query:" + this.tag);

    let url = "placeholder";

      /*********** osm query ********/
    if (this.topic == "osm") {
        url = "/get_osm_bb?";
    } else {
      /*********** yp query ********/
        url = "/get_yp_bb?" + "topic=" + this.topic + '&';
    }

      // and do this for both:
    url = url + "bbox=" + extents[0] + ',' + extents[1] + ',' + extents[2] + ',' + extents[3];

    let results = this.help_send_query(url, xthis);
    return results;
  }

}
