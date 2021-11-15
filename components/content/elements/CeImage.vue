<template>
  <div class="ce-image">
    <ce-header v-bind="$props" />
    <media-gallery
      :gallery="gallery"
      :gallery-appearance="galleryAppearance"
      :additional-settings="additionalSettings"
    />
  </div>
</template>
<script>
import MediaGallery from './media/Gallery'
import baseCe from '~typo3/components/content/mixins/baseCe'
export default {
  name: 'CeImage',
  components: {
    MediaGallery
  },
  extends: baseCe,
  props: {
    additionalSettings: {
      type: [Object, Array],
      required: false,
      default: () => {}
    },
    gallery: {
      type: [Object, Array],
      required: true,
      default: () => {}
    },
    galleryAppearance: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
}
</script>
