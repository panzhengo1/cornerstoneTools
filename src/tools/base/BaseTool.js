import mixins from './../../mixins/index.js';
import MouseCursor from './../../util/MouseCursor.js';

/**
 * @typedef ToolConfiguration
 * @param {String} name
 * @param {object} strategies - Named strategy functions
 * @param {String} defaultStrategy - The name of the strategy to use by default
 * @param {Object} configuration
 * @param {String[]} mixins - A list of mixin names to apply to the tool
 */

/**
 * @memberof Tools.Base
 * @classdesc BaseTool Class description
 * @property {String[]} supportedInteractionTypes - A string list of ways the tool can interact with the user
 */
class BaseTool {
  /**
   * Constructor description
   * @param {ToolConfiguration} [ToolConfiguration={}]
   */
  constructor({
    name,
    strategies,
    defaultStrategy,
    configuration,
    supportedInteractionTypes,
    mixins,
    svgCursor,
  } = {}) {
    /**
     * A unique, identifying tool name
     * @type {String}
     */
    this.name = name;

    /** @type {String} */
    this.mode = 'disabled';
    this.element = undefined;
    this.supportedInteractionTypes = supportedInteractionTypes || [];

    this.strategies = strategies || {};
    this.defaultStrategy =
      defaultStrategy || Object.keys(this.strategies)[0] || undefined;
    this.activeStrategy = this.defaultStrategy;

    if (svgCursor) {
      this.svgCursor = new MouseCursor(svgCursor);
    }

    // Options are set when a tool is added, during a "mode" change,
    // Or via a tool's option's setter
    this._options = {};
    // Configuration is set at tool initalization
    this._configuration = Object.assign({}, configuration);

    // True if tool has a canvas cursor, causes the frame to render on every mouse move when the tool is active.
    this.hasCanvasCursor = false;
    this.hideDefaultCursor = false;

    // Apply mixins if mixinsArray is not empty.
    if (mixins && mixins.length) {
      this._applyMixins(mixins);
    }
  }

  //
  // CONFIGURATION
  //

  /**
   * Config...
   * @public
   * @type {Object}
   * @instance
   */
  static get configuration() {}

  get configuration() {
    return this._configuration;
  }

  set configuration(configuration) {
    this._configuration = configuration;
  }

  //
  // OPTIONS
  //

  /**
   * Options...
   * @readonly
   * @instance
   */
  get options() {
    return this._options;
  }

  /**
   * Merges provided options with existing options.
   *
   * @public
   * @instance
   * @param {Object} options - options object to merge with existing options.
   * @returns {undefined}
   */
  mergeOptions(options) {
    this._options = Object.assign({}, this._options, options);
  }

  /**
   * Clears the tools options.
   *
   * @public
   * @instance
   * @memberof Tools.Base.BaseTool
   * @returns {undefined}
   */
  clearOptions() {
    this._options = {};
  }

  /**
   * Apply the currently set/active strategy.
   *
   * @public
   * @instance
   * @method applyActiveStrategy
   * @memberof Tools.Base.BaseTool
   *
   * @param {*} evt The event that triggered the strategies application
   * @returns {*} strategies vary widely; check each specific strategy to find expected return value
   */
  applyActiveStrategy(evt) {
    return this.strategies[this.activeStrategy](evt, this.configuration);
  }

  /**
   * Iterates over registered mixins; any matching names in the provided `mixinsArray` will
   * be merged with this instance.
   *
   * @private
   * @method _applyMixins
   * @param {string[]} mixinsArray An array of mixin identifiers (strings).
   * @returns {undefined}
   */
  _applyMixins(mixinsArray) {
    for (let i = 0; i < mixinsArray.length; i++) {
      const mixin = mixins[`${mixinsArray[i]}`];

      if (typeof mixin === 'object') {
        Object.assign(this, mixin);
      } else {
        console.warn(`${this.name}: mixin ${mixins[i]} does not exist.`);
      }
    }
  }

  // ===================================================================
  // Virtual Methods - Have default behavior but may be overriden.
  // ===================================================================

  //
  // MOUSE
  //

  /**
   * Callback that takes priority if the tool is active, before `MOUSE_DOWN`
   * events are processed. Does nothing by default.
   *
   * @callback BaseTool~preMouseDownCallback
   * @param  {CornerstoneTools.event:cornerstonetoolsmousedown} evt
   * @returns {boolean} consumedEvent - True if function consumed the event.
   */
  /**
   * Callback that takes priority if the tool is active, after `MOUSE_DOWN`
   * events are processed. Does nothing by default.
   *
   * @callback BaseTool~postMouseDownCallback
   * @param  {CornerstoneTools.event:cornerstonetoolsmousedown} evt
   * @returns {boolean} consumedEvent - True if function consumed the event.
   */

  /**
   * Callback that is called if the tool is active, after `MOUSE_DOWN`
   * events are processed. Does nothing by default.
   *
   * @virtual
   * @param  {type} evt
   * @returns {boolean} consumedEvent - True if function consumed the event.
   */
  /**
   * Example implementation:
   *
   * postMouseDownCallback(evt) {
   *    return false;
   * }
   */

  /**
   * Callback that takes priority if the tool is active, before `TOUCH_START`
   * events are processed. Does nothing by default.
   *
   * @virtual
   * @param  {type} evt
   * @returns {boolean} consumedEvent - True if function consumed the event.
   */
  /**
   * Example implementation:
   *
   * preTouchStartCallback(evt) {
   *    return false;
   * }
   */

  /**
   * Callback that is called if the tool is active, after `TOUCH_START`
   * events are processed. Does nothing by default.
   *
   * @virtual
   * @param  {type} evt
   * @returns {boolean} consumedEvent - True if function consumed the event.
   */
  /**
   * Example implementation:
   *
   * postTouchStartCallback(evt) {
   *    return false;
   * }
   */
}

export default BaseTool;
