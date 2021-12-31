(() => {
  'use strict'

  whenReady(() => {
    // initialize all async stylesheets
    for (const preload of document.querySelectorAll('link[data-async-stylesheet="true"]')) {
      const stylesheet = preload.cloneNode()
      delete stylesheet.dataset.asyncStylesheet
      stylesheet.removeAttribute('as')
      stylesheet.rel = 'stylesheet'
      preload.after(stylesheet)
    }
  })

  /**
   * Execute the callback when the DOM is ready.
   *
   * @param callback The callback to execute when the DOM is ready.
   */
  function whenReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener(
        'DOMContentLoaded',
        () => callback(),
        { once: true, passive: true },
      )
    } else {
      callback()
    }
  }
})()
