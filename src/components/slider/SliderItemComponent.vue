<template>
  <v-slide-group-item>
    <div class="item">
      <div class="item-numero">
        <span>Episódio {{$props.numero}}</span>
      </div>
      <img :src="$props.foto" :alt="$props.nome" style="height: 100%"/>
      <div class="item-nome">
        <h4>{{$props.nome}}</h4>
      </div>
    </div>
  </v-slide-group-item>
</template>

<script>
export default {
  name: "SliderItemComponent",
  props: {
    id: {
      type: String,
      required: true
    },
    nome: {
      type: String,
      required: true
    },
    foto: {
      type: String,
      required: true
    },
    numero: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.item {
  margin: 9px 13px;
  height: 150px;
  position: relative;
  border-radius: 10px;
  border: solid 3px transparent;
  overflow: hidden;
  cursor: pointer;
  transition: 300ms;
}

.item:hover {
  border: solid 3px white;
  transform: scale(1.05);
}

.item-numero {
  position: absolute;
  width: 100%;
  top: 0;
  right: 0;
  background: linear-gradient(to bottom, #0e0e12, rgb(14 14 18 / 0));
  padding-left: 10px;
}

.item-nome {
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, #0e0e12, rgb(14 14 18 / 0));
  width: 100%;
  padding-left: 10px;
}
</style>