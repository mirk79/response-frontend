export default {
  state: () => ({
    mainNavIsActive: false,
    userAreaIsActive: false,
    audiotrackIsActive: false,
    audiotrackInProgress: false,
    slidesCurrentTrackmarker: 0
  }),
  mutations: {
    setMainNavIsActive(state, val) {
      state.mainNavIsActive = val
    },
    setUserAreaIsActive(state, val) {
      state.userAreaIsActive = val
    },
    setAudiotrackIsActive(state, val) {
      state.audiotrackIsActive = val
    },
    setAudiotrackInProgress(state, val) {
      state.audiotrackInProgress = val
    },
    setSlidesCurrentTrackmarker(state, val) {
      state.slidesCurrentTrackmarker = val
    }
  },
  getters: {
    getMainNavIsActive(state) {
      return state.mainNavIsActive
    },
    getUserAreaIsActive(state) {
      return state.userAreaIsActive
    },
    getAudiotrackIsActive(state) {
      return state.audiotrackIsActive
    },
    getAudiotrackInProgress(state) {
      return state.audiotrackInProgress
    },
    getSlidesCurrentTrackmarker(state) {
      return state.slidesCurrentTrackmarker
    }
  }
}
