(function ($) {

      $(function () {
        var googleCSEWatermark = function (id) {
          var f = $(id)[0];
          if (f && (f.query || f['edit-search-block-form--2'] || f['edit-keys'])) {
            var q = f.query ? f.query : (f['edit-search-block-form--2'] ? f['edit-search-block-form--2'] : f['edit-keys']);
            var n = navigator;
            var l = location;
            if (n.platform == 'Win32') {
              //q.style.cssText = 'border: 1px solid #7e9db9; padding: 2px;';
            }
            var b = function () {
              if (q.value == '') {
                q.style.background = '#FFFFFF url(https://www.google.com/cse/intl/' + Drupal.settings.googleCSE.language + '/images/google_custom_search_watermark.gif) left no-repeat';
              }
            };
            var f = function () {
              q.style.background = '#ffffff';
            };
            q.onfocus = f;
            q.onblur = b;
            b();
          }
        };
        googleCSEWatermark('#search-block-form.google-cse');
        googleCSEWatermark('#search-form.google-cse');
        googleCSEWatermark('#google-cse-results-searchbox-form');
      });
    })(jQuery);
    ;
    document.addEventListener('click', function (event) {
          if (event.target.matches('.ns-switcher_selected')) {
                var that = document.querySelector(".ns-switcher_selected");
                // this.classList.toggle("ns-switcher--is-open");
                if (that.classList) { 
                    that.classList.toggle("ns-switcher--is-open");
                } else {
                    // For IE9
                    var classes = that.className.split(" ");
                    var i = classes.indexOf("ns-switcher--is-open");
    
                    if (i >= 0) 
                        classes.splice(i, 1);
                    else 
                        classes.push("ns-switcher--is-open");
                        that.className = classes.join(" "); 
                }
          }
    
    }, false);;
    /**
     * @file
     * Lazyloader JQuery plugin
     *
     * @author: Daniel Honrade http://drupal.org/user/351112
     *
     * Settings:
     * - distance = distance of the image to the viewable browser screen before it gets loaded
     * - icon     = animating image that appears before the actual image is loaded
     *
     */
    
    (function($){
    
      // Process lazyloader
      $.fn.lazyloader = function(options){
        var settings = $.extend($.fn.lazyloader.defaults, options);
        var images = this;
    
        // add the loader icon
        if(settings['icon'] != '') $('img[data-src]').parent().css({ position: 'relative', display: 'block'}).prepend('<img class="lazyloader-icon" src="' + settings['icon'] + '" />');
    
        // Load on refresh
        loadActualImages(images, settings);
    
        // Load on scroll
        $(window).bind('scroll', function(e){
          loadActualImages(images, settings);
        });
    
        // Load on resize
        $(window).resize(function(e){
          loadActualImages(images, settings);
        });
    
        return this;
      };
    
      // Defaults
      $.fn.lazyloader.defaults = {
        distance: 0, // the distance (in pixels) of image when loading of the actual image will happen
        icon: '',    // display animating icon
      };
    
    
      // Loading actual images
      function loadActualImages(images, settings){
        images.each(function(){
          var imageHeight = $(this).height(), imageWidth = $(this).width();
          var iconTop = Math.round(imageHeight/2), iconLeft = Math.round(imageWidth/2), iconFactor = Math.round($(this).siblings('img.lazyloader-icon').height()/2);
          $(this).siblings('img.lazyloader-icon').css({ top: iconTop - iconFactor, left: iconLeft - iconFactor });
    
          if (windowView(this, settings) && ($(this).attr('data-src'))){
            loadImage(this);
            $(this).fadeIn('slow');
          }
        });
      };
    
    
      // Check if the images are within the window view (top, bottom, left and right)
      function windowView(image, settings){
    
            // window variables
        var windowHeight = $(window).height(),
            windowWidth  = $(window).width(),
    
            windowBottom = windowHeight + $(window).scrollTop(),
            windowTop    = windowBottom - windowHeight,
            windowRight  = windowWidth + $(window).scrollLeft(),
            windowLeft   = windowRight - windowWidth,
    
            // image variables
            imageHeight  = $(image).height(),
            imageWidth   = $(image).width(),
    
            imageTop     = $(image).offset().top - settings['distance'],
            imageBottom  = imageTop + imageHeight + settings['distance'],
            imageLeft    = $(image).offset().left - settings['distance'],
            imageRight   = imageLeft + imageWidth + settings['distance'];
    
               // This will return true if any corner of the image is within the screen 
        return (((windowBottom >= imageTop) && (windowTop <= imageTop)) || ((windowBottom >= imageBottom) && (windowTop <= imageBottom))) &&
               (((windowRight >= imageLeft) && (windowLeft <= imageLeft)) || ((windowRight >= imageRight) && (windowLeft <= imageRight)));
      };
    
    
      // Load the image
      function loadImage(image){
        $(image).hide().attr('src', $(image).data('src')).removeAttr('data-src');
        $(image).load(function(){
          $(this).siblings('img.lazyloader-icon').remove();
        });
      };
    
    })(jQuery);
    ;
    /**
     * @file
     */
    
    (function ($) {
    
    Drupal.admin = Drupal.admin || {};
    Drupal.admin.behaviors = Drupal.admin.behaviors || {};
    Drupal.admin.hashes = Drupal.admin.hashes || {};
    
    /**
     * Core behavior for Administration menu.
     *
     * Test whether there is an administration menu is in the output and execute all
     * registered behaviors.
     */
    Drupal.behaviors.adminMenu = {
      attach: function (context, settings) {
        // Initialize settings.
        settings.admin_menu = $.extend({
          suppress: false,
          margin_top: false,
          position_fixed: false,
          tweak_modules: false,
          tweak_permissions: false,
          tweak_tabs: false,
          destination: '',
          basePath: settings.basePath,
          hash: 0,
          replacements: {}
        }, settings.admin_menu || {});
        // Check whether administration menu should be suppressed.
        if (settings.admin_menu.suppress) {
          return;
        }
        var $adminMenu = $('#admin-menu:not(.admin-menu-processed)', context);
        // Client-side caching; if administration menu is not in the output, it is
        // fetched from the server and cached in the browser.
        if (!$adminMenu.length && settings.admin_menu.hash) {
          Drupal.admin.getCache(settings.admin_menu.hash, function (response) {
              if (typeof response == 'string' && response.length > 0) {
                $('body', context).append(response);
              }
              var $adminMenu = $('#admin-menu:not(.admin-menu-processed)', context);
              // Apply our behaviors.
              Drupal.admin.attachBehaviors(context, settings, $adminMenu);
              // Allow resize event handlers to recalculate sizes/positions.
              $(window).triggerHandler('resize');
          });
        }
        // If the menu is in the output already, this means there is a new version.
        else {
          // Apply our behaviors.
          Drupal.admin.attachBehaviors(context, settings, $adminMenu);
        }
      }
    };
    
    /**
     * Collapse fieldsets on Modules page.
     */
    Drupal.behaviors.adminMenuCollapseModules = {
      attach: function (context, settings) {
        if (settings.admin_menu.tweak_modules) {
          $('#system-modules fieldset:not(.collapsed)', context).addClass('collapsed');
        }
      }
    };
    
    /**
     * Collapse modules on Permissions page.
     */
    Drupal.behaviors.adminMenuCollapsePermissions = {
      attach: function (context, settings) {
        if (settings.admin_menu.tweak_permissions) {
          // Freeze width of first column to prevent jumping.
          $('#permissions th:first', context).css({ width: $('#permissions th:first', context).width() });
          // Attach click handler.
          $modules = $('#permissions tr:has(td.module)', context).once('admin-menu-tweak-permissions', function () {
            var $module = $(this);
            $module.bind('click.admin-menu', function () {
              // @todo Replace with .nextUntil() in jQuery 1.4.
              $module.nextAll().each(function () {
                var $row = $(this);
                if ($row.is(':has(td.module)')) {
                  return false;
                }
                $row.toggleClass('element-hidden');
              });
            });
          });
          // Collapse all but the targeted permission rows set.
          if (window.location.hash.length) {
            $modules = $modules.not(':has(' + window.location.hash + ')');
          }
          $modules.trigger('click.admin-menu');
        }
      }
    };
    
    /**
     * Apply margin to page.
     *
     * Note that directly applying marginTop does not work in IE. To prevent
     * flickering/jumping page content with client-side caching, this is a regular
     * Drupal behavior.
     */
    Drupal.behaviors.adminMenuMarginTop = {
      attach: function (context, settings) {
        if (!settings.admin_menu.suppress && settings.admin_menu.margin_top) {
          $('body:not(.admin-menu)', context).addClass('admin-menu');
        }
      }
    };
    
    /**
     * Retrieve content from client-side cache.
     *
     * @param hash
     *   The md5 hash of the content to retrieve.
     * @param onSuccess
     *   A callback function invoked when the cache request was successful.
     */
    Drupal.admin.getCache = function (hash, onSuccess) {
      if (Drupal.admin.hashes.hash !== undefined) {
        return Drupal.admin.hashes.hash;
      }
      $.ajax({
        cache: true,
        type: 'GET',
        dataType: 'text', // Prevent auto-evaluation of response.
        global: false, // Do not trigger global AJAX events.
        url: Drupal.settings.admin_menu.basePath.replace(/admin_menu/, 'js/admin_menu/cache/' + hash),
        success: onSuccess,
        complete: function (XMLHttpRequest, status) {
          Drupal.admin.hashes.hash = status;
        }
      });
    };
    
    /**
     * TableHeader callback to determine top viewport offset.
     *
     * @see toolbar.js
     */
    Drupal.admin.height = function () {
      var $adminMenu = $('#admin-menu');
      var height = $adminMenu.outerHeight();
      // In IE, Shadow filter adds some extra height, so we need to remove it from
      // the returned height.
      if ($adminMenu.css('filter') && $adminMenu.css('filter').match(/DXImageTransform\.Microsoft\.Shadow/)) {
        height -= $adminMenu.get(0).filters.item("DXImageTransform.Microsoft.Shadow").strength;
      }
      return height;
    };
    
    /**
     * @defgroup admin_behaviors Administration behaviors.
     * @{
     */
    
    /**
     * Attach administrative behaviors.
     */
    Drupal.admin.attachBehaviors = function (context, settings, $adminMenu) {
      if ($adminMenu.length) {
        $adminMenu.addClass('admin-menu-processed');
        $.each(Drupal.admin.behaviors, function () {
          this(context, settings, $adminMenu);
        });
      }
    };
    
    /**
     * Apply 'position: fixed'.
     */
    Drupal.admin.behaviors.positionFixed = function (context, settings, $adminMenu) {
      if (settings.admin_menu.position_fixed) {
        $adminMenu.addClass('admin-menu-position-fixed');
        $adminMenu.css('position', 'fixed');
      }
    };
    
    /**
     * Move page tabs into administration menu.
     */
    Drupal.admin.behaviors.pageTabs = function (context, settings, $adminMenu) {
      if (settings.admin_menu.tweak_tabs) {
        var $tabs = $(context).find('ul.tabs.primary');
        $adminMenu.find('#admin-menu-wrapper > ul').eq(1)
          .append($tabs.find('li').addClass('admin-menu-tab'));
        $(context).find('ul.tabs.secondary')
          .appendTo('#admin-menu-wrapper > ul > li.admin-menu-tab.active')
          .removeClass('secondary');
        $tabs.remove();
      }
    };
    
    /**
     * Perform dynamic replacements in cached menu.
     */
    Drupal.admin.behaviors.replacements = function (context, settings, $adminMenu) {
      for (var item in settings.admin_menu.replacements) {
        $(item, $adminMenu).html(settings.admin_menu.replacements[item]);
      }
    };
    
    /**
     * Inject destination query strings for current page.
     */
    Drupal.admin.behaviors.destination = function (context, settings, $adminMenu) {
      if (settings.admin_menu.destination) {
        $('a.admin-menu-destination', $adminMenu).each(function () {
          this.search += (!this.search.length ? '?' : '&') + Drupal.settings.admin_menu.destination;
        });
      }
    };
    
    /**
     * Apply JavaScript-based hovering behaviors.
     *
     * @todo This has to run last.  If another script registers additional behaviors
     *   it will not run last.
     */
    Drupal.admin.behaviors.hover = function (context, settings, $adminMenu) {
      // Delayed mouseout.
      $('li.expandable', $adminMenu).hover(
        function () {
          // Stop the timer.
          clearTimeout(this.sfTimer);
          // Display child lists.
          $('> ul', this)
            .css({left: 'auto', display: 'block'})
            // Immediately hide nephew lists.
            .parent().siblings('li').children('ul').css({left: '-999em', display: 'none'});
        },
        function () {
          // Start the timer.
          var uls = $('> ul', this);
          this.sfTimer = setTimeout(function () {
            uls.css({left: '-999em', display: 'none'});
          }, 400);
        }
      );
    };
    
    /**
     * Apply the search bar functionality.
     */
    Drupal.admin.behaviors.search = function (context, settings, $adminMenu) {
      // @todo Add a HTML ID.
      var $input = $('input.admin-menu-search', $adminMenu);
      // Initialize the current search needle.
      var needle = $input.val();
      // Cache of all links that can be matched in the menu.
      var links;
      // Minimum search needle length.
      var needleMinLength = 2;
      // Append the results container.
      var $results = $('<div />').insertAfter($input);
    
      /**
       * Executes the search upon user input.
       */
      function keyupHandler() {
        var matches, $html, value = $(this).val();
        // Only proceed if the search needle has changed.
        if (value !== needle) {
          needle = value;
          // Initialize the cache of menu links upon first search.
          if (!links && needle.length >= needleMinLength) {
            // @todo Limit to links in dropdown menus; i.e., skip menu additions.
            links = buildSearchIndex($adminMenu.find('li:not(.admin-menu-action, .admin-menu-action li) > a'));
          }
          // Empty results container when deleting search text.
          if (needle.length < needleMinLength) {
            $results.empty();
          }
          // Only search if the needle is long enough.
          if (needle.length >= needleMinLength && links) {
            matches = findMatches(needle, links);
            // Build the list in a detached DOM node.
            $html = buildResultsList(matches);
            // Display results.
            $results.empty().append($html);
          }
        }
      }
    
      /**
       * Builds the search index.
       */
      function buildSearchIndex($links) {
        return $links
          .map(function () {
            var text = (this.textContent || this.innerText);
            // Skip menu entries that do not contain any text (e.g., the icon).
            if (typeof text === 'undefined') {
              return;
            }
            return {
              text: text,
              textMatch: text.toLowerCase(),
              element: this
            };
          });
      }
    
      /**
       * Searches the index for a given needle and returns matching entries.
       */
      function findMatches(needle, links) {
        var needleMatch = needle.toLowerCase();
        // Select matching links from the cache.
        return $.grep(links, function (link) {
          return link.textMatch.indexOf(needleMatch) !== -1;
        });
      }
    
      /**
       * Builds the search result list in a detached DOM node.
       */
      function buildResultsList(matches) {
        var $html = $('<ul class="dropdown admin-menu-search-results" />');
        $.each(matches, function () {
          var result = this.text;
          var $element = $(this.element);
    
          // Check whether there is a top-level category that can be prepended.
          var $category = $element.closest('#admin-menu-wrapper > ul > li');
          var categoryText = $category.find('> a').text()
          if ($category.length && categoryText) {
            result = categoryText + ': ' + result;
          }
    
          var $result = $('<li><a href="' + $element.attr('href') + '">' + result + '</a></li>');
          $result.data('original-link', $(this.element).parent());
          $html.append($result);
        });
        return $html;
      }
    
      /**
       * Highlights selected result.
       */
      function resultsHandler(e) {
        var $this = $(this);
        var show = e.type === 'mouseenter' || e.type === 'focusin';
        $this.trigger(show ? 'showPath' : 'hidePath', [this]);
      }
    
      /**
       * Closes the search results and clears the search input.
       */
      function resultsClickHandler(e, link) {
        var $original = $(this).data('original-link');
        $original.trigger('mouseleave');
        $input.val('').trigger('keyup');
      }
    
      /**
       * Shows the link in the menu that corresponds to a search result.
       */
      function highlightPathHandler(e, link) {
        if (link) {
          var $original = $(link).data('original-link');
          var show = e.type === 'showPath';
          // Toggle an additional CSS class to visually highlight the matching link.
          // @todo Consider using same visual appearance as regular hover.
          $original.toggleClass('highlight', show);
          $original.trigger(show ? 'mouseenter' : 'mouseleave');
        }
      }
    
      // Attach showPath/hidePath handler to search result entries.
      $results.delegate('li', 'mouseenter mouseleave focus blur', resultsHandler);
      // Hide the result list after a link has been clicked, useful for overlay.
      $results.delegate('li', 'click', resultsClickHandler);
      // Attach hover/active highlight behavior to search result entries.
      $adminMenu.delegate('.admin-menu-search-results li', 'showPath hidePath', highlightPathHandler);
      // Attach the search input event handler.
      $input.bind('keyup search', keyupHandler);
    };
    
    /**
     * @} End of "defgroup admin_behaviors".
     */
    
    })(jQuery);
    ;