// Vue directive for handling outside clicks.

import Vue from "vue";

// Reference to the document's click handler.
let handleOutsideClick;

export const OutsideClick = {
  // Called only once, when the directive is first bound to the element.
  // el: The element the directive is bound to.
  // binding: An object containing useful properties
  // vnode: Virtual DOM.
  bind(el, binding, vnode) {
    // Click / Touchstart handler.
    handleOutsideClick = e => {
      e.stopPropagation();

      // Get excluded elements and the name of the handler method.
      const { handler, exclude } = binding.value;

      let isClickedElementExcluded = false;

      exclude.forEach(refName => {
        if (!isClickedElementExcluded) {
          // Get the element using the reference name.
          const excludedElement = vnode.context.$refs[refName];
          // Check if this excluded element is the same element that was just clicked.
          isClickedElementExcluded = excludedElement.contains(e.target);
        }
      });

      // Check if the clicked element is not the dropdown element and was not excluded.
      if (!el.contains(e.target) && !isClickedElementExcluded) {
        // Call the outside-click handler.
        vnode.context[handler]();
      }
    };

    // Register event listeners on the whole page.
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
  },

  // Called only once, when the directive is unbound from the element.
  unbind() {
    // Remove event listeners from the whole page after removal of the v-outside-click element.
    document.removeEventListener("click", handleOutsideClick);
    document.removeEventListener("touchstart", handleOutsideClick);
  },
};

Vue.directive("outside-click", OutsideClick);
