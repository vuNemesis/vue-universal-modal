import './style.scss';
import Bus from './utils/bus';
import ModalCmp from './modal';

export default {
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
    };

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