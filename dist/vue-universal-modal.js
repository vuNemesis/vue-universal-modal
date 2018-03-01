(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.VueUniversalModal = global.VueUniversalModal || {})));
}(this, (function (exports) { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var EventBus = function () {
  function EventBus() {
    _classCallCheck(this, EventBus);

    if (!instance) {
      this.events = {};
      instance = this;
    }
    return instance;
  }

  _createClass(EventBus, [{
    key: "$emit",
    value: function $emit(event, message) {
      if (!this.events[event]) return;
      var callbacks = this.events[event];
      for (var i = 0, l = callbacks.length; i < l; i++) {
        var callback = callbacks[i];
        callback.call(this, message);
      }
    }
  }, {
    key: "$on",
    value: function $on(event, callback) {
      if (!this.events[event]) this.events[event] = [];
      this.events[event].push(callback);
    }
  }]);

  return EventBus;
}();

var Bus = new EventBus();

var CloseIcon = {
  name: 'close-icon',
  functional: true,
  render: function render(h) {
    return h('svg', {
      attrs: {
        width: '12px',
        height: '12px',
        viewBox: '0 0 12 12',
        xmlSpace: 'preserve'
      }
    }, [h('line', {
      attrs: {
        x1: 1,
        y1: 11,
        x2: 11,
        y2: 1
      },
      style: {
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }
    }), h('line', {
      attrs: {
        x1: 1,
        y1: 1,
        x2: 11,
        y2: 11
      },
      style: {
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }
    })]);
  }
};

var ModalCmp = {
  name: 'vu-modal',
  componentName: 'vu-modal',
  props: {
    title: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    isScroll: {
      type: Boolean,
      default: false
    },
    escapable: {
      type: Boolean,
      default: false
    },
    dismissable: {
      type: Boolean,
      default: true
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    isTop: {
      type: Boolean,
      default: false
    },
    isBottom: {
      type: Boolean,
      default: false
    },
    isLeft: {
      type: Boolean,
      default: false
    },
    isRight: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md'
    },
    bodyPadding: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    propsData: function propsData() {
      return this.$parent.$vnode.data.props && this.$parent.$vnode.data.props.vModal ? this.$parent.$vnode.data.props.vModal : this.$props;
    }
  },
  render: function render(h) {
    var _this = this;

    var _propsData = this.propsData,
        dismissable = _propsData.dismissable,
        title = _propsData.title,
        isScroll = _propsData.isScroll,
        fullscreen = _propsData.fullscreen,
        isTop = _propsData.isTop,
        isBottom = _propsData.isBottom,
        isLeft = _propsData.isLeft,
        isRight = _propsData.isRight,
        center = _propsData.center,
        size = _propsData.size,
        className = _propsData.className,
        bodyPadding = _propsData.bodyPadding;


    var closeBtn = dismissable ? h('div', {
      class: 'vu-modal__close-btn',
      on: {
        click: function click() {
          _this.$modals.dismiss();
        }
      }
    }, [h(CloseIcon)]) : null;

    var headerContent = this.$slots.header ? this.$slots.header : title ? h('span', { class: ['vu-modal__cmp-header-title'] }, title) : null;

    var header = headerContent ? h('div', {
      class: ['vu-modal__cmp-header']
    }, [headerContent]) : null;

    var body = h('div', {
      class: ['vu-modal__cmp-body'],
      style: {
        overflowY: isScroll ? 'auto' : null,
        padding: bodyPadding ? '1em' : 0
      }
    }, [this.$slots.default]);

    var footer = this.$slots.footer ? h('div', {
      class: ['vu-modal__cmp-footer']
    }, [this.$slots.footer]) : null;

    var style = {};
    var translateX = '-50%';
    var translateY = '0';
    if (center) {
      translateX = '-50%';
      translateY = '-50%';
    }
    if (isRight || isLeft) {
      translateX = '0%';
    }

    if ((isTop || isBottom) && !isScroll && !center) {
      translateY = '0%';
    }
    style.transform = 'translate(' + translateX + ', ' + translateY + ')';

    return h('div', {
      style: style,
      class: ['vu-modal__cmp', {
        'vu-modal__cmp--is-fullscreen': fullscreen,
        'vu-modal__cmp--is-center': center,
        'vu-modal__cmp--is-top': isTop && !isScroll && !center,
        'vu-modal__cmp--is-bottom': isBottom && !isScroll && !center,
        'vu-modal__cmp--is-left': isLeft,
        'vu-modal__cmp--is-right': isRight
      }, isScroll && fullscreen && 'vu-modal__cmp--is-scroll-fullscreen', isScroll && !fullscreen && 'vu-modal__cmp--is-scroll', !fullscreen && 'vu-modal__cmp--' + size, className],
      on: { click: function click(event) {
          event.stopPropagation();
        } }
    }, [closeBtn, header, body, footer]);
  }
};

var modalWrapper = {
  name: 'vu-modal-wrapper',
  data: function data() {
    return {
      modals: []
    };
  },
  mounted: function mounted() {
    if (typeof document !== 'undefined') {
      document.body.addEventListener('keyup', this.handleEscapeKey);
    }
  },
  destroyed: function destroyed() {
    if (typeof document !== 'undefined') {
      document.body.removeEventListener('keyup', this.handleEscapeKey);
    }
  },
  created: function created() {
    var _this = this;

    Bus.$on('new', function (options) {
      var defaults = {
        title: '',
        dismissable: true,
        center: false,
        fullscreen: false,
        isTop: false,
        isBottom: false,
        isLeft: false,
        isRight: false,
        isScroll: false,
        className: '',
        size: 'md',
        escapable: false,
        bodyPadding: true,
        onClose: function onClose() {},
        onDismiss: function onDismiss() {}
      };

      var instance = {};
      var rendered = void 0;
      if (options.component.template) {
        rendered = false;
      } else {
        rendered = options.component.render.call(_this, _this.$createElement);
      }

      if (rendered && rendered.componentOptions && rendered.componentOptions.Ctor.extendOptions.componentName === 'vu-modal') {
        var propsData = rendered.componentOptions.propsData;
        instance = {
          isVmodal: true,
          options: Object.assign(defaults, propsData, options)
        };
      } else {
        instance = {
          isVmodal: false,
          options: Object.assign(defaults, options)
        };
      }
      rendered = null;

      _this.modals.push(instance);

      Bus.$emit('opened', {
        index: _this.$last,
        instance: instance
      });

      _this.body && _this.body.classList.add('modals-open');
    });

    Bus.$on('close', function (data) {
      var index = null;

      if (data && data.$index) index = data.$index;

      if (index === null) index = _this.$last;

      _this.close(data, index);
    });

    Bus.$on('dismiss', function (index) {
      if (index === null) index = _this.$last;

      _this.dismiss(index);
    });
  },

  methods: {
    splice: function splice() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (index === -1) return;

      if (!this.modals.length) return;

      if (index === null) this.modals.pop();else this.modals.splice(index, 1);

      if (!this.modals.length) {
        this.body && this.body.classList.remove('modals-open');
        Bus.$emit('destroyed');
      }
    },
    doClose: function doClose(index) {
      if (!this.modals.length) return;

      if (!this.modals[index]) return;

      this.splice(index);
    },
    close: function close() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (this.modals.length === 0) return;

      var localIndex = index;

      if (index && typeof index === 'function') {
        localIndex = index(data, this.modals);
      }

      if (typeof localIndex !== 'number') localIndex = this.$last;

      Bus.$emit('closed', {
        index: localIndex,
        instance: this.modals[index],
        data: data
      });

      if (localIndex !== false && this.modals[localIndex]) {
        if (this.modals[localIndex].options.onClose(data) === false) {
          return;
        }
      }
      this.doClose(localIndex);
    },
    dismiss: function dismiss() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var localIndex = index;

      if (index && typeof index === 'function') localIndex = index(this.$last);

      if (typeof localIndex !== 'number') localIndex = this.$last;

      if (this.modals[localIndex].options.onDismiss() === false) return;

      Bus.$emit('dismissed', {
        index: localIndex,
        instance: this.modals[localIndex]
      });

      this.doClose(localIndex);
    },
    handleEscapeKey: function handleEscapeKey(e) {
      if (e.keyCode === 27 && this.modals.length) {
        if (!this.modals.length) return;
        if (this.current.options.escapable) this.dismiss();
      }
    }
  },
  computed: {
    current: function current() {
      return this.modals[this.$last];
    },
    $last: function $last() {
      return this.modals.length - 1;
    },
    body: function body() {
      if (typeof document !== 'undefined') {
        return document.querySelector('body');
      }
    },
    wrapperStyle: function wrapperStyle() {
      return {
        'z-index': 5000 + this.$last + 1
      };
    }
  },
  render: function render(h) {
    var _this2 = this;

    if (!this.modals.length) {
      return null;
    }

    var modals = this.modals.map(function (modal, index) {
      var modalComponent = void 0;

      if (modal.isVmodal) {
        modalComponent = h(modal.options.component, {
          props: Object.assign({}, { vModal: Object.assign(modal.options, { disabled: index != _this2.$last }) }, modal.options.props)
        });
      } else {
        modalComponent = h(ModalCmp, {
          props: Object.assign(modal.options, { disabled: index != _this2.$last })
        }, [h(modal.options.component, {
          props: modal.options.props
        })]);
      }
      return h('div', {
        class: ['vu-modal__mask', { 'vu-modal__mask--disabled': index != _this2.$last }],
        on: { click: function click() {
            modal.options.dismissable && _this2.dismiss();
          } },
        key: index
      }, [modalComponent]);
    });

    return h('div', {
      class: 'vu-modal__wrapper'
    }, [modals]);
  }
};

var VuModal = {};
VuModal.install = function (Vue) {
  Vue.prototype.$modals = new Vue({
    name: '$modals',

    created: function created() {
      var _this = this;

      Bus.$on('opened', function (data) {
        _this.$emit('modals:opened', data);
      });

      Bus.$on('closed', function (data) {
        _this.$emit('modals:closed', data);
      });

      Bus.$on('destroyed', function (data) {
        _this.$emit('modals:destroyed', data);
      });

      this.$on('new', function (options) {
        _this.open(options);
      });

      this.$on('close', function (data) {
        _this.close(data);
      });

      this.$on('dismiss', function (index) {
        _this.dismiss(index || null);
      });
    },


    methods: {
      open: function open() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        Bus.$emit('new', options);
      },
      close: function close() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        Bus.$emit('close', data);
      },
      dismiss: function dismiss() {
        var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        Bus.$emit('dismiss', index);
      }
    }
  });

  Vue.mixin({
    created: function created() {
      this.$on('modals:new', function (options) {
        Bus.$emit('new', options);
      });

      this.$on('modals:close', function (data) {
        Bus.$emit('close', data);
      });

      this.$on('modals:dismiss', function (index) {
        Bus.$emit('dismiss', index);
      });
    }
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VuModal);
}

exports['default'] = VuModal;
exports.ModalWrapper = modalWrapper;
exports.Modal = ModalCmp;
exports.Bus = Bus;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vue-universal-modal.js.map
