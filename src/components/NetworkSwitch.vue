<template>
  <div class="headerContainer">
    <div>
      <div class="filterDropdownContainer">
        <div>
          <button type="button" v-on:click="isFilterOpen = !isFilterOpen" class="dropdownButton" id="options-menu" aria-expanded="true" aria-haspopup="true">
            Network
            <svg class="arrowIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          class="dropdownContentContainer transform"
          :class="isFilterOpen ? 'dropdownOpen' : 'dropdownClose'"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="filter-menu"
        >
          <div class="dropdownContent" role="none">
            <a href="#" class="dropdownContentItem" role="menuitem">
              Mainnet
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFilterOpen: false,
    };
  },
  computed: {
    style() {
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.headerContainer {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.filterDropdownContainer {
  display: inline-block;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
  position: relative;
  text-align: left;
}

.dropdownButton {
  background-color: rgba(255, 255, 255, 1);
  border-collapse: collapse;
  border-color: rgba(0, 0, 0, 1);
  display: inline-flex;
  justify-content: center;
  font-weight: normal;
  font-size: 20px;
  line-height: 1.25rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.25rem;
  color: rgba(55, 65, 81, 1);
  width: 169px;
  border-width: 2px;

  &:hover {
    background-color: rgba(249, 250, 251, 1);
  }
}

.arrowIcon {
  height: 1.25rem;
  width: 1rem;
  margin-left: 0.5rem;
  margin-right: 0.25rem;
}

.dropdownContentContainer {
  background-color: rgba(255, 255, 255, 1);
  border-color: rgba(0, 0, 0, 1);
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  position: absolute;
  left: 0rem;
  width: 169px;
  z-index: 10;
  transform-origin: top;
}

.transform {
  transform: translateX(0) translateY(0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);
}

.dropdownOpen {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  opacity: 1;
}

.dropdownClose {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  opacity: 0;
}

.dropdownContent {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.dropdownContentItem {
  display: block;
  font-size: 20px;
  line-height: 1.25rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 1rem;
  color: rgba(55, 65, 81, 1);

  &:hover {
    background-color: rgba(243, 244, 246, 1);
    color: rgba(17, 24, 39, 1);
  }
}
</style>
