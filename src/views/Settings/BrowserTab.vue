<template>
  <section>
    <notification-state :class="$style.element" />
    <citation-notification :class="$style.element" />
    <open-mode
      v-model:open-mode="state.openMode"
      v-model:open-channel-name="state.openChannelName"
      :class="$style.element"
    />
    <send-key
      v-model:sendWithModifierKey="state.sendWithModifierKey"
      v-model:modifierKey="state.modifierKey"
      :class="$style.element"
    />
    <eco-mode v-model="state.ecoMode" :class="$style.element" />
    <cache-manager :class="$style.element" />
  </section>
</template>

<script lang="ts" setup>
import NotificationState from '/@/components/Settings/BrowserTab/NotificationState.vue'
import CitationNotification from '/@/components/Settings/BrowserTab/CitationNotification.vue'
import CacheManager from '/@/components/Settings/BrowserTab/CacheManager.vue'
import OpenMode from '/@/components/Settings/BrowserTab/OpenMode.vue'
import SendKey from '/@/components/Settings/BrowserTab/SendKey.vue'
import EcoMode from '/@/components/Settings/BrowserTab/EcoMode.vue'
import { reactive } from 'vue'
import { useBrowserSettings } from '/@/store/app/browserSettings'

const state = reactive(useBrowserSettings())
</script>

<style lang="scss" module>
.element {
  margin: 24px 0;
}
</style>
