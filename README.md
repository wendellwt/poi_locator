
# GPS locator with POI retrieval

Initial concept: make a full-screen mobile app that would continuously
receive GPS position and query either OSM or 'local' yellow pages
and display nearby 'interesting' points as you drive along the road.

Site: https://go.ilikecarrots.com/

Intersting POIs include:
* cheese shops
* icecream shops
* barbecue restaurants
* pho restaurants
* roadside attractions
* miniature libraries (public bookcase)

Software modules used:

* vuejs
* vuelayers (of course!)
* vuetify (as an attempt to make mobile-phone full-screen)
* axios (for url retrieval)

Note: this app uses `vuetify`, later projects used `buefy`,
but I'm not sure why I chose either.

### compilation:

for development:
````
    make
````

to make a (much) smaller app.js (i.e., production):
````
    make prod
````
Note: it installs to my CherryPy server directory on ilikecarrots.com.

## operation

When app starts up:

State selector shows 'click to query viewport'.

* Click anywhere on the map and it will send a query to the source host.

This sends a query to ilikecarrots.com for either
an OSM or YellowPages query.
It returns geojson with properties.

If the symbol is clicked on, information is displayed in a Card.

* Click on the State selector button to start gps acquisiton.

Once position is acquired it will repeatedly query for POIs
near the GPS position every 4 minutes.

* Click on the State selector again to go back to idle state.

## messages

Here are the messages sent between components:

message      | sender<br/>`this.$root.$emit` | receiver<br/>`this.$root.$on` | purpose
------       | ------         | -------  | -------
position     | AppGps         | AppOL    | gps position received/updated; position map
features_bbq | Features class | AppOL    | geojson features received; display icons
features_osm | Features class | AppOL    | geojson features received; display icons
closeMe3     | AppCard        | AppOL    | 'close' on Card popup clicked on
map_click    | AppOL          | AppGps   | someowhere on map clicked; retrieve POIs at this location
position_gps | AppGps         | AppBbq   | fetch POI data around this position
position_map | AppGps         | AppBbq   | fetch POI data in displayed bounding box

## state

The main operation is a state machine.
The only way I figured out is to (repeatedly) click on the (one) button/indicator.

It is currently somewhat lame, but here is how it works:

state     | button color | button click causes     | map click causes  | activity
-----     | -----        | -----                   | -----             | ----
armed     | yellow       | search for gps position | query for POI<br/>at this location |
idle      | orange-ish   | nothing                 | ???              | query to backend outstanding
searching | green-ish    | acquiring gps position  | ???              |
tracking  | green-ish    | stop tracking           | ???              | tracking gps position,<br/>map icons update automatically

## backend

Sample backend queries are:

Query OSM for selected POIs `/get_osm_bb?bbox=...`:
<br/>
https://go.ilikecarrots.com/get_osm_bb?bbox=-77.07531639715556,38.98457999774084,-76.97566696783429,39.00772718720543

Find zip code of location, lookup in YellowPages.com for selected items,
attempt to filer for 'good' ones, and format as appropriate `/get_yp_bb?topic=yp&bbox=...`:
<br/>
https://go.ilikecarrots.com/get_yp_bb?topic=yp&bbox=-77.07531639715556,38.98457999774084,-76.97566696783429,39.00772718720543

