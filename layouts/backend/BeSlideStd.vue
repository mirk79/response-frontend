<template>
  <div class="slide slideStd">
    <!-- <bullet-navigation></bullet-navigation> -->
    <ce-renderer :content="content.colPos0" />
    <!-- <hr /> -->
    <!-- <ce-renderer :content="content.colPos1" /> -->
  </div>
</template>
<script>
// import BulletNavigation from '../../components/ui/BulletNavigation'
import BeDefault from '~typo3/layouts/backend/BeDefault'

export default {
  functional: false,
  components: {
    // BulletNavigation
  },
  extends: BeDefault
  // transition: {
  //   name: 'test',
  //   mode: 'out-in',
  //   duration: 5000
  //   // enterClass: 'slide-enter',
  //   // enterToClass: 'slide-enter-to',
  //   // enterActiveClass: 'slide-enter-active',
  //   // leaveClass: 'slide-leave',
  //   // leaveToClass: 'slide-leave-to',
  //   // leaveActiveClass: 'slide-leave-active'
  // }
}
</script>
