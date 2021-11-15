// Content element wrapper - Section Frame
import CeFrame from '~typo3/components/content/CeFrame'
// All props are returned from appearance
export default {
  extends: CeFrame,
  // functional: true,
  props: {
    additionalSettings: {
      type: [Object, Array],
      required: false,
      default: () => {}
    }
    // content: {
    //   type: Object,
    //   required: true,
    //   default: () => {}
    // }
    // frameClass: {
    //   type: String,
    //   required: false,
    //   default: ''
    // },
    // layout: {
    //   type: String,
    //   required: false,
    //   default: 'default'
    // },
    // spaceAfter: {
    //   type: String,
    //   required: false,
    //   default: 'default'
    // },
    // spaceBefore: {
    //   type: String,
    //   required: false,
    //   default: 'default'
    // }
  },
  render(createElement, ctx) {
    return createElement(
      'div',
      {
        class: [
          'ce-frame',
          // `frame-${ctx.props.frameClass}`,
          `layout-${ctx.props.layout}`,
          `space-before-${
            ctx.props.spaceBefore.length ? ctx.props.spaceBefore : 'default'
          }`,
          `space-after-${
            ctx.props.spaceAfter.length ? ctx.props.spaceAfter : 'default'
          }`,
          `${
            ctx.props.additionalSettings &&
            ctx.props.additionalSettings.audiosync &&
            ctx.props.additionalSettings.audiosync === '1'
              ? 'audiosynced'
              : ''
          }`
        ]
      },
      ctx.children
    )
  }
}
