class AppView extends BaseView {
  constructor() {
    super();

    this.events = {

    }

    this.mainView = new GroupListView();

  }

  getHtml() {
    return `<div class="app-layout">
      <nav class="primary-fg">
        <div class="nav-wrapper">
          <a class="brand-logo">
            Critical<span class="light">Bikes</span>
          </a>
        </div>

      </nav>
      <div id="app-view-main" class="container">
        ${this.placeView(this.mainView)}
        ${this.placeView(new CreateGroupView(this))}
      </div>
    </div>`;
  }

  start(server, rootNode) {
    this.server = server;
    this.renderInside(rootNode);
    this.attachEvents();
  }

  renderView(view) {
    if (this.mainView && this.isRendered()) {
      this.mainView.remove();
    }
    this.mainView = view;

    // when view removed, don't try and render it
    if (!view) return;

    if (this.isRendered()) {
      this.mainView.renderInside(this.$('#app-view-main'));
    }
  }

  attachEvents() {
    this.$$('.dropdown-trigger').forEach(elm => M.Dropdown.init(elm, {
      constrainWidth: elm.classList.contains('constrain-width'),
      coverTrigger: elm.classList.contains('cover-trigger')
    }))
  }

  redraw() {
    super.redraw();
    this.attachEvents();
  }
}
