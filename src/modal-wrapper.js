import './style.scss'
import Bus from './utils/bus'
import ModalCmp from './modal'

export default {
  name: 'vu-modal-wrapper',
  data () {
    return {
      modals: []
    }
  },
  mounted() {
    if (typeof document !== 'undefined') {
      document.body.addEventListener('keydown', this.handleTabKey)
    }

    if (typeof document !== 'undefined') {
      document.body.addEventListener('keyup', this.handleEscapeKey)
    }
  },
  destroyed() {
    if (typeof document !== 'undefined') {
      document.body.removeEventListener('keydown', this.handleTabKey)
    }

     if (typeof document !== 'undefined') {
      document.body.removeEventListener('keyup', this.handleEscapeKey)
    }
  },
  created() {
    Bus.$on('new', options => {
      const defaults = {
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
        onClose() {},
        onDismiss() {}
      };

      let instance = {}
      let rendered
      if(options.component.template) {
        rendered = false
      } else {
        rendered = options.component.render.call(this, this.$createElement)
      }
        
      if(rendered && rendered.componentOptions && rendered.componentOptions.Ctor.extendOptions.componentName === 'vu-modal') {
        const propsData = rendered.componentOptions.propsData
        instance = {
          isVmodal: true,
          options: Object.assign(defaults, propsData, options)
        }
      } else {
        instance = {
          isVmodal: false,
          options: Object.assign(defaults, options)
        }
      }
      rendered = null

      this.modals.push(instance);

      Bus.$emit('opened', {
        index: this.$last,
        instance
      });

      this.body && this.body.classList.add('modals-open');
    });

    Bus.$on('close', data => {
      let index = null;

      if (data && data.$index)
        index = data.$index;

      if (index === null)
        index = this.$last;

      this.close(data, index);
    });

    Bus.$on('dismiss', index => {
      if (index === null)
        index = this.$last;

      this.dismiss(index);
    });
  },
  methods: {
    splice(index = null) {
      if (index === -1)
        return;

      if (!this.modals.length)
        return;

      if (index === null)
        this.modals.pop();
      else
        this.modals.splice(index, 1);

      if (!this.modals.length) {
        this.body && this.body.classList.remove('modals-open');
        Bus.$emit('destroyed');
      }
    },

    doClose(index) {
      if (!this.modals.length)
        return;

      if (!this.modals[index])
        return;

      this.splice(index);
    },

    close(data = null, index = null) {
      if (this.modals.length === 0)
        return;

      let localIndex = index;

      if (index && typeof index === 'function') {
        localIndex = index(data, this.modals);
      }

      if (typeof localIndex !== 'number')
        localIndex = this.$last;

      Bus.$emit('closed', {
        index: localIndex,
        instance: this.modals[index],
        data
      });

      if (localIndex !== false && this.modals[localIndex]) {
        if(this.modals[localIndex].options.onClose(data) === false) {
          return
        }
      }
      this.doClose(localIndex);
    },

    dismiss(index = null) {
      let localIndex = index;

      if (index && typeof index === 'function')
        localIndex = index(this.$last);

      if (typeof localIndex !== 'number')
        localIndex = this.$last;

      if (this.modals[localIndex].options.onDismiss() === false)
        return;

      Bus.$emit('dismissed', {
        index: localIndex,
        instance: this.modals[localIndex]
      });

      this.doClose(localIndex);
    },

     handleTabKey(e) {
       if (e.keyCode === 9 && this.modals.length) {
         e.preventDefault()
       }
    },

    handleEscapeKey(e) {
      if (e.keyCode === 27 && this.modals.length) {
        if (!this.modals.length)
          return;
        if (this.current.options.escapable)
          this.dismiss();
      }
    }
  },
  computed: {
    current() {
      return this.modals[this.$last];
    },
    $last() {
      return this.modals.length - 1;
    },
    body() {
      if (typeof document !== 'undefined') {
        return document.querySelector('body');
      }
    },
    wrapperStyle() {
      return {
        'z-index': 5000 + this.$last + 1
      }
    }
  },
  render(h) {
    if(!this.modals.length) {
        return null
    };

    let modals = this.modals.map((modal, index) => {
      let modalComponent 

      if(modal.isVmodal) {
        modalComponent = h(modal.options.component, {
          props: Object.assign({}, {vModal: Object.assign(modal.options, { disabled: index != this.$last })}, modal.options.props)
       })
      } else {
        modalComponent = h(ModalCmp, {
          props: Object.assign(modal.options, { disabled: index != this.$last })
        }, [
          h(modal.options.component, { 
            props: modal.options.props
          })
        ])
      }
      return h('div', {
        class: ['vu-modal__mask', {'vu-modal__mask--disabled': index != this.$last }],
        on: {click: () => {modal.options.dismissable && this.dismiss()}},
        key: index
      }, [ 
        modalComponent 
      ])
    })

    return h('div', {
      class: 'vu-modal__wrapper',
    }, [ modals ]) 
  }
};


