<template>
  <FirebaseComponent v-if="isFirebase"/>
  <APIComponent v-else/>
</template>

<script>
import APIComponent from '@/components/EpisodioPage/APIComponent.vue';
import FirebaseComponent from '@/components/EpisodioPage/FirebaseComponent.vue'

export default {
  name: "EpisodioPage",
  components: { FirebaseComponent, APIComponent },
  computed: {
    isFirebase(){
      return this.isFirebaseApiOrigin;
    }
  }
}
</script>