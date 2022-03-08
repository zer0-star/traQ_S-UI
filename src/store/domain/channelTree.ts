import mitt from 'mitt'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { computed, ref } from 'vue'
import { channelIdToPathString } from '/@/lib/channel'
import { ChannelTree, constructTree, rootChannelId } from '/@/lib/channelTree'
import router, { rewriteChannelPath } from '/@/router'
import { convertToRefsStore } from '/@/store/utils/convertToRefsStore'
import { ChannelId } from '/@/types/entity-ids'
import store from '/@/vuex'
import { meMitt } from '/@/vuex/domain/me'
import { entityMitt } from '/@/vuex/entities/mitt'

type ChannelTreeEventMap = {
  created: { id: ChannelId; path: string }
  moved: { id: ChannelId; newPath: string; oldPath: string }
}

export const channelTreeMitt = mitt<ChannelTreeEventMap>()

// 循環参照を回避するためにこっちに書く
channelTreeMitt.on('moved', ({ oldPath, newPath }) => {
  const nowPath = router.currentRoute.value.path
  const rewrittenPath = rewriteChannelPath(nowPath, { oldPath, newPath })
  if (rewrittenPath === null) {
    return
  }

  router.replace({
    path: rewrittenPath
  })
})

const useChannelTreePinia = defineStore('domain/channelTree', () => {
  const channelTree = ref<Readonly<ChannelTree>>({ children: [] })
  const homeChannelTree = ref<Readonly<ChannelTree>>({ children: [] })

  const topLevelChannels = computed(() =>
    [...store.state.entities.channelsMap.values()].filter(
      channel => channel.parentId === undefined || channel.parentId === null
    )
  )
  const forcedChannels = computed(() =>
    [...store.state.entities.channelsMap.values()].filter(
      channel => channel.force
    )
  )

  const constructChannelTree = () => {
    const topLevelChannelIds = topLevelChannels.value.map(c => c.id)
    const tree = {
      children:
        constructTree(
          {
            id: rootChannelId,
            name: '',
            parentId: null,
            archived: false,
            children: topLevelChannelIds
          },
          store.state.entities.channelsMap
        )?.children ?? []
    }
    channelTree.value = tree
  }
  const constructHomeChannelTree = () => {
    const topLevelChannelIds = topLevelChannels.value.map(c => c.id)
    // TODO: 効率が悪いので改善
    const subscribedOrForceChannels = new Set([
      ...store.getters.domain.me.subscribedChannels,
      ...forcedChannels.value.map(c => c.id)
    ])
    const tree = {
      children:
        constructTree(
          {
            id: rootChannelId,
            name: '',
            parentId: null,
            archived: false,
            children: topLevelChannelIds
          },
          store.state.entities.channelsMap,
          subscribedOrForceChannels
        )?.children ?? []
    }
    homeChannelTree.value = tree
  }
  const constructAllTrees = () => {
    constructChannelTree()
    constructHomeChannelTree()
  }

  entityMitt.on('setChannels', () => {
    constructAllTrees()
  })
  entityMitt.on('addChannel', channel => {
    // 新規追加のときはホームに表示されることはないのでhomeChannelTree構築しない
    constructChannelTree()

    const path = channelIdToPathString(
      channel.id,
      store.state.entities.channelsMap
    )
    channelTreeMitt.emit('created', { id: channel.id, path })
  })
  entityMitt.on('updateChannel', ({ newChannel, oldChannel, oldPath }) => {
    // 名前も親チャンネルもアーカイブ状態も変わっていないなら構造は変わらない
    if (
      newChannel.name === oldChannel.name &&
      newChannel.parentId === oldChannel.parentId &&
      newChannel.archived === oldChannel.archived
    ) {
      return
    }

    constructAllTrees()

    if (
      newChannel.name !== oldChannel.name ||
      newChannel.parentId !== oldChannel.parentId
    ) {
      const newPath = channelIdToPathString(
        newChannel.id,
        store.state.entities.channelsMap
      )
      channelTreeMitt.emit('moved', { id: newChannel.id, oldPath, newPath })
    }
  })

  meMitt.on('setSubscriptions', () => {
    constructHomeChannelTree()
  })
  meMitt.on('updateSubscriptions', () => {
    constructHomeChannelTree()
  })

  return { channelTree, homeChannelTree, topLevelChannels }
})

export const useChannelTree = convertToRefsStore(useChannelTreePinia)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelTreePinia, import.meta.hot))
}
