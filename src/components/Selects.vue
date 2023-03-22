<script setup lang="ts">
import { computed, PropType, ref, reactive } from "vue"
import { useHash } from "./hash"
const props = defineProps({
  options: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  valueField: {
    type: String,
    default: "",
  },
  labelField: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [Array, Object, String, Number, Boolean],
    default: () => [],
  },
})

const emit = defineEmits(["update:modelValue"])

const getId = useHash()

const optionId = (option: any) => {
  if (props.valueField) {
    return option[props.valueField]
  }
  return getId(option)
}

const isOpen = ref(false)
const isGrouped = ref(false)
const searchValue = ref("")

const computedOptions = computed(() => {
  if (!searchValue.value) {
    return props.options
  }
  return props.options.filter((item) =>
    JSON.stringify(item).includes(searchValue.value)
  )
})

const toggle = () => {
  isOpen.value = !isOpen.value
}

const getLabel = (item: any) => {
  if (typeof props.labelField === "string") {
    return item[props.labelField]
  } else {
    return item
  }
}

const mapValue = (option: any) => {
  if (props.valueField) {
    return option[props.valueField]
  }
  return option
}

const isEqualObject = (obj1: any, obj2: any): boolean => {
  // Check if both objects are null or undefined
  if (obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined) {
    return obj1 === obj2
  }

  // Check if both objects are of the same type
  if (typeof obj1 !== typeof obj2) {
    return false
  }

  // Check if both objects are primitive types
  if (
    typeof obj1 === "number" ||
    typeof obj1 === "string" ||
    typeof obj1 === "boolean"
  ) {
    return obj1 === obj2
  }

  // Check if both objects have the same number of properties
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)
  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }

  // Check if all properties in obj1 are also in obj2, and if their values are deeply equal
  for (const key of obj1Keys) {
    if (!obj2.hasOwnProperty(key) || !isEqualObject(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

const isSelected = (option: any) => {
  const value = mapValue(option)
  if (Array.isArray(props.modelValue)) {
    return !!props.modelValue.find((v) => isEqualObject(v, value))
  } else {
    if (typeof value !== "object") {
      return props.modelValue === value
    }
    return isEqualObject(value, props.modelValue)
  }
}

const toggleSelect = (option: any) => {
  const value = mapValue(option)
  if (Array.isArray(props.modelValue)) {
    if (isSelected(option)) {
      const newVal = props.modelValue.filter((v) => !isEqualObject(v, value))
      emit("update:modelValue", newVal)
    } else {
      emit("update:modelValue", [...props.modelValue, value])
    }
  } else {
    if (props.modelValue !== value) {
      emit("update:modelValue", value)
    }
  }
}
</script>
<template>
  <div class="selects" tabindex="1" role="combobox" @click="toggle">
    <div class="container">
      <div class="content">
        <div class="chip">Foo</div>
      </div>
    </div>
    <div class="dropdown" v-show="isOpen" @click.stop>
      <div class="search">
        <input type="text" placeholder="Filter" v-model="searchValue" />
      </div>
      <div class="opt-group" role="group" v-if="isGrouped">
        <slot name="optgroup">
          <div class="group-label">Group Label</div>
        </slot>
        <slot
          name="option"
          v-for="item in computedOptions"
          :option="item"
          :key="item.uuid"
        >
          <div class="option" role="option">{{ getLabel(item) }}</div>
        </slot>
      </div>
      <div v-else>
        <slot
          name="option"
          v-for="item in computedOptions"
          :option="item"
          :isSelected="isSelected"
          :toggleSelect="toggleSelect"
          :key="optionId(item)"
        >
          <div class="option" role="option">Non grouped{{ getLabel(item) }}</div>
        </slot>
      </div>
    </div>
  </div>
</template>
<style>
.selects {
  position: relative;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
}
.container {
  height: 2em;
  display: flex;
  align-items: center;
  border: 1px solid black;
}
.chip {
  display: inline-block;
  padding: 0.1em;
  border-radius: 0.5em;
  border: 1px solid gray;
}
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid black;
  box-sizing: border-box;
  max-height: 50vh;
  overflow-x: auto;
}
.group-label {
  color: gray;
}
</style>
