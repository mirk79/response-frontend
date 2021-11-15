<template>
  <div class="ce-textpic">
    <ce-header v-bind="$props" />
    <media-gallery
      :gallery="gallery"
      :gallery-appearance="galleryAppearance"
      :additional-settings="additionalSettings"
    >
      <html-parser :content="bodytext" />
    </media-gallery>
  </div>
</template>
<script>
import MediaGallery from './media/Gallery'
import baseCe from '~typo3/components/content/mixins/baseCe'
export default {
  name: 'CeTextpic',
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
    bodytext: {
      type: String,
      required: true,
      default: ''
    },
    galleryAppearance: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    isAudioSynced() {
      // return this
      return (
        // this.additionalSettings &&
        // this.additionalSettings.audiosync &&
        this.additionalSettings.audiosync === '1'
      )
    }
  }
}
</script>
