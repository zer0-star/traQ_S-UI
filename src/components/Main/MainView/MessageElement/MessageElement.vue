<template>
  <div
    v-if="message"
    ref="bodyRef"
    :class="$style.body"
    :data-is-mobile="$boolAttr(isMobile)"
    :data-is-pinned="$boolAttr(message.pinned)"
    :data-is-entry="$boolAttr(isEntryMessage)"
    :data-is-editing="$boolAttr(isEditing)"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <message-pinned
      v-if="pinnedUserId"
      :pinned-user-id="pinnedUserId"
      :class="$style.pinned"
    />
    <message-tools
      :show="isHovered && !isEditing"
      :class="$style.tools"
      :message-id="messageId"
      :is-minimum="isArchived"
    />
    <message-contents :class="$style.messageContents" :message-id="messageId" />
    <message-stamp-list
      :show-detail-button="isHovered"
      :message-id="messageId"
      :stamps="message.stamps"
      :is-archived="isArchived"
    />
  </div>
</template>

<script lang="ts" setup>
import MessageStampList from './MessageStampList.vue'
import MessagePinned from './MessagePinned.vue'
import MessageContents from './MessageContents.vue'
import MessageTools from '/@/components/Main/MainView/MessageElement/MessageTools.vue'
import { computed, shallowRef, toRef } from 'vue'
import type { MessageId, UserId } from '/@/types/entity-ids'
import { useResponsiveStore } from '/@/store/ui/responsive'
import type { ChangeHeightData } from './composables/useElementRenderObserver'
import useElementRenderObserver from './composables/useElementRenderObserver'
import useEmbeddings from '/@/composables/message/useEmbeddings'
import useHover from '/@/composables/dom/useHover'
import { useMessagesStore } from '/@/store/entities/messages'
import { useMessageEditingStateStore } from '/@/store/ui/messageEditingStateStore'

const props = withDefaults(
  defineProps<{
    messageId: MessageId
    pinnedUserId?: UserId
    isEntryMessage?: boolean
    isArchived?: boolean
  }>(),
  {
    isEntryMessage: false,
    isArchived: false
  }
)

const emit = defineEmits<{
  (e: 'entryMessageLoaded', _relativePos: number): void
  (e: 'changeHeight', _data: ChangeHeightData): void
}>()

const bodyRef = shallowRef<HTMLDivElement | null>(null)
const { isMobile } = useResponsiveStore()
const { messagesMap } = useMessagesStore()
const message = computed(() => messagesMap.value.get(props.messageId))

const { editingMessageId } = useMessageEditingStateStore()
const isEditing = computed(() => props.messageId === editingMessageId.value)

const { embeddingsState } = useEmbeddings(props)

useElementRenderObserver(
  bodyRef,
  toRef(props, 'isEntryMessage'),
  toRef(props, 'messageId'),
  embeddingsState,
  emit
)

const { isHovered, onMouseEnter, onMouseLeave } = useHover()
</script>

<style lang="scss" module>
$messagePadding: 32px;
$messagePaddingMobile: 16px;

.body {
  position: relative;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  overflow: clip;
  padding: 8px $messagePadding;
  &[data-is-mobile] {
    padding: 8px $messagePaddingMobile;
  }
  &[data-is-pinned] {
    background: $common-background-pin;
  }
  &[data-is-entry] {
    // TODO: 色を正しくする
    background: $common-background-pin;
  }
  &:not([data-is-editing]):not([data-is-pinned]):not([data-is-entry]):hover {
    background: var(--specific-message-hover-background);
  }
}

.pinned {
  padding: {
    top: 4px;
    bottom: 8px;
  }
}

.messageContents {
  min-width: 0;
}

.tools {
  position: absolute;
  top: 4px;
  right: 16px;
  z-index: $z-index-message-element-tools;
}
</style>
