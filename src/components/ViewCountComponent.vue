<template>
  <span v-if="$props.short">{{getCount}} <v-icon icon="mdi-eye"></v-icon></span>
  <span v-if="$props.views >= 1000 && !$props.short">{{getCount}} de visualizações</span>
  <span v-if="$props.views < 1000 && !$props.short">{{getCount}} visualizações</span>
</template>

<script>
export default {
  name: "ViewCountComponent",
  props: {
    views: {
      type: Number,
      default: 0
    },
    short: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getCount(){
      let v = this.$props.views;
      if(v < 999999999999 && v > 1000000000){
        return (v / 1000000000).toFixed(1).replace('.', ',') + 'Bi';
      }

      if(v < 999999999 && v > 1000000){
        return (v / 1000000).toFixed(1).replace('.', ',') + 'Mi';
      }

      if(v < 999999 && v > 1000){
        return (v / 1000).toFixed(1).replace('.', ',') + 'K';
      }

      return v;
    }
  }
};
</script>

<style scoped>

</style>