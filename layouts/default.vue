<template>
  <div
    id="app"
    class="app-content"
    :style="{ 'background-color': pagecolor ? pagecolor : '' }"
    :class="{
      darkpage: isPagecolorDark,
      isPageLayout: !isSlideLayout,
      isSlideLayout: isSlideLayout
    }"
  >
    <sideslider :navigation="navigation" :pagecolor="pagecolor" />
    <bullet-navigation
      v-if="isSlideLayout"
      :bulletnavigation="moduleBulletNavigation"
      :pagecolor="pagecolor"
    ></bullet-navigation>
    <div class="section-main">
      <!-- <div v-if="breadcrumbs" class="border-b mb-20px">
        <breadcrumbs :links="breadcrumbs" class="container" />
      </div> -->
      <nuxt />
    </div>
    <audiotracks
      v-if="isSlideLayout"
      :audiotracks="audiotracks"
      :pagecolor="pagecolor"
      :pid="pid"
    ></audiotracks>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import Breadcrumbs from '../components/ui/Breadcrumbs'
import BulletNavigation from '../components/ui/BulletNavigation'
import Sideslider from '../components/ui/Sideslider'
import Audiotracks from '../components/ui/Audiotracks'

export default {
  components: {
    Sideslider,
    BulletNavigation,
    Audiotracks
    // Breadcrumbs
  },
  scrollToTop: true,
  functions: {},
  computed: {
    ...mapState({
      // navMain: (state) => state.typo3.initial.navigation[0] || [], // get first instance from root tree,
      // breadcrumbs: (state) =>
      // state.typo3.page.page ? state.typo3.page.page.breadcrumbs : [], // get breadcrumbs for current page,
      // currentLanguage: (state) => state.typo3.locale,
      // availableLanguages: (state) => state.typo3.page.languages
      // allStateStuff: (state) => state.typo3 || {},
      navigation(state) {
        return {
          eLearningModules: state.typo3.initial.modulesNavigation || [],
          pages: state.typo3.initial.pagesNavigation || [],
          specialPages: {
            homepage:
              state.typo3.initial.specialPagesNavigation.homepage[0] || null,
            glossary:
              state.typo3.initial.specialPagesNavigation.glossary[0] || null
          }
        }
      },
      moduleBulletNavigation(state) {
        /* restructuring bullet links in order from title and subs */
        const bulletsArray = []
        if (state.typo3.page.page.moduleBulletNavigation.bullets) {
          if (
            state.typo3.page.page.moduleBulletNavigation.bullets.title &&
            Array.isArray(
              state.typo3.page.page.moduleBulletNavigation.bullets.title
            )
          ) {
            state.typo3.page.page.moduleBulletNavigation.bullets.title.forEach(
              (el) => bulletsArray.push(el)
            )
          }
          if (
            state.typo3.page.page.moduleBulletNavigation.bullets.subs &&
            Array.isArray(
              state.typo3.page.page.moduleBulletNavigation.bullets.subs
            )
          ) {
            state.typo3.page.page.moduleBulletNavigation.bullets.subs.forEach(
              (el) => bulletsArray.push(el)
            )
          }
        }
        /* getting "prev" & "next" links ... */
        let prev = null
        let next = null
        let elIsPrev = true
        let elIsNext = false
        bulletsArray.forEach(function(el, i) {
          el.isNext = elIsNext
          if (el.current) {
            if (i > 0) {
              prev = bulletsArray[i - 1]
            }
            if (i < bulletsArray.length - 1) {
              next = bulletsArray[i + 1]
            }
            elIsPrev = false
            elIsNext = true
          }
          el.isPrev = elIsPrev
        })
        return {
          bullets: bulletsArray,
          prev,
          next
        }
      },
      isSlideLayout(state) {
        let ret = false
        if (
          (state.typo3.page.page.appearance.backendLayout === 'slide_title' ||
            state.typo3.page.page.appearance.backendLayout === 'slide_std') &&
          state.typo3.page.page.treeLevel > 1 &&
          state.typo3.page.page.treeLevel < 4
        ) {
          ret = true
        }
        return ret
      },
      pid(state) {
        return state.typo3.page.page.id || null
      },
      pagecolor(state) {
        return state.typo3.page.page.appearance.pageColor || null
      },
      backendlayout(state) {
        return state.typo3.page.page.appearance.backendLayout || null
      },
      audiotracks(state) {
        const colPos1 = state.typo3.page.content.colPos1 || null
        let audiotracks =
          colPos1 && Array.isArray(colPos1)
            ? colPos1.filter(function(item) {
                return item.type === 'mask_audiotrack'
              })
            : null
        if (!audiotracks || !audiotracks.length) audiotracks = null
        return audiotracks
      },
      slidesCurrentTrackmarker(state) {
        return state.slidesCurrentTrackmarker || 0
      }
    }),
    isPagecolorDark() {
      let color = this.pagecolor || null
      let ret = false
      if (color) {
        // If hex --> Convert it to RGB: http://gist.github.com/983661
        color = +(
          '0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&')
        )

        const r = color >> 16
        const g = (color >> 8) & 255
        const b = color & 255

        // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
        const hsp = Math.sqrt(
          0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
        )

        // Using the HSP value, determine whether the color is light or dark
        if (hsp > 127.5) {
          ret = false
        } else {
          ret = true
        }
      }
      return ret
    }
  },
  watch: {
    $route(to, from) {
      // console.log('route', to, from)
      this.$store.commit('setMainNavIsActive', false)
      this.$store.commit('setUserAreaIsActive', false)
    }
  }
  // beforeCreate() {
  //   // console.log(this.allStateStuff) // geht eh noch nicht ...
  // },
  // created() {
  //   console.log('created()', this.allStateStuff)
  // }
  // mounted() {
  //   // console.log(this.navSpecialPages)
  // }
}
</script>
