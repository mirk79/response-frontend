<template>
  <div
    id="audiotracks"
    class="audiotracks"
    :class="{
      disabled: !audiotracks || !audiotracks.length,
      active: audiotrackIsActive,
      playing: audiotrackInProgress
    }"
  >
    <button
      id="audiotracksToggle"
      class="audiotracksToggle"
      @click="setAudiotrackIsActive(!audiotrackIsActive)"
    >
      <img
        class="audiotracksToggleSVG"
        src="/static/img/audiotracks-playing.svg"
        :alt="$t('toggle audio controls')"
      />
      {{ $t('toggle audio controls') }}
    </button>
    <div class="trackmarker">
      <span
        v-for="(marker, key) in currentTrackmarker"
        :key="key"
        class="marker"
        :class="{
          passed: marker.sec <= currentTime
        }"
        :style="'left: ' + marker.pos + '%;'"
        >{{ marker.title }}</span
      >
      <!-- <span class="marker passed" style="left: 0%">Marker 1</span>
      <span class="marker passed" style="left: 25%">Marker 2</span>
      <span class="marker" style="left: 50%">Marker 3</span>
      <span class="marker" style="left: 75%">Marker 4</span>
      <span class="marker" style="left: 100%">Marker 5</span> -->
    </div>
    <vue-plyr ref="pageaudioPlyr" :options="plyrOptions">
      <audio controls playsinline crossorigin>
        <track kind="caption" default />
      </audio>
      <!-- <video controls></video> -->
    </vue-plyr>
    <div
      v-if="
        !!(audiotracks && $refs.pageaudioPlyr && $refs.pageaudioPlyr.player)
      "
      class="tracklistNav"
    >
      <button
        class="tracklist prev"
        :class="{ disabled: currentTrackKey <= 0 }"
        @click="setCurrentTrack(currentTrackKey - 1)"
      >
        zurück
      </button>
      <button
        class="playButton"
        :class="{
          paused: !$refs.pageaudioPlyr.player.playing,
          playing: $refs.pageaudioPlyr.player.playing
        }"
        @click="$refs.pageaudioPlyr.player.togglePlay()"
      >
        play/pause
      </button>
      <button
        class="tracklist next"
        :class="{ disabled: currentTrackKey >= audiotracks.length - 1 }"
        @click="setCurrentTrack(currentTrackKey + 1)"
      >
        vor
      </button>
      <!-- <div class="slidesCurrentTrackmarker">{{ slidesCurrentTrackmarker }}</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Audiotracks',
  // components: {},
  props: {
    audiotracks: {
      type: Array,
      required: false,
      default: () => []
    },
    pagecolor: {
      type: String,
      required: false,
      default: () => ''
    },
    pid: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      ready: false,
      playing: false,
      // loading: false,
      seeking: false,
      tracklist: [],
      trackmarker: [],
      currentTrack: null,
      currentTrackKey: 0,
      currentTrackmarker: null,
      slidesCurrentTrackmarker: 0,
      currentTime: 0,
      plyrOptions: {
        debug: false,
        controls: [
          // 'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'captions'
          // 'settings'
          // 'pip',
          // 'airplay'
        ],
        // settings: ['captions', 'quality', 'speed', 'loop'],
        loadSprite: false,
        // iconUrl: '',
        autoplay: false,
        autopause: true,
        // seekTime: 1,
        // volume: 1,
        // muted: true
        // disableContextMenu: true,
        resetOnEnd: true,
        keyboard: {
          focused: false,
          global: false
        },
        tooltips: {
          controls: false,
          seek: false
        },
        // displayDuration: false
        invertTime: false,
        toggleInvert: true,
        // listeners: {},
        captions: {
          active: false,
          language: 'auto',
          update: true
        },
        storage: {
          enabled: true,
          key: 'responsepageaudio'
        }
        // speed: {
        //   selected: 1,
        //   options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
        // },
        // loop: true
        // urls: '',
      }
    }
  },
  computed: {
    audiotrackIsActive() {
      return this.$store.state.audiotrackIsActive
    },
    audiotrackInProgress() {
      return !!(this.ready && (this.playing || this.seeking))
    }
  },
  watch: {
    $route(to, from) {
      // console.log('$route', to, from, this.pid)
      this.setAudiotrackIsActive(false)
      if (this.$refs.pageaudioPlyr.player) {
        this.$refs.pageaudioPlyr.player.stop()
        this.tracklist = this.setTracklist()
        if (this.tracklist.length) {
          this.setCurrentTrack(0)
          // this.$refs.pageaudioPlyr.player.play()
        }
      }
    },
    slidesCurrentTrackmarker(newval, oldval) {
      // console.log('slidesCurrentTrackmarker changed ', oldval, newval)
      this.$store.commit('setSlidesCurrentTrackmarker', newval)
    },
    audiotrackInProgress(val) {
      this.$store.commit('setAudiotrackInProgress', val)
    }
  },
  // beforeMount() {
  //   console.log('beforeMount', this.pid)
  // },
  mounted() {
    // console.log('mounted', this.pid)
    this.setAudiotrackIsActive(false)
    if (this.$refs.pageaudioPlyr.player) {
      // console.log(this.$refs.pageaudioPlyr.player.elements.inputs.seek)
      /* Set plyr Event listeners */
      /* 
      ready
      progress
      loadeddata
      playing
      play
      pause
      timeupdate
      seeking
      seeked
      ended
      */
      this.$refs.pageaudioPlyr.player.on('ready', () => {
        // console.log('ready')
        this.ready = true
      })
      // this.$refs.pageaudioPlyr.player.on('progress', () => {
      //   console.log('progress')
      // })
      this.$refs.pageaudioPlyr.player.on('loadeddata', () => {
        // console.log('loadeddata')
        this.setCurrentTrackmarker()
        this.$refs.pageaudioPlyr.player.play() // "play" hier, damit vorher auch die Trackmarker geladen werden...
      })
      this.$refs.pageaudioPlyr.player.on('playing', () => {
        // console.log('playing')
        this.playing = true
        this.seeking = false
        this.$store.commit(
          'setSlidesCurrentTrackmarker',
          this.slidesCurrentTrackmarker
        )
      })
      // this.$refs.pageaudioPlyr.player.on('play', () => {
      //   console.log('play')
      //   // this.playing = true
      // })
      this.$refs.pageaudioPlyr.player.on('pause', () => {
        // console.log('pause')
        this.seeking = false
        this.playing = false
      })
      this.$refs.pageaudioPlyr.player.on('timeupdate', () => {
        // console.log('timeupdate')
        this.setSlidesCurrentTrackmarker()
        this.currentTime = this.$refs.pageaudioPlyr.player.currentTime
      })
      this.$refs.pageaudioPlyr.player.on('seeking', () => {
        // console.log('seeking')
        // this.seeking = true
        // this.playing = false
      })
      this.$refs.pageaudioPlyr.player.once('seeked', () => {
        // console.log('seeked')
        // if (!this.playing)
        // this.playing = true
        // this.seeking = false
      })
      // this.$refs.pageaudioPlyr.player.elements.inputs.seek.addEventListener(
      //   'focus',
      //   () => {
      //     console.log('drag')
      //   }
      // )
      // this.$refs.pageaudioPlyr.player.elements.inputs.seek.ondragend = function() {
      //   console.log('dragend')
      // }
      this.$refs.pageaudioPlyr.player.on('ended', () => {
        // console.log('ended')
        this.setCurrentTrack(this.currentTrackKey + 1)
        this.playing = false
        this.seeking = false
      })
      /* set tracklist */
      this.tracklist = this.setTracklist()
      /* start playing ... */
      if (this.tracklist.length) {
        this.setCurrentTrack(0)
        // this.$refs.pageaudioPlyr.player.play()
      }
    }
  },
  beforeDestroy() {
    // console.log('beforeDestroy', this.pid)
    this.setAudiotrackIsActive(false)
    if (this.$refs.pageaudioPlyr.player) {
      // müssen wir vorher noch alle Event Listener entfernen?
      this.ready = false
      this.$refs.pageaudioPlyr.player.destroy()
    }
  },
  // destroyed() {
  //   console.log('destroyed', this.pid)
  // },
  methods: {
    setAudiotrackIsActive(val) {
      this.$store.commit('setAudiotrackIsActive', val)
    },
    setTracklist() {
      const tracklist = []
      if (this.audiotracks && this.audiotracks.length) {
        for (const track of this.audiotracks) {
          tracklist.push({
            // type: 'audio',
            type: 'video', // "video", damit die vtt Datei mit angezeigt wird ...
            title: track.content.header || '',
            sources: [
              {
                src:
                  track.content.audiofile[0] &&
                  track.content.audiofile[0].publicUrl
                    ? track.content.audiofile[0].publicUrl
                    : '',
                type:
                  track.content.audiofile[0] &&
                  track.content.audiofile[0].properties.mimeType
                    ? track.content.audiofile[0].properties.mimeType
                    : ''
              }
            ],
            tracks: [
              {
                kind: 'captions',
                label: 'German',
                srclang: 'de',
                src:
                  track.content.subtitles[0] &&
                  track.content.subtitles[0].publicUrl
                    ? track.content.subtitles[0].publicUrl
                    : '',
                default: false
              }
            ]
          })
        }
      }
      return tracklist
    },
    setCurrentTrackmarker() {
      // console.log('setCurrentTrackmarker')
      const duration = this.$refs.pageaudioPlyr.player
        ? Math.round(this.$refs.pageaudioPlyr.player.duration)
        : null
      const trackmarker = []
      if (this.currentTrack && this.currentTrack.content.markers) {
        for (const marker of this.currentTrack.content.markers) {
          // turn string into seconds ...
          const markerArray = marker.marker.split(':')
          let markerSeconds = 0
          if (markerArray.length === 2) {
            markerSeconds =
              parseInt(markerArray[0]) * 60 + parseInt(markerArray[1])
          }
          if (markerSeconds && markerSeconds <= duration) {
            trackmarker.push({
              title: marker.header || '',
              sec: markerSeconds || 0,
              pos: ((100 / duration) * markerSeconds).toFixed(2) || 0
            })
          }
        }
      }
      this.trackmarker[this.currentTrackKey] = trackmarker
      this.currentTrackmarker = trackmarker
      // return trackmarker
    },
    setCurrentTrack(i) {
      if (i >= 0 && i < this.audiotracks.length) {
        this.currentTrack = this.audiotracks[i]
        this.currentTrackKey = i
        this.$refs.pageaudioPlyr.player.source = this.tracklist[i]
      }
      return true
    },
    setSlidesCurrentTrackmarker() {
      let markerpos = 0
      const currentTime = this.$refs.pageaudioPlyr.player.currentTime
      for (let i = 0; i <= this.currentTrackKey; i++) {
        if (this.trackmarker[i]) {
          if (i > 0) {
            markerpos++ // wenn ein neuer Track auch als nächster Marker gelten soll ...
          }
          if (i < this.currentTrackKey) {
            markerpos += this.trackmarker[i].length
          } else if (i === this.currentTrackKey) {
            for (const m of this.currentTrackmarker) {
              if (m.sec < currentTime) {
                markerpos++
              }
            }
          }
        }
      }
      this.slidesCurrentTrackmarker = markerpos
      // return markerpos
    }
  }
}
</script>
