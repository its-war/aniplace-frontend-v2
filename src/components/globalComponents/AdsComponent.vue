<template>
  <iframe v-if="!isMobile && isActive && !$props.vertical"
          style="border: none; background-color: #212121"
          width="728px"
          height="90px"
          :src="$urlBase + '/api/ads/banner-728x90'"
          sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
  <iframe v-if="isMobile && isActive && !$props.vertical"
          style="border: none; background-color: #212121"
          width="320px"
          height="50px"
          :src="$urlBase + '/api/ads/banner-320x50'"
          sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
  <iframe v-if="!isMobile && isActive && $props.vertical"
          style="border: none; background-color: #212121"
          width="300px"
          height="250px"
          :src="$urlBase + '/api/ads/banner-300x250'"
          sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
</template>

<script>
export default {
  name: "AdsComponent",
  computed: {
    isMobile(){
      return this.$store.main.isMobile;
    },
    isActive(){
      if(this.$store.main.isLogged){
        let rank = this.$store.user.getRanking;
        return this.$store.main.getAdsActive && rank < 5;
      }
      return this.$store.main.getAdsActive;
    }
  },
  props: {
    vertical: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
  }
};
</script>

<style scoped>

</style>