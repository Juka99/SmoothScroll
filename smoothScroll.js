(function(root) {
    var SmoothScroll = function() {
      var self = this;
  
      this.defaults = {
        wrapperId: 'smoothScroller',
        wrapperDamper: 0.1,
        cancelOnTouch: true
      };
  
      this.validateOptions = function(ops) {
        for (var prop in ops) {
          if (self.defaults.hasOwnProperty(prop)) {
            Object.defineProperty(
              self.defaults,
              prop,
              { value: Object.getOwnPropertyDescriptor(ops, prop).value }
            );
          }
        }
      };
  
      this.wrapperDamper;
      this.wrapperId;
      this.cancelOnTouch;
      this.wrapper;
      this.wrapperOffset = 0;
      this.animateId;
      this.resizing = false;
      this.active = false;
      this.wrapperHeight;
      this.bodyHeight;
    };
  
    SmoothScroll.prototype = {
      init: function(options) {
        if (options) {
          this.validateOptions(options);
        }
  
        this.active = true;
        this.resizing = false;
        this.wrapperDamper = this.defaults.wrapperDamper;
        this.wrapperId = this.defaults.wrapperId;
        this.cancelOnTouch = this.defaults.cancelOnTouch;
  
        this.wrapper = document.getElementById(this.wrapperId);
        this.wrapper.style.position = 'fixed';
        this.wrapper.style.width = '100%';
  
        this.wrapperHeight = this.wrapper.clientHeight;
        document.body.style.height = this.wrapperHeight + 'px';
  
        window.addEventListener('resize', this.resize.bind(this));
        if (this.cancelOnTouch) {
          window.addEventListener('touchstart', this.cancel.bind(this));
        }
        this.wrapperOffset = 0.0;
        this.animateId = window.requestAnimationFrame(this.animate.bind(this));
  
        this.handleAnchorLinks();
      },
  
      wrapperUpdate: function() {
        var scrollY =
          document.scrollingElement != undefined
            ? document.scrollingElement.scrollTop
            : document.documentElement.scrollTop || 0.0;
        this.wrapperOffset += (scrollY - this.wrapperOffset) * this.wrapperDamper;
        this.wrapper.style.transform =
          'translate3d(0,' + -this.wrapperOffset.toFixed(2) + 'px, 0)';
      },
  
      checkResize: function() {
        if (this.wrapperHeight != this.wrapper.clientHeight) {
          this.resize();
        }
      },
  
      resize: function() {
        var self = this;
        if (!self.resizing) {
          self.resizing = true;
          window.cancelAnimationFrame(self.animateId);
          window.setTimeout(function() {
            self.wrapperHeight = self.wrapper.clientHeight;
            if (
              parseInt(document.body.style.height) != parseInt(self.wrapperHeight)
            ) {
              document.body.style.height = self.wrapperHeight + 'px';
            }
            self.animateId = window.requestAnimationFrame(self.animate.bind(self));
            self.resizing = false;
          }, 150);
        }
      },
  
      animate: function() {
        this.checkResize();
        this.wrapperUpdate();
        this.animateId = window.requestAnimationFrame(this.animate.bind(this));
      },
  
      cancel: function(event) {
        if (this.active) {
            window.cancelAnimationFrame(this.animateId);
  
            window.removeEventListener('resize', this.resize);
            window.removeEventListener('touchstart', this.cancel);
            this.wrapper.removeAttribute('style');
            document.body.removeAttribute('style');
  
            this.active = false;
            this.wrapper = '';
            this.wrapperOffset = 0;
            this.resizing = true;
            this.animateId = '';
        }
    },
  
    handleAnchorLinks: function() {
        var self = this;
        var anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(function(link) {
          link.addEventListener('click', function(event) {
            event.preventDefault();
            var targetId = this.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);
            if (targetElement) {
              var navigationHeight = document.querySelector('.navigation').offsetHeight; // Adjust this selector to match your navigation element
              var targetOffsetTop = targetElement.offsetTop - 88;
              if(window.innerWidth <= 992) targetOffsetTop = targetElement.offsetTop;
              window.scrollTo({
                top: targetOffsetTop,
                behavior: 'smooth'
              });
            }
          });
        });
    }
      
      
  };
  
  root.smoothScroll = new SmoothScroll();
  })(this);