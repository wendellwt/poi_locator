<template>
<div class="wtcard">

  <v-card
    class="mx-auto"
    max-width="344"
    color="#e6FFe6"
    outlined
    >
        <v-card-title primary-title>{{ mytitle }}</v-card-title>
        <v-card-text>
          <!-- v-html allows use of html tags in mycontents -->
          <div v-html="mycontents"></div>
        </v-card-text>

    <v-card-actions>
      <v-btn text @click="$parent.$emit('closeMe3')" >Close</v-btn>
    </v-card-actions>
  </v-card>
</div>
</template>

<script>

// TODO: use different (native?) card layout with close AND ROUTE buttons
// ref looks ok: https://www.codementor.io/@mtt/5-ways-to-change-component-colors-and-styles-using-vuetify-13oz2o0pt0

export default {
  name: 'wt-card',

  props: {
        mytitle    : String,
        mysubtitle : String,   // UNUSED
        mycontents : String,
  },

  data () {
    return {}
  },
}

  //color:      #cfc;
</script>

<style lang="scss">
/* npm install sass-loader node-sass style-loader --save-dev */

.wtcard {
    position: absolute;
    top  : 30px;
    left : 40px;
}

.v-card__title {
  font-style: italic;
  color:      black;
}
.v-card__text {
  color: black;
}

</style>

