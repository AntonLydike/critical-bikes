class LazyView extends BaseView {
  constructor(promise) {
    super();
    this.__lv_data = null;

    if (promise && promise.then && typeof promise.then == 'function' && promise.catch && typeof promise.catch == 'function') {
      this.waitFor(promise, 'initial');
    } else {
      this.__lv_data = promise;
      this.__lv_error = false;
      this.__lv_loading = false;
      this.__lv_resource = 'initial';
    }

  }

  waitFor(promise, resource) {
    this.__lv_loading = true;
    this.__lv_resource = resource;
    this.redraw();

    let current = this.__lv_promise = promise.catch(err => {
      // discard result, if we started loading something else already
      if (current !== this.__lv_promise) throw new Error('Promise was aborted');
      this.__lv_loading = false;
      this.__lv_error = err;
      this.redraw();
      throw err;
    }).then(resp => {
      // discard result, if we started loading something else already
      if (current !== this.__lv_promise) throw new Error('Promise was aborted');
      this.__lv_loading = false;
      this.__lv_data = resp;
      this.__lv_error = false;
      this.redraw();
      return resp;
    })

    return current;
  }

  isLoading() {
    return this.__lv_loading;
  }

  getHtml() {
    if (this.__lv_loading) {
      return this.getLoader(this.__lv_resource);
    } else if (this.__lv_error) {
      return this.getError(this.__lv_error, this.__lv_resource);
    } else {
      return this.getContent(this.__lv_data, this.__lv_resource);
    }
  }

  /**
   * Replace with your own loader
   */
  getLoader() {
    return this.__lv_loader();
  }

  getError(err) {
    console.error(err);
    return `<pre class="red-text">${escapeHtml(JSON.stringify(err, true, '  '))}</pre>`;
  }

  getContent(data) {
    return `<pre>${escapeHtml(JSON.stringify(data, true, '  '))}</pre>`;
  }

  __lv_loader() {
    return `<div class="ring-loader"></div>`
  }

  getData() {
    return this.__lv_data;
  }
}
