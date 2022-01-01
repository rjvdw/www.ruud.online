'use strict'

const fs = require('fs/promises')
const path = require('path')

/**
 * @callback FsWatcherHandler
 * @param { eventType: string, filename: string }
 * @return {Promise<void>}
 */

/**
 * @typedef FsWatcherHandlerEvent
 * @type object
 * @property {string} eventType The type of the event.
 * @property {string} filename  The file for which this event triggered.
 */

/**
 * Watches a specified path and executes a handler everytime something changes within this path.
 */
class FsWatcher {
  #abortController
  #handler
  #watchPath
  #started = false

  /**
   * Initializes a `FsWatcher` on a path with a handler.
   *
   * @param {string}           watchPath This is the path that is being watched.
   * @param {FsWatcherHandler} handler   For every change, this handler will be called.
   */
  constructor(watchPath, handler) {
    this.#abortController = new AbortController()
    this.#handler = handler
    this.#watchPath = watchPath
  }

  /**
   * Starts the watcher.
   */
  start() {
    if (!this.#started) {
      this.#startWatcher().catch(err => console.error(err))
    }
  }

  /**
   * Stops the watcher.
   */
  stop() {
    this.#abortController.abort()
  }

  async #startWatcher() {
    try {
      this.#started = true
      console.log(`[fs watcher] start watching ${ this.#watchPath }`)
      const watcher = fs.watch(this.#watchPath, {
        signal: this.#abortController.signal,
        recursive: true,
        encoding: 'utf8',
      })
      for await (const event of watcher) {
        await this.#handler(event)
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      }
      throw err
    } finally {
      console.log(`[fs watcher] stop watching ${ this.#watchPath }`)
      this.#started = false
    }
  }
}

module.exports = FsWatcher
