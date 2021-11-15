<template>
  <div class="ce-mask-audiotrack">
    <ce-header v-bind="$props" />
  </div>
</template>
<script>
import baseCe from '~typo3/components/content/mixins/baseCe'
export default {
  name: 'CeMaskAudiotrack',
  extends: baseCe,
  props: {
    additionalSettings: {
      type: [Object, Array],
      required: false,
      default: () => {}
    }
  }
}
</script>
