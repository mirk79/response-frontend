<template>
  <div :class="galleryCss" class="ce-gallery">
    <slot name="before" />

    <div v-if="!isGalleryAbove" class="ce-gallery__text">
      <slot />
    </div>

    <div v-if="gallery.length" class="ce-gallery__outer-container">
      <ul
        v-if="galleryAppearance.imagecaptionposition === '2'"
        class="ce-gallery__captions"
      >
        <li
          v-for="(item, itemKey) in galleryItemsWithCaption"
          :key="itemKey"
          class="ce-gallery__item-caption"
          :class="{
            currentCaption:
              additionalSettings.audiosync == '1' &&
              item.origKey == slidesCurrentTrackmarker
          }"
        >
          {{ item.origItem.properties.description }}
        </li>
      </ul>

      <div
        v-if="galleryAppearance.imagegallery === '0'"
        class="ce-gallery__container"
        :class="'ce-gallery-' + galleryAppearance.imagecols + '-cols'"
      >
        <ce-media-file
          v-for="(img, imgKey) in gallery"
          :key="imgKey"
          class="ce-gallery__item"
          :file="img"
          :gallery-appearance="galleryAppearance"
          :additional-settings="additionalSettings"
          :class="{
            currentItem:
              additionalSettings.audiosync == '1' &&
              imgKey == slidesCurrentTrackmarker
          }"
        />
      </div>

      <VueSlickCarousel
        v-if="galleryAppearance.imagegallery === '1'"
        ref="slickgallery"
        v-bind="slickSettings"
        class="ce-gallery__container"
        :class="'ce-gallery-' + galleryAppearance.imagecols + '-cols'"
      >
        <ce-media-file
          v-for="(img, imgKey) in gallery"
          :key="imgKey"
          class="ce-gallery__item"
          :file="img"
          :gallery-appearance="galleryAppearance"
          :additional-settings="additionalSettings"
        />
      </VueSlickCarousel>

      <ul
        v-if="galleryAppearance.imagecaptionposition === '1'"
        class="ce-gallery__captions"
      >
        <li
          v-for="(item, itemKey) in galleryItemsWithCaption"
          :key="itemKey"
          class="ce-gallery__item-caption"
          :class="{
            currentCaption:
              additionalSettings.audiosync == '1' &&
              item.origKey == slidesCurrentTrackmarker
          }"
        >
          {{ item.origItem.properties.description }}
        </li>
      </ul>
    </div>

    <div v-if="isGalleryAbove" class="ce-gallery__text">
      <slot />
    </div>
    <slot name="after" />
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import CeMediaFile from './File'

export default {
  name: 'MediaGallery',
  components: {
    CeMediaFile,
    VueSlickCarousel
  },
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
  },
  data() {
    return {
      slickSettings: {
        arrows: true,
        dots: true,
        infinite: false,
        speed: 500,
        fade: true,
        adaptiveHeight: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0
      }
    }
  },
  computed: {
    galleryCss() {
      return [
        {
          aboveText:
            this.galleryAppearance.imageorient === '0' ||
            this.galleryAppearance.imageorient === '1' ||
            this.galleryAppearance.imageorient === '2'
        },
        {
          belowText:
            this.galleryAppearance.imageorient === '8' ||
            this.galleryAppearance.imageorient === '9' ||
            this.galleryAppearance.imageorient === '10'
        },
        {
          inText:
            this.galleryAppearance.imageorient === '17' ||
            this.galleryAppearance.imageorient === '18'
        },
        {
          nextToText:
            this.galleryAppearance.imageorient === '25' ||
            this.galleryAppearance.imageorient === '26'
        },
        {
          centerPos:
            this.galleryAppearance.imageorient === '0' ||
            this.galleryAppearance.imageorient === '8'
        },
        {
          rightPos:
            this.galleryAppearance.imageorient === '1' ||
            this.galleryAppearance.imageorient === '9' ||
            this.galleryAppearance.imageorient === '17' ||
            this.galleryAppearance.imageorient === '25'
        },
        {
          leftPos:
            this.galleryAppearance.imageorient === '2' ||
            this.galleryAppearance.imageorient === '10' ||
            this.galleryAppearance.imageorient === '18' ||
            this.galleryAppearance.imageorient === '26'
        },
        `ce-gallery--cols-${this.galleryAppearance.imagecols}`,
        { 'ce-gallery--default': this.galleryAppearance.imagegallery === '0' },
        { 'ce-gallery--slider': this.galleryAppearance.imagegallery === '1' },
        {
          'ce-gallery--stack-horizontal':
            this.galleryAppearance.imagegallery === '8'
        },
        {
          'ce-gallery--stack-vertical':
            this.galleryAppearance.imagegallery === '9'
        },
        {
          'ce-gallery--caption-below':
            this.galleryAppearance.imagecaptionposition === '0'
        },
        {
          'ce-gallery--caption-right':
            this.galleryAppearance.imagecaptionposition === '1'
        },
        {
          'ce-gallery--caption-left':
            this.galleryAppearance.imagecaptionposition === '2'
        },
        {
          'audiosync-active':
            this.additionalSettings.audiosync === '1' &&
            this.isAudiotrackInProgress
        }
      ]
    },
    isGalleryAbove() {
      return !!(
        this.galleryAppearance.imageorient === '0' ||
        this.galleryAppearance.imageorient === '1' ||
        this.galleryAppearance.imageorient === '2' ||
        this.galleryAppearance.imageorient === '17' ||
        this.galleryAppearance.imageorient === '18' ||
        this.galleryAppearance.imageorient === '26'
      )
    },
    galleryItemsWithCaption() {
      const galleryItemsWithCaption = []
      for (let i = 0; i < this.gallery.length; i++) {
        if (
          this.gallery[i].properties &&
          this.gallery[i].properties.description
        ) {
          galleryItemsWithCaption.push({
            origKey: i,
            origItem: this.gallery[i]
          })
        }
      }
      // return this.gallery.filter(function(item) {
      //   return item.properties.description
      // })
      return galleryItemsWithCaption
    },
    slidesCurrentTrackmarker() {
      return this.additionalSettings.audiosync === '1'
        ? this.$store.state.slidesCurrentTrackmarker
        : 0
    },
    isAudiotrackInProgress() {
      return this.additionalSettings.audiosync === '1'
        ? this.$store.state.audiotrackInProgress
        : false
    }
  },
  watch: {
    slidesCurrentTrackmarker(val, newval) {
      // console.log('slidesCurrentTrackmarker changed ', val, newval)
      if (this.additionalSettings.audiosync === '1') {
        /* wenn Variante "Slider" aktiv ist ... */
        if (this.galleryAppearance.imagegallery === '1') {
          this.setSlide(val)
        }
      }
    },
    isAudiotrackInProgress(val) {
      if (val === true) this.setSlide(this.slidesCurrentTrackmarker)
    }
  },
  methods: {
    setSlide(val) {
      let slideNr = val
      if (this.gallery.length < slideNr) slideNr = this.gallery.length - 1
      // const slideNr =
      //   val && this.gallery.length >= val ? val : this.gallery.length
      if (this.$refs.slickgallery) {
        this.$refs.slickgallery.goTo(slideNr)
      }
    }
  }
}
</script>
