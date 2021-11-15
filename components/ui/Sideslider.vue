<template>
  <header
    id="sideslider"
    class="sideslider"
    :class="{ active: mainNavIsActive || userAreaIsActive }"
  >
    <div class="mainnav-container" :class="{ active: mainNavIsActive }">
      <button
        id="mainnav-toggle"
        class="mainnav-toggle"
        :style="{ 'background-color': pagecolor ? pagecolor : '' }"
        @click="
          {
            setUserAreaIsActive(false)
            setMainNavIsActive(!mainNavIsActive)
          }
        "
      >
        {{ $t('toggle nav') }}
      </button>
      <navigation-main :navigation="navigation" />
    </div>
    <div class="feuser-container" :class="{ active: userAreaIsActive }">
      <button
        id="feuser-toggle"
        class="feuser-toggle"
        :style="{ 'background-color': pagecolor ? pagecolor : '' }"
        @click="
          {
            setMainNavIsActive(false)
            setUserAreaIsActive(!userAreaIsActive)
          }
        "
      >
        {{ $t('toggle user area') }}
      </button>
      <fe-user-area />
    </div>
    <div
      class="closeSidesliders"
      @click="
        {
          setMainNavIsActive(false)
          setUserAreaIsActive(false)
        }
      "
    ></div>
  </header>
</template>

<script>
import NavigationMain from './NavigationMain'
import FeUserArea from './FeUserArea'

export default {
  name: 'Sideslider',
  components: {
    NavigationMain,
    FeUserArea
  },
  props: {
    navigation: {
      type: Object,
      required: true,
      default: () => {}
    },
    pagecolor: {
      type: String,
      required: false,
      default: () => ''
    }
  },
  data() {
    return {
      // mainNavIsActive: false,
      // userAreaIsActive: false
    }
  },
  computed: {
    mainNavIsActive() {
      return this.$store.state.mainNavIsActive
    },
    userAreaIsActive() {
      return this.$store.state.userAreaIsActive
    }
  },
  methods: {
    setMainNavIsActive(val) {
      this.$store.commit('setMainNavIsActive', val)
    },
    setUserAreaIsActive(val) {
      this.$store.commit('setUserAreaIsActive', val)
    }
  }
}
</script>
