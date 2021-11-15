<template>
  <div id="mainnav" class="mainnav">
    <nav
      v-if="
        navigation &&
          navigation.eLearningModules &&
          navigation.eLearningModules.length > 0
      "
      class="nav-modules"
    >
      <h3>{{ $t('e-learning modules') }}</h3>
      <ul class="menu">
        <li
          v-for="(item, key) in navigation.eLearningModules"
          :key="key"
          class="menu-item"
        >
          <nav-link :to="item.link" class="menu-link">
            {{ item.title }}
          </nav-link>
        </li>
      </ul>
    </nav>
    <nav v-if="navigation && navigation.specialPages" class="nav-specialpages">
      <ul class="menu">
        <li v-if="navigation.specialPages.homepage" class="menu-item">
          <nav-link
            :to="navigation.specialPages.homepage.link"
            class="menu-link homepage"
          >
            {{ navigation.specialPages.homepage.title }}
          </nav-link>
        </li>
        <li v-if="navigation.specialPages.glossary" class="menu-item">
          <nav-link
            :to="navigation.specialPages.glossary.link"
            class="menu-link glossary"
          >
            {{ navigation.specialPages.glossary.title }}
          </nav-link>
        </li>
      </ul>
    </nav>
    <nav
      v-if="navigation && navigation.pages && navigation.pages.length > 0"
      class="nav-pages"
    >
      <ul class="menu">
        <li
          v-for="(item, key) in navigation.pages"
          :key="key"
          class="menu-item"
        >
          <nav-link :to="item.link" class="menu-link">{{
            item.title
          }}</nav-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'NavigationMain',
  props: {
    navigation: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
}
</script>
