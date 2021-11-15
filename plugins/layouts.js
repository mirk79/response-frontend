import Vue from 'vue'
import { registerBackendLayouts } from '~typo3/plugins/layouts'
import BeDefault from '~/layouts/backend/BeDefault'
import BeSlideTitle from '~/layouts/backend/BeSlideTitle'
import BeSlideStd from '~/layouts/backend/BeSlideStd'
import BePageMain from '~/layouts/backend/BePageMain'
import BePageSub from '~/layouts/backend/BePageSub'
import BeGlossary from '~/layouts/backend/BeGlossary'

const layouts = {
  BeDefault,
  BeSlideTitle,
  BeSlideStd,
  BePageMain,
  BePageSub,
  BeGlossary
}

export default ({ app }) => {
  Vue.use(registerBackendLayouts, {
    context: app,
    layouts
  })
}
