class AppView extends BaseView {
  constructor() {
    super();

    this.events = {
      'click .action-show-impressum': e => {
        new ImpressumDialog();
      }
    }

    this.groupList = new GroupListView();
  }

  getHtml() {
    return `<nav class="primary-fg">
        <div class="nav-wrapper">
          <a class="brand-logo">
            Critical<span class="light">Bikes</span>
          </a>
          <ul class="right hide-on-med-and-down">
            <li><a target="_blank" rel="noopener" href="https://www.radeln-zur-uni.de/">More info</a></li>
          </ul>
        </div>
      </nav>
      <main id="app-view-main">
        <div class="container">
          <div class="beta-reminder">
            This tool is still in early development. Please report bugs on the projects <a target="_blank" rel="noopener" href="https://github.com/AntonLydike/critical-bikes/issues">issues page</a>.
          </div>
          ${this.placeView(this.groupList)}
        </div>

        ${this.placeView(new CreateGroupView(this))}
      </main>
      <footer class="page-footer primary-fg">
          <div class="container">
            <div class="row">
              <div class="col l6 s12">
                <h5 class="grey-text text-lighten-4">About CriticalBikes</h5>
                <p class="grey-text text-lighten-4">CriticalBikes and <a target="_blank" rel="noopener" href="https://www.radeln-zur-uni.de/">radeln-zur-uni.de</a> are initiatives from Studis For Future Augsburg, but feel free to host your own version of this for you local group!</p>
                <p class="grey-text text-lighten-4">This tool is open source (licensed under <a target="_blank" rel="noopener" href="https://www.gnu.org/licenses/agpl-3.0.html">AGPLv3</a>) and still in early development. Please report bugs on the projects <a target="_blank" rel="noopener" href="https://github.com/AntonLydike/critical-bikes/issues">issues page</a>.</p>
              </div>
              <div class="col l4 offset-l2 s12">
                <h5 class="white-text">Links</h5>
                <ul>
                  <li><a target="_blank" rel="noopener" href="https://t.me/studis_for_future_augsburg">Telegram group</a></li>
                  <li><a target="_blank" rel="noopener" href="https://www.radeln-zur-uni.de/">More information</a></li>
                  <li><a target="_blank" rel="noopener" href="https://github.com/AntonLydike/critical-bikes">GitHub</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-copyright">
            <div class="container">
            © ${(new Date()).getFullYear()} Students for Future Augsburg
            <a class="grey-text text-lighten-4 right pointer action-show-impressum">Impressum</a>
            </div>
          </div>
        </footer>`;
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

  addGroup(group) {
    this.groupList.addGroup(group);
  }
}
