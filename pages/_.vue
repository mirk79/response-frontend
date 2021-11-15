<template>
  <div class="pagecontent">
    <be-dynamic
      :page="page.page"
      :content="page.content"
      :type="backendLayout"
    />
  </div>
</template>

<script>
import defaultPage from '../mixins/page/default'
export default {
  name: 'Page',
  mixins: [defaultPage],
  transition(to, from) {
    // console.log(to, from)
    let name = 'default'
    // console.log(to)
    if (to.query.sl) {
      if (to.query.sl === 'nxt') {
        name = 'slide-left'
      } else if (to.query.sl === 'prv') {
        name = 'slide-right'
      }
    }
    return {
      name,
      mode: '' // empty string let in and out transitions perform simultaneously ...
    }
  }
  // transition: {
  //   name: 'slide',
  //   mode: '' // empty string let in and out transitions perform simultaneously ...
  // },
  // loading: {
  //   color: '#ff0000',
  //   height: '10px'
  // }
}
</script>
