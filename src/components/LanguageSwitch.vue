<template>
  <div>
    <div>
      <select v-model="lang" class="locale-changer">
        <option v-for="(lang, i) in langArray" :key="`lang${i}`" :value="lang">
          {{ lang }}
        </option>
      </select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.locale-changer {
  cursor: pointer;
  background: var(--back-wallet);
  color: var(--text-wallet);
  display: block;
  line-height: 1.5rem;
  margin-top: 0.25rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 2.5rem;
  width: 100%;
  height: 36px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 14px;

  @media (max-width: 800px) {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}
</style>
<script>
import store from "@/store";
import { languages } from "@/plugins/i18n";

export default {
  data() {
    return {
      langArray: languages,
    };
  },
  props: {
    size: Number,
  },
  computed: {
    style() {
      return null;
    },
    lang: {
      get: function() {
        return store.state.lang;
      },
      set: function(value) {
        store.dispatch("updateLang", { lang: value });
      },
    },
  },
};
</script>
