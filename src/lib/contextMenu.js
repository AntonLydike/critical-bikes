class ContextMenu extends BaseView {
  constructor(options) {
    super();

    this.options = options;

    this.events = {
      'click .context-menu-item': e => {
        let item = e.target.closest('.context-menu-item');
        let index = +item.getAttribute('data-index');

        if (this.options[index] === undefined) {
          return;
        }

        const option = this.options[index];

        if (option.submenu instanceof ContextMenu) {
          let optRect = item.getBoundingClientRect();
          let pos = {
            clientX:optRect.x + optRect.width,
            clientY:optRect.y
          };

          option.submenu.open(pos, this.data).then(resp => {
            this.close();
            this.__res(resp);
            delete this.__rej;
            delete this.__res;
          }).catch(err => null);

          return;
        }

        if (typeof option.action === 'function') {
          this.__res(this.options[index].action(this.data, this.options[index]));
        } else {
          this.__res(null);
        }
        delete this.__rej;
        delete this.__res;
        this.close();
      },
      'click .context-menu-backdrop': e => {
        this.close();
        this.__rej(ContextMenu.WAS_CLOSED);
        delete this.__rej;
        delete this.__res;
      },
      'contextmenu .context-menu-backdrop': e => {
        e.preventDefault()
        this.close();
        this.__rej(ContextMenu.WAS_CLOSED);
        delete this.__rej;
        delete this.__res;
      }
    }
  }

  getHtml() {
    return `<div class="context-menu-backdrop"></div>
    <div class="context-menu z-depth-2">
      ${this.buildOptions()}
    </div>`;
  }

  buildOptions() {
    const data = this.data;
    const get = (field) => escapeHtml(typeof field == 'function' ? field(data) : field)

    return this.options.map((elm, i) => {
      if (elm === ContextMenu.DIVIDER) return '<div class="context-menu-divider"></div>';

      return `<div class="context-menu-item" data-index="${i}">
        ${elm.icon ? `<i class="${elm.icon_color ? get(elm.icon_color) + '-text' : ''} material-icons context-menu-icon">${get(elm.icon)}</i>` : ''}
        <div class="context-menu-item-text">${get(elm.text)}</div>
        ${elm.note ? `<div class="context-menu-item-note">${get(elm.note)}</div>` : ''}
        ${elm.submenu ? `<i class="material-icons context-menu-submenu-icon">chevron_right</i>` : ''}
      </div>`;
    }).join('')
  }

  open(event, data) {
    return new Promise((res, rej) => {
      if (this.__rej) this.__rej(ContextMenu.WAS_CLOSED);

      this.__res = res;
      this.__rej = rej;

      // stop propagation and default actions, if we can
      if (event.preventDefault) event.preventDefault();
      if (event.stopPropagation) event.stopPropagation();

      this.data = data;
      // set preleminary x values
      this.x = event.clientX;
      this.y = event.clientY;

      this.renderInside(document.body);

      let menu = this.$('.context-menu');
      let win = {width: window.innerWidth, height: window.innerHeight}
      let my = menu.getBoundingClientRect();

      if (my.width + this.x > win.width) {
        this.x -= my.width - 3;
      } else {
        this.x -= 3;
      }
      if (my.height + this.y > win.height) {
        this.y -= my.height + 3;
      } else {
        this.y -= 3;
      }

      this.$('.context-menu-backdrop').style.zIndex = ContextMenu.__index++;
      menu.style.zIndex = ContextMenu.__index++;

      menu.style.top = this.y + 'px';
      menu.style.left = this.x + 'px';
    })
  }

  close() {
    this.remove();
  }
}

ContextMenu.DIVIDER = Symbol('ContextMenu.DIVIDER');
ContextMenu.WAS_CLOSED = Symbol('ContextMenu.WAS_CLOSED');

ContextMenu.__index = 100000;
