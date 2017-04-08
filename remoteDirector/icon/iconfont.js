;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-arrow-down" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M532.672 820.84c-0.986 0.531-1.818 1.382-2.835 1.85-18.266 9.030-40.627 6.074-55.315-9.933l-333.434-362.669c-18.17-19.776-17.312-50.957 1.882-69.683 19.226-18.688 49.53-17.843 67.731 1.939l299.226 325.421 303.674-324.134c18.362-19.584 48.666-20.173 67.731-1.286 9.766 9.658 14.656 22.573 14.656 35.482 0 12.32-4.467 24.64-13.414 34.202l-336.672 359.386c-0.672 0.685-1.6 0.947-2.298 1.645-0.48 0.525-0.832 1.082-1.344 1.606-2.842 2.797-6.33 4.275-9.587 6.176v0 0zM532.672 820.84z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-setup" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M896 479.44c-62.874-100.998-61.869-102.906-61.869-102.906s-217.088 58.656-257.51-141.869h-125.76c0 0-34.688 200.845-256.493 141.376-64.122 102.995-66.31 106.214-66.368 106.272 0.090 0.058 173.606 116.902 0 275.565l67.379 106.771c0 0 191.706-79.693 254.49 138.016h127.258c0 0 39.917-200.064 255.501-140.915 61.382-100.986 62.368-101.952 62.368-101.952s-162.746-135.213 1.005-280.358v0zM510.995 760.048c-81.018 0-146.714-63.302-146.714-141.389s65.696-141.402 146.714-141.402c81.030 0 146.733 63.315 146.733 141.402s-65.702 141.389-146.733 141.389v0zM510.995 760.048z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-switch-point" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M128 554.666c0 212.077 171.923 384 384 384s384-171.923 384-384c0-212.077-171.923-384-384-384-212.077 0-384 171.923-384 384z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-classroom-recording" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M862.0672 318.1312 748.8 383.1168 748.8 292.1344c0-17.7472-14.2848-32.1344-31.9168-32.1344L467.2 260l0-40c0-17.6704-14.5344-32-32.4608-32L160.4544 188c-17.9264 0-32.4544 14.3296-32.4544 32l0 72.1344 0 223.8656 0 287.8656c0 17.7408 14.2848 32.1344 31.9168 32.1344l556.96 0c17.632 0 31.9168-14.3872 31.9168-32.1344l0-98.7968 113.2672 64.9856c18.6688 10.7008 33.9328 1.7984 33.9328-19.808L895.9936 337.9328C896 316.3392 880.736 307.424 862.0672 318.1312zM176 236l239.6032 0 0 24L176 260 176 236zM700.8 788l-524.8 0 0-240L176 404.8 176 308l239.6032 0L467.2 308l233.6 0 0 102.656 0 41.9712 0 183.3344 0 41.5744L700.8 788zM859.5136 702.8992c0 10.7968-7.3024 14.7136-16.224 8.6848L748.8 661.44 748.8 427.808l94.4896-48.8576c8.928-6.0096 16.224-2.1056 16.224 8.6976L859.5136 702.8992z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-record-end" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M896 851.39c0 48.205-39.066 87.277-87.277 87.277h-593.453c-48.192 0-87.27-39.066-87.27-87.277v-593.453c0-48.186 39.078-87.27 87.27-87.27h593.453c48.211 0 87.277 39.085 87.277 87.27v593.453z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-close" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M342.677 595.002M612.287 512l300.867 300.867c18.461 18.461 18.461 48.392 0 66.858l-33.429 33.429c-18.461 18.461-48.397 18.461-66.858 0L512 612.287 211.133 913.154c-18.461 18.461-48.392 18.461-66.853 0l-33.434-33.429c-18.461-18.466-18.461-48.397 0-66.858L411.713 512 110.846 211.133c-18.461-18.457-18.461-48.392 0-66.858l33.434-33.429c18.461-18.461 48.392-18.461 66.853 0L512 411.713l300.867-300.867c18.461-18.461 48.397-18.461 66.858 0l33.429 33.429c18.461 18.466 18.461 48.402 0 66.858L612.287 512z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)