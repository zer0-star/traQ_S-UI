<template>
  <div
    :class="$style.timeSlider"
    :aria-disabled="disabled"
    :data-show-background-on-hover="showBackgroundOnHover"
  >
    <a-slider
      :value="roundedCurrentTime"
      :disabled="disabled"
      :min="0"
      :max="roundedDuration"
      tooltip="none"
      @change-value="changeTime"
      @click.prevent
    />
  </div>
</template>

<script lang="ts" setup>
import ASlider from '/@/components/UI/ASlider.vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    currentTime: number
    duration: number
    showBackgroundOnHover?: boolean
  }>(),
  {
    showBackgroundOnHover: false
  }
)

const emit = defineEmits<{
  (e: 'update:currentTime', _val: number): void
}>()

const roundedCurrentTime = computed(() => Math.floor(props.currentTime))
const roundedDuration = computed(() => Math.floor(props.duration))
const disabled = computed(() => props.duration === 0)

const changeTime = (time: number) => {
  emit('update:currentTime', time)
}
</script>

<style lang="scss" module>
.timeSlider {
  &[data-show-background-on-hover='true']:not([aria-disabled='true']):hover {
    background: rgba(32, 33, 36, 0.06);
  }
  &[aria-disabled='true'] {
    opacity: 0.5;
  }

  :global(.vue-slider-dot-handle) {
    opacity: 1;
    transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  &:not(:hover) :global(.vue-slider-dot-handle) {
    opacity: 0;
  }

  :global {
    $dotBgColor: #1e1e1e;

    $bgColor: #b7b9ba;
    $themeColor: #585859;

    @import 'vue-slider-component/lib/theme/default.scss';
  }
}
</style>
