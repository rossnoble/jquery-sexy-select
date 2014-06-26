/**
 *
 * Sexy Select
 *
 * Wrap a select boxes in a custom ui you can style.
 *
 */
(function ($, window, document, undefined) {

  'use strict';

  $.widget('sexy.sexySelect', {

    options: {
      wrapperClass: 'sexy-select',
      selectTextClass: 'sexy-select-text',
      optionsListClass: 'sexy-select-options',
      activeSelectClass: 'focused',
      activeWrapperClass: 'active-select',
      direction: 'down'
    },

    _currentValue: null,

    _validElement: function () {
      return this.element.get()[0].tagName === 'SELECT';
    },
    
    _create: function () {
      if (!this._validElement()) return;

      var tabIndex   = this.element.attr('tabindex')
        , cssClasses = this.element.data('css-classes');

      // Create wrapper element
      this.$wrapper = $('<div></div>')
          .addClass(this.options.wrapperClass)
          .addClass(cssClasses);

      // Create select text element
      this.$selectText = $('<div></div>')
          .addClass(this.options.selectTextClass)
          .attr('tabindex', tabIndex);
      
      // Wrap select box and 
      this.element
        .hide()
        .wrap(this.$wrapper)
        .removeAttr('tabindex');

      this.element
        .before(this.$selectText)
        .each(function() {
          var selected = $(this).find(':selected');

          if (selected && selected.length) {
            $(this).prev().text((selected.length)
              ? selected.html()
              : this.options[0].innerHTML);
          }
        });

      // Create selectbox options list
      this.$optionsList = $('<ul />').addClass(this.options.optionsListClass).hide();

      // Insert list into DOM
      this.$selectText.after(this.$optionsList);

      this.element.find('option').each($.proxy(function (i, el) { 
        var 
          value     = $(el).val(),
          text      = $(el).text(),
          classes   = $(el).attr('class'),
          dataAttrs = $(el).data(),
          $li       = $('<li />');

          $li.attr('data-value', value)
             .addClass(classes)
             .text(text);

          // Add extra data attributes
          for (var attr in dataAttrs) {
            $li.attr('data-'+attr, dataAttrs[attr]);
          }

        this.$optionsList.append($li);
      }, this));
    },

    _reverseDirection: function () {
      var windowHeight = $(document).height(),
          widgetHeight = this.$optionsList.height(),
          offset       = this.$optionsList.parent().position().top;

      return windowHeight - offset < widgetHeight;
    },

    _bindClickEvents: function () {
      var self = this,
        options = this.options;

      // Open select box
      this.$selectText
        .on('focusin', function (e) {
          $(this)
            .addClass(self.options.activeSelectClass)
            .parent().addClass(self.options.activeWrapperClass);
        })
        .on('focusout blur', function (e) {
          $(this)
            .removeClass(self.options.activeSelectClass)
            .parent().removeClass(self.options.activeWrapperClass);
        })
        .on('click', function (e) {
          e && e.preventDefault();
          
          // Hide other select boxes downdowns that may be open
          $('.'+options.wrapperClass)
            .find('.'+options.selectTextClass)
            .not('.'+options.activeSelectClass)
            .siblings('.'+options.optionsListClass)
            .hide();

          if (options.direction == "up" || self._reverseDirection()) {
            self.$optionsList.addClass('direction-up');
            self.$optionsList.append(self.$optionsList.find('li.active'));
          }

          self.$optionsList.toggle();
          self.isOpen = true;
        });

      // Select item in select box
      this.$optionsList.find('li').on('click', function () {
        var $li    = $(this)
          , value  = $li.data('value')
          , text   = $li.text();
        
        $li.addClass('active').siblings().removeClass('active');

        self.element.val(value);
        self.$selectText.text(text);
        self.$optionsList.hide();
        self._updateSelectBoxValue(value);
      });
      
      // Trigger close when clicking outside of dropdown
      $('html').on('click.sexy', function (e) {
        if ( ! $(e.target).parents().hasClass(self.options.wrapperClass)) {
          self.$optionsList.hide();
          self.$wrapper.removeClass(self.options.activeWrapperClass);
        }
      });
    },

    _updateSelectBoxValue: function (value) {
      var $e = this.element;

      $e.find('option[selected]').removeAttr('selected');
      $e.find('option[value="'+value+'"]').attr('selected', 'selected');
      $e.trigger('change');
    },

    _updateSelectedUI: function (text) {
      this.$selectText.text(text);
    },

    _listenForElementChanges: function () {
      this.element.on('change', $.proxy(function () {
        var value = this._currentValue = this.element.val(),
          text = this.element.find('option[value="'+value+'"]').first().text();

        this._updateSelectedUI(text);
      }, this));
    },

    _bindKeyboardEvents: function () {
      var self = this;

      $('body').on('keydown', function (e) {
        var $focused = $(document.activeElement);
        
        if (e.keyCode == $.ui.keyCode['TAB']) {
          self.$optionsList.hide();
        } 

        if (e.keyCode == $.ui.keyCode['SPACE']) {
          if ($focused.hasClass(self.options.selectTextClass)) {
            e && e.preventDefault();
            $focused.click();
          }
        }

        if (e.keyCode == $.ui.keyCode['ESC']) {
          self.$optionsList.hide();
        }
      });
    },

    _bindTabEvents: function () {
      var self = this;

      // All elements need to have the tabindex attribute set
      $('body').on('keydown', '[tabindex]', function(e) {
        
        // TAB
        if (e.keyCode == $.ui.keyCode['TAB']) {
          var $this = $(this)
            , target
            , index = parseInt($this.attr('tabindex'));

          e && e.preventDefault();

          self.$optionsList.hide();
          
          if (e.shiftKey) {
            target = index - 1;
          } else {
            target = index + 1;
          }
          
          $('[tabindex="'+target+'"]').focus();
        }
      })
    },

    _init: function () {
      if (!this._validElement()) return;

      this._listenForElementChanges();
      this._bindClickEvents();
      this._bindTabEvents();
      this._bindKeyboardEvents();
    }

  });

})(jQuery, window, document);
