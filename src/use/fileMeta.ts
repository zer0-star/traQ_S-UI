import { computed } from 'vue'
import store from '/@/vuex'
import { buildFilePath } from '/@/lib/apis'
import { mimeToFileType, prettifyFileSize } from '/@/lib/basic/file'
import useFileLink from '/@/use/fileLink'
import { ChannelId, FileId } from '/@/types/entity-ids'

const useFileMeta = (props: {
  fileId: FileId
  /** 表示しているチャンネル */
  channelId?: ChannelId
}) => {
  const fileMeta = computed(() =>
    store.state.entities.messages.fileMetaDataMap.get(props.fileId)
  )
  const { fileLink, onFileDownloadLinkClick } = useFileLink(props)
  const fileRawPath = computed(() =>
    fileMeta.value ? buildFilePath(fileMeta.value.id) : ''
  )
  const fileType = computed(() =>
    fileMeta.value ? mimeToFileType(fileMeta.value.mime) : 'file'
  )
  const isAnimatedImage = computed(
    () => fileMeta.value?.isAnimatedImage ?? false
  )
  const fileSize = computed(() =>
    fileMeta.value ? prettifyFileSize(fileMeta.value.size) : '0B'
  )
  const canShow = computed(() => {
    const fileChannel = fileMeta.value?.channelId
    // DMのメッセージは同じDMチャンネルから表示されてる場合だけ表示する
    return fileChannel
      ? !store.state.entities.dmChannelsMap.has(fileChannel) ||
          fileChannel === props.channelId
      : true
  })
  return {
    fileMeta,
    fileLink,
    fileRawPath,
    fileType,
    isAnimatedImage,
    fileSize,
    canShow,
    onFileDownloadLinkClick
  }
}

export default useFileMeta
