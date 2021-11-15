<template>
  <div class="ce-structured-content">
    <ce-header v-bind="$props" />
    <div
      class="grid"
      :class="[
        structure.layout ? 'gridlayout_' + structure.layout : '',
        getFlexforms.grid_option_flexbox == '1' ? 'flexbox' : ''
      ]"
    >
      <div
        v-for="(column, key) in structure.rows[0].columns"
        :key="key"
        class="gridcolumn"
        :class="getFlexforms.columnClassesStrings[key]"
      >
        <!-- <ce-dynamic
          v-for="(element, elKey) in column.elements"
          :key="elKey"
          :index="elKey"
          :data="element"
          :type="element.type"
        /> -->
        <ce-renderer :content="column.elements" />
      </div>
    </div>
  </div>
</template>
<script>
import baseCe from '~typo3/components/content/mixins/baseCe'
// import CeDynamic from '~typo3/components/content/CeDynamic'
export default {
  name: 'CeStructuredContent',
  components: {
    // CeDynamic
  },
  extends: baseCe,
  props: {
    additionalSettings: {
      type: [Object, Array],
      required: false,
      default: () => {}
    },
    structure: {
      type: Object,
      required: false,
      default: () => {}
    },
    appearance: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  computed: {
    getFlexforms() {
      const flexforms = {}
      if (this.appearance.flexforms) {
        flexforms.columnClassesStrings = []
        for (const key in this.appearance.flexforms) {
          flexforms[key] = this.appearance.flexforms[key]
          if (key.startsWith('column') === true) {
            const columnClasses = flexforms[key].split('#')
            if (flexforms.columnClassesStrings.length) {
              for (const stringKey in columnClasses) {
                flexforms.columnClassesStrings[stringKey] +=
                  ' ' + columnClasses[stringKey]
              }
            } else {
              flexforms.columnClassesStrings = columnClasses
            }
          }
        }
      }
      return flexforms
    }
  }
}
</script>
