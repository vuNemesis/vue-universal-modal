import CloseIcon from './close-icon';
export default {
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