import Vue from 'vue'

import CeFrame from '~/components/content/CeFrame'

import CeText from '~/components/content/elements/CeText'
import CeImage from '~/components/content/elements/CeImage'
import CeTextpic from '~/components/content/elements/CeTextpic'
import CeTextmedia from '~/components/content/elements/CeTextmedia'
import CeUploads from '~/components/content/elements/CeUploads'

import CeStructuredContent from '~/components/content/elements/CeStructuredContent'
// import CeMaskAudiotrack from '~/components/content/elements/CeMaskAudiotrack'
import CeMaskPrognosetool from '~/components/content/elements/CeMaskPrognosetool'

const components = {
  CeFrame,
  CeText,
  CeTextpic,
  CeTextmedia,
  CeImage,
  CeUploads,
  CeStructuredContent,
  // CeMaskAudiotrack,
  CeMaskPrognosetool
}

export default ({ app }) => {
  Object.keys(components).forEach((key) => {
    Vue.component(key, components[key])
  })
}
