<template>
  <div class="ce-mask-prognosetool">
    <ce-header v-bind="$props" />
    <p>
      Cascader? Table? Striped Table? Descriptions? Collapse? >Accordion?
      <button class="addOptionsSet" @click="addOptionsSet()">
        add options set
      </button>
    </p>

    <div class="optionsSetsContainer">
      <div v-for="(item, index) in optionsSets" :key="index" class="optionsSet">
        <p :style="'background-color: ' + item.color + ';'">
          Item {{ index }} / key {{ item.key }}: {{ item.location }} –
          {{ item.agegrp }} – {{ item.variant }} – {{ item.gender }} –
          {{ item.disease }}
        </p>

        <el-select v-model="item.location" placeholder="Select">
          <el-option
            v-for="option in options.location"
            :key="option"
            :label="option"
            :value="option"
          >
          </el-option>
        </el-select>
        <el-select v-model="item.agegrp" placeholder="Select">
          <el-option
            v-for="option in options.agegrp"
            :key="option"
            :label="option"
            :value="option"
          >
          </el-option>
        </el-select>
        <el-select v-model="item.variant" placeholder="Select">
          <el-option
            v-for="option in options.variant"
            :key="option"
            :label="option"
            :value="option"
          >
          </el-option>
        </el-select>
        <el-select v-model="item.gender" placeholder="Select">
          <el-option
            v-for="option in options.gender"
            :key="option"
            :label="option"
            :value="option"
          >
          </el-option>
        </el-select>
        <el-select v-model="item.disease" placeholder="Select">
          <el-option
            v-for="option in options.disease"
            :key="option"
            :label="'disease ' + option"
            :value="option"
          >
          </el-option>
        </el-select>

        <button class="removeOptionsSet" @click="removeOptionsSet(item.key)">
          remove set
        </button>
      </div>
    </div>

    <hr />

    <div class="linechartContainer">
      <div :id="'linechart_' + id" class="linechart"></div>
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3'
// import { csvParse } from 'd3-dsv'
import baseCe from '~typo3/components/content/mixins/baseCe'

export default {
  name: 'CeMaskPrognosetool',
  extends: baseCe,
  props: {
    additionalSettings: {
      type: [Object, Array],
      required: false,
      default: () => {}
    },
    datafile_countries: {
      type: Array,
      required: false,
      default: () => []
    },
    datafile_diseases: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      csvdataCountries: null,
      csvdataDiseasesValues: null,
      csvdataDiseases: null,
      options: {
        location: [],
        agegrp: [],
        disease: [],
        variant: ['low', 'medium', 'high'],
        gender: ['female', 'male', 'total']
      },
      optionsSets: [],
      optionsSetsMaxAmount: 8,
      linechart: null
    }
  },
  computed: {
    chartValues() {
      const ret = []
      for (const optionSet of this.optionsSets) {
        if (
          optionSet &&
          optionSet.location &&
          optionSet.agegrp &&
          optionSet.disease &&
          optionSet.variant &&
          optionSet.gender &&
          optionSet.color
        ) {
          // den richtigen Datensatz aus csvdataCountries raus suchen
          // und alle Werte darin mit dem richtigen Wert
          // aus csvdataDiseases multiplizieren ...
          const filteredData = this.csvdataCountries.filter((item) => {
            return (
              item.agegrp === optionSet.agegrp &&
              item.location === optionSet.location &&
              item.variant === optionSet.variant
            )
          })
          const factor = this.csvdataDiseases[optionSet.agegrp][
            optionSet.disease
          ][optionSet.gender]
          const calculatedData = []
          for (const item of filteredData) {
            calculatedData.push({
              time: item.time,
              amount: item[optionSet.gender] * factor
            })
          }
          // vorbereitete Daten ins ret array ...
          ret.push({
            location: optionSet.location,
            agegrp: optionSet.agegrp,
            disease: optionSet.disease,
            variant: optionSet.variant,
            gender: optionSet.gender,
            color: optionSet.color,
            chartData: calculatedData
          })
        }
      }
      return ret
    },
    lowestChartValue() {
      let lowestCountryValue = 0
      let lowestDiseaseValue = 0
      if (this.csvdataCountries) {
        lowestCountryValue = this.csvdataCountries.reduce((prevVal, cur) => {
          const curFemale = parseFloat(cur.female)
          const curMale = parseFloat(cur.male)
          const curVal = curFemale < curMale ? curFemale : curMale
          return prevVal < curVal ? prevVal : curVal
        })
        if (this.csvdataDiseasesValues) {
          lowestDiseaseValue = this.csvdataDiseasesValues.reduce(
            (prev, cur) => {
              return cur < prev ? cur : prev
            }
          )
        }
      }
      // return { lowestCountryValue, lowestDiseaseValue }
      return lowestCountryValue * lowestDiseaseValue
    },
    highestChartValue() {
      let highestCountryValue = 0
      let highestDiseaseValue = 0
      if (this.csvdataCountries) {
        highestCountryValue = this.csvdataCountries.reduce((prevVal, cur) => {
          const curVal = parseFloat(cur.total)
          return prevVal > curVal ? prevVal : curVal
        })
        if (this.csvdataDiseasesValues) {
          highestDiseaseValue = this.csvdataDiseasesValues.reduce(
            (prev, cur) => {
              return cur > prev ? cur : prev
            }
          )
        }
      }
      // return { highestCountryValue, highestDiseaseValue }
      return highestCountryValue * highestDiseaseValue
    }
  },
  /**
   * Problem mit d3 v7.1.1:
   * Must use import to load ES Module: /var/www/html/front/node_modules/d3/src/index.js
   * require() of ES modules is not supported.
   * require() of /var/www/html/front/node_modules/d3/src/index.js
   * from /var/www/html/front/node_modules/vue-server-renderer/build.dev.js
   * is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module"
   * which defines all .js files in that package scope as ES modules.
   * Instead rename index.js to end in .cjs,
   * change the requiring code to use import(),
   * or remove "type": "module" from /var/www/html/front/node_modules/d3/package.json.
   */
  async mounted() {
    // console.log('Prognosetool is mounted :)')
    // console.log(d3)
    // console.log(csvParse)
    // console.log(process)
    // console.log(context)
    // if (process.browser) {
    //   console.log(process.browser)
    // }

    // erste Datei ...
    const dataurlCountries =
      this.datafile_countries &&
      this.datafile_countries[0] &&
      this.datafile_countries[0].publicUrl
        ? this.datafile_countries[0].publicUrl
        : ''
    // const csvdata = await d3.csv(dataurl)
    const csvdataCountries = await d3.csv(dataurlCountries, (data) => {
      // console.log(data)
      if (!this.options.location.includes(data.location))
        this.options.location.push(data.location)
      if (!this.options.agegrp.includes(data.agegrp))
        this.options.agegrp.push(data.agegrp)
      return {
        location: data.location,
        variant: data.variant.toLowerCase(),
        time: data.time,
        agegrp: data.agegrp,
        male: data.popmale,
        female: data.popfemale,
        total: data.poptotal
      }
    })
    // console.log(csvdata)
    // console.log(this.options)
    this.csvdataCountries = csvdataCountries
    // this.options = options

    // zweite Datei ...
    const dataurlDiseases =
      this.datafile_diseases &&
      this.datafile_diseases[0] &&
      this.datafile_diseases[0].publicUrl
        ? this.datafile_diseases[0].publicUrl
        : ''
    const sortedCsvdataDiseases = {}
    const diseasesValuesOnly = []
    await d3.csv(dataurlDiseases, (data) => {
      // rawData.push(data)
      const sortedData = {}
      for (const key in data) {
        if (key.startsWith('disease_')) {
          diseasesValuesOnly.push(parseFloat(data[key]))
          const keySplit = key.split('_')
          // console.log(keySplit)
          if (!this.options.disease.includes(keySplit[1]))
            this.options.disease.push(keySplit[1])
          if (!(keySplit[1] in sortedData)) {
            sortedData[keySplit[1]] = {}
          }
          sortedData[keySplit[1]][keySplit[2]] = data[key]
        }
      }
      sortedCsvdataDiseases[data.agegrp] = sortedData
    })
    // console.log(sortedCsvdata2)
    this.csvdataDiseasesValues = diseasesValuesOnly
    this.csvdataDiseases = sortedCsvdataDiseases

    // generate linechart ...
    this.generateLinechart(this.testvalues)
  },
  beforeDestroy() {
    if (this.linechart) {
      // console.log(this.linechart)
      this.linechart.select('svg').remove()
      this.linechart = null
      // console.log(this.linechart)
    }
  },
  methods: {
    generateLinechart(data) {
      // const w = '100%'
      // const h = '100%'
      // const linmork
      this.linechart = d3.select('#linechart_' + this.$props.id).append('svg')
      // .attr('width', w)
      // .attr('height', h)
    },
    generateColor() {
      // just a first test
      // return '#3399ff'

      const goldenRatioConjugate = 0.618033988749895
      let h = Math.random()

      const hslToRgb = function(h, s, l) {
        let r, g, b

        if (s === 0) {
          r = g = b = l // achromatic
        } else {
          function hue2rgb(p, q, t) {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
          }

          const q = l < 0.5 ? l * (1 + s) : l + s - l * s
          const p = 2 * l - q
          r = hue2rgb(p, q, h + 1 / 3)
          g = hue2rgb(p, q, h)
          b = hue2rgb(p, q, h - 1 / 3)
        }

        return (
          '#' +
          Math.round(r * 255).toString(16) +
          Math.round(g * 255).toString(16) +
          Math.round(b * 255).toString(16)
        )
      }

      h += goldenRatioConjugate
      h %= 1
      return hslToRgb(h, 0.5, 0.6)
    },
    addOptionsSet() {
      console.log('add options set')
      // console.log(Object.keys(this.optionsSetModel).length)
      // if (Object.keys(this.optionsSets).length < this.optionsSetsMaxAmount) {
      if (this.optionsSets.length < this.optionsSetsMaxAmount) {
        console.log('here we go')
        // generate key
        let key = null
        for (let i = this.optionsSetsMaxAmount; i >= 1; i--) {
          const hasKey = this.optionsSets.findIndex((o) => o.key === i)
          if (hasKey === -1) key = i
          // if (!('optionsSet_' + i in this.optionsSets)) {
          //   key = i
          // }
        }
        // // generate color
        // const color = this.generateColor()
        // add model ...
        // const newOptionsSet = this.optionsSetModel
        // newOptionsSet.color = this.generateColor()
        const newOptionsSet = {
          key,
          color: this.generateColor(),
          location: '',
          agegrp: '',
          disease: '',
          variant: '',
          gender: ''
        }

        // if (key) {
        // newOptionsSet.key = key
        // this.optionsSets['optionsSet_' + key] = newOptionsSet
        this.optionsSets.push(newOptionsSet)
        // console.log(this.optionsSets)
        // this.$forceUpdate()
        // }
      } else {
        console.log('too much items ...')
      }
      /**
       * optionsSetModel: {
       *  color: '',
       *  location: '',
       *  agegrp: '',
       *  disease: '',
       *  variant: '',
       *  gender: ''
       * },
       * optionsSets: {},
       * optionsSetsMax: 8,
       */
    },
    removeOptionsSet(key) {
      console.log('remove options set', key)
      const indexToRemove = this.optionsSets.findIndex((o) => o.key === key)
      if (indexToRemove !== -1) {
        this.optionsSets.splice(indexToRemove, 1)
      }
    }
  }
}
</script>
