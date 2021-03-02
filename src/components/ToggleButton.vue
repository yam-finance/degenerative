<template>
  <label :for="id + '_button'" :class="{ active: isActive }" class="toggle__button">
    <input type="checkbox" :disabled="disabled" :id="id + '_button'" v-model="checkedValue" />
    <span class="toggle__switch"></span>
    <span class="toggle__label">{{ labelText }}</span>
  </label>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: "Toggle",
    },

    id: {
      type: String,
      default: "primary",
    },

    defaultState: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currentState: this.defaultState,
    };
  },

  watch: {
    defaultState: function defaultState() {
      this.currentState = Boolean(this.defaultState);
    },
  },

  computed: {
    // currentState() {
    //     return this.defaultState;
    // },

    isActive() {
      return this.currentState;
    },

    labelText() {
      return this.label;
    },

    checkedValue: {
      get() {
        return this.currentState;
      },

      set(newValue) {
        this.currentState = newValue;
        this.$emit("change", newValue);
      },
    },
  },
};
</script>

<style scoped>
.toggle__label {
  font-family: "Shanti", sans-serif;
}
.toggle__button {
  vertical-align: middle;
  user-select: none;
  cursor: pointer;
}
.toggle__button input[type="checkbox"] {
  opacity: 0;
  position: absolute;
  width: 1px;
  height: 1px;
}
.toggle__button .toggle__switch {
  display: inline-block;
  height: 12px;
  border-radius: 6px;
  width: 40px;
  background: #bfcbd9;
  box-shadow: inset 0 0 1px #bfcbd9;
  position: relative;
  margin-right: 10px;
  transition: all 0.25s;
}

.toggle__button .toggle__switch::after,
.toggle__button .toggle__switch::before {
  content: "";
  position: absolute;
  display: block;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  left: 0;
  top: -3px;
  transform: translateX(0);
  transition: all 0.25s cubic-bezier(0.5, -0.6, 0.5, 1.6);
}

.toggle__button .toggle__switch::after {
  background: #4d4d4d;
  box-shadow: 0 0 1px #666;
}
.toggle__button .toggle__switch::before {
  background: #4d4d4d;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  opacity: 0;
}

.active .toggle__switch {
  background: #f2a29b;
  box-shadow: inset 0 0 1px #f2a29b;
}

.active .toggle__switch::after,
.active .toggle__switch::before {
  transform: translateX(40px - 18px);
}

.active .toggle__switch::after {
  left: 23px;
  background: var(--primary);
  box-shadow: 0 0 1px var(--primary);
}
</style>
