<template>
  <sidebar-content-container
    :title="title"
    :clickable="!isOpen"
    title-clickable
    :large-padding="largePadding"
    @toggle="toggle"
  >
    <template #header-control>
      <a-icon
        width="20"
        height="20"
        name="rounded-triangle"
        :class="$style.icon"
        :data-is-open="$boolAttr(isOpen)"
      />
    </template>
    <template #default>
      <slide-down :is-open="isOpen">
        <slot />
      </slide-down>
    </template>
  </sidebar-content-container>
</template>

<script lang="ts" setup>
import SidebarContentContainer from '/@/components/Main/MainView/PrimaryViewSidebar/SidebarContentContainer.vue'
import AIcon from '/@/components/UI/AIcon.vue'
import SlideDown from '/@/components/UI/SlideDown.vue'
import useToggle from '/@/composables/utils/useToggle'

withDefaults(
  defineProps<{
    title?: string
    largePadding?: boolean
  }>(),
  {
    largePadding: false
  }
)

const { value: isOpen, toggle } = useToggle(false)
</script>

<style lang="scss" module>
.icon {
  transform: rotate(0deg);
  &[data-is-open] {
    transform: rotate(180deg);
  }
  transition: 0.5s;
}
</style>
