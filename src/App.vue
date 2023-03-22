<script setup lang="ts">
import Selects from "./components/Selects.vue"
import options from "./components/options.json"
import { ref } from "vue"
const selected = ref()
</script>

<template>
  <div>
    <Selects :options="options" uniqueField="uuid" labelField="fullName">
      <template #optgroup>
        <div class="group-label">Group Label from slot</div>
      </template>
      <template #option="{ option, isSelected, toggleSelect }">
        <div
          :class="{ option: true, selected: isSelected(option) }"
          @click="toggleSelect(option)"
        >
          {{ option.fullName }}
          {{ option.age }}
        </div>
      </template>
    </Selects>
  </div>
</template>

<style scoped>
.option {
  margin: 0.1rem;
  padding: 0.3rem;
  background-color: rgb(219, 219, 219);
}
.option.selected {
  background-color: rgb(149, 143, 234);
}
</style>
