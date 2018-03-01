import Bus from './utils/bus';
import ModalWrapper from './modal-wrapper';
import Modal from './modal';

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

export default VuModal;

export { ModalWrapper, Modal, Bus };