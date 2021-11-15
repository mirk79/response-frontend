<template>
  <nav
    v-if="bulletnavigation.bullets"
    id="bulletNavigation"
    class="bulletNavigation"
  >
    <h3 class="moduleTitle">
      {{ bulletnavigation.bullets[0].pageTitle }}
    </h3>
    <div class="menuContainer">
      <div class="menu-item prev" :class="{ disabled: !bulletnavigation.prev }">
        <nav-link
          v-if="bulletnavigation.prev"
          :to="{
            path: bulletnavigation.prev.link,
            query: { sl: 'prv' }
          }"
          class="menu-link prev"
          :title="bulletnavigation.prev.title"
          >{{ bulletnavigation.prev.title }}</nav-link
        >
      </div>
      <div
        class="bulletContainer"
        :style="{ width: getBulletContainerWidth + 'px' }"
      >
        <ul class="menu" :style="getBulletMenuXpos">
          <li
            v-for="(item, key) in bulletnavigation.bullets"
            :key="key"
            class="menu-item bullet"
            :class="{ current: item.current }"
          >
            <nav-link
              :to="{
                path: item.link,
                query: addQueryParams(item)
              }"
              class="menu-link bullet"
              :title="item.title"
              :style="{ color: item.current && pagecolor ? pagecolor : '' }"
            >
              {{ key + 1 }}
            </nav-link>
          </li>
        </ul>
      </div>
      <div class="menu-item next" :class="{ disabled: !bulletnavigation.next }">
        <nav-link
          v-if="bulletnavigation.next"
          :to="{
            path: bulletnavigation.next.link,
            query: { sl: 'nxt' }
          }"
          class="menu-link next"
          :title="bulletnavigation.next.title"
          >{{ bulletnavigation.next.title }}</nav-link
        >
      </div>
    </div>
    <!-- <div class="currentSlideNumber">
      {{ $t('Slide') }} {{ getCurrentIndex + 1 }} {{ $t('of') }}
      {{ getBulletCount }}
    </div> -->
  </nav>
</template>

<script>
export default {
  name: 'BulletNavigation',
  props: {
    bulletnavigation: {
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
      bulletWidth: 28,
      maxWidthOffset: 190
    }
  },
  computed: {
    getCurrentIndex() {
      const currentIndex =
        this.bulletnavigation.bullets && this.bulletnavigation.bullets.length
          ? this.bulletnavigation.bullets.findIndex(function(item, index) {
              if (item.current) return true
              else return false
            })
          : 0
      return currentIndex
    },
    getBulletCount() {
      const bulletCount =
        this.bulletnavigation.bullets && this.bulletnavigation.bullets.length
          ? this.bulletnavigation.bullets.length
          : 0
      return bulletCount
    },
    getBulletContainerWidth() {
      if (process.client) {
        const maxWidth =
          Math.floor(
            (window.innerWidth - this.maxWidthOffset) / this.bulletWidth
          ) * this.bulletWidth
        let width =
          this.bulletnavigation.bullets && this.bulletnavigation.bullets.length
            ? this.bulletnavigation.bullets.length * this.bulletWidth
            : this.bulletWidth
        if (width > maxWidth) width = maxWidth
        return width
      } else {
        return null
      }
    },
    getBulletMenuXpos() {
      if (process.client) {
        const maxBulletsToShow = Math.floor(
          (window.innerWidth - this.maxWidthOffset) / this.bulletWidth
        )
        let firstIndexToShow = 0
        if (this.getBulletCount > maxBulletsToShow) {
          firstIndexToShow =
            this.getCurrentIndex < (this.getBulletCount - 1) / 2
              ? Math.floor(
                  (this.getCurrentIndex / (this.getBulletCount - 1)) *
                    (this.getBulletCount - maxBulletsToShow)
                )
              : Math.ceil(
                  (this.getCurrentIndex / (this.getBulletCount - 1)) *
                    (this.getBulletCount - maxBulletsToShow)
                )
        }
        const transformVal =
          'translateX(-' + this.bulletWidth * firstIndexToShow + 'px)'
        return {
          '-webkit-transform': transformVal,
          '-ms-transform': transformVal,
          transform: transformVal
        }
      } else {
        return null
      }
    }
  },
  methods: {
    addQueryParams(item) {
      /* adding query tag params: Is Link prev or next? */
      let ret = {}
      if (item.isPrev && !item.isNext) {
        ret = { sl: 'prv' }
      } else if (item.isNext && !item.isPrev) {
        ret = { sl: 'nxt' }
      }
      return ret
    }
  }
}
</script>
