import { defineMutations } from 'direct-vuex'
import { S, StampSelectHandler, SelectedStampData } from './state'
import { StampSet } from '@/components/Main/StampPicker/use/stampSetSelector'
import { Place } from '.'

export const mutations = defineMutations<S>()({
  setTargetPortalName(state, name: string) {
    state.targetPortalName = name
  },
  setSelectHandler(state, handler: StampSelectHandler) {
    state.selectHandler = handler
  },
  setCurrentStampSet(state, set: StampSet) {
    state.currentStampSet = set
  },
  setPosition(state, position: Place | undefined) {
    state.position = position
  },
  clearSelectHandler(state) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    state.selectHandler = (_: SelectedStampData) => {}
  },
  clearTargetPortalName(state) {
    state.targetPortalName = ''
  },
  clearCurrentStampPaletteId(state) {
    state.currentStampSet = {
      type: 'history',
      id: ''
    }
  },
  clearPosition(state) {
    state.position = undefined
  }
})
