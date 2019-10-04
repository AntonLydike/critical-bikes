/**
 * This is the base view class. It handles the creation of the DomNode and attaching events, etc.
 */
class BaseView {
    constructor() {
        // an array holding the definition of all events that should be attached to this view (should be set by subclasses)
        this.events = {};
        // views that are embedded. don't touch this, use placeView to embed views
        this.__subViews = {};
        // list of nodes this object created last time it was rendered (used to re-render views)
        this.____nodes = [];
        // link to the parent view, if it was embedded.
        this.__parentView = null;
    }

    /**
     * return wether or not the view is currently being rendered
     */
    isRendered() {
      return this.____nodes.length > 0 && document.body.contains(this.____nodes[0]);
    }

    /**
     * redraw this view and replace the old html
     */
    redraw() {
        if (!this.isRendered()) return;
        let nodeArr = Array.from(this.____nodes);
        let old = nodeArr.pop();
        if (!old) throw new Error("Cannot redraw view that isn't drawn yet!");
        nodeArr.forEach(elm => elm.remove())

        this.__renderReplaceWith(old);
    }

    /**
     * Render the view inside a dom node
     * @param root {HTMLElement}
     */
    renderInside(root) {
        let node = this.__getNode();
        this.____nodes = Array.from(node.childNodes);
        node.childNodes.forEach(child => root.appendChild(child));

        // call the DOM inserted event handler
        this.__triggerDOMInsertedEvent()
    }

    /**
     * render the view in place of a placeholder (anchor) element
     * @param anchor {HTMLElement}
     * @param parent {BaseView}
     * @private
     */
    __renderReplaceWith(anchor, parent) {
        let node = this.__getNode();
        this.____nodes = Array.from(node.childNodes);
        if (parent !== undefined) {
          this.__parentView = parent;
        }
        anchor.replaceWith(...node.childNodes);

        // call the DOM inserted event handler
        this.__triggerDOMInsertedEvent()
    }

    __triggerDOMInsertedEvent() {
      if (!this.isRendered()) return;

      this.rendered();

      Object.values(this.__subViews).forEach(view => view.__triggerDOMInsertedEvent());

    }

    /**
     * generates a html node wich contains all view nodes, with events attached and sub-views inserted
     * @returns {HTMLElement}
     * @protected
     */
    __getNode() {
        // clear previous subview to prevent 'memory leaks' (accumulation over time)
        this.__subViews = {};

        let node = document.createElement("div");
        node.innerHTML = this.getHtml();

        // insert sub-views
        for (let [id, view] of Object.entries(this.__subViews)) {
            node.querySelectorAll('.' + id).forEach(anchor => view.__renderReplaceWith(anchor, this));
        }

        // register event listeners
        for (let [key, listener] of Object.entries(this.events)) {
            let [type, target] = key.split(" ");
            if (!target) continue;
            node.querySelectorAll(target).forEach(element => element.addEventListener(type, listener));
        }

        return node;
    }

    /**
     * Create a html string from wich the view will be constructed
     * @returns {string}
     */
    getHtml() {
        return `<h1>this node forgot to declare getHtml()</h1>`;
    }

    /**
     * place a view inside this view, with events and everyting
     * @param view {BaseView}
     */
    placeView(view) {
        if (!(view instanceof BaseView)) throw new Error("Cannot embed non BaseView object into view!");

        // generate a unique id
        let id;
        do {
            // super quick way of generating unique-enough strings
            id = 'subview-' + ((Math.random() * 10**8) + window.performance.now()).toString(36).replace('.','-')
        } while (this.__subViews[id] !== undefined);

        // save view and id to replace them later
        this.__subViews[id] = view;
        // return a "bookmark" so we can find the place later where we want to insert it
        return `<div class="${id}"></div>`;
    }

    /**
     * Get the parent view, if this view is embedded into another view, otherwise null
     * @returns {null}
     */
    getParentView() {
        return this.__parentView;
    }

    /**
     * search dom nodes of this view for all nodes which match the selector
     * @param selector
     * @returns {Array}
     */
    $$(selector) {
        let results = [];
        this.____nodes.forEach(node => {
            if (typeof node.matches == 'function' && node.matches(selector)) results.push(node);

            if (typeof node.querySelectorAll == 'function') {
                results.push(...node.querySelectorAll(selector));
            }
        });
        return results;
    }

    /**
     * search dom nodes of this view for a single node which matches selector
     * @param selector
     * @returns {Array}
     */
    $(selector) {
        let result = null;

        this.____nodes.forEach(node => {
            if (result) return;

            if (typeof node.matches == 'function' && node.matches(selector)) return result = node;

            if (typeof node.querySelector == 'function') {
                if (result = node.querySelector(selector)) {
                  return false;
                }
            }
        });
        return result;
    }

    /**
     * Remove view completely from DOM
     */
    remove() {
        this.____nodes.forEach(node => {
            node.remove();
        })
    }

    /**
     * called **once** per DOM insertion
     */
    rendered() { }
}
