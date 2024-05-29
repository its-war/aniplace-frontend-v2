<template>
  <APIComponent/>
</template>

<script>
import APIComponent from '@/components/EpisodioPage/APIComponent.vue';

export default {
  name: "EpisodioPage",
  components: { APIComponent },
  computed: {
    isFirebase(){
      return this.isFirebaseApiOrigin;
    }
  }
}
</script>