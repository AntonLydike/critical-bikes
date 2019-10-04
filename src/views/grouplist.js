class GroupListView extends LazyView {
  constructor(list) {
    if (list) {
      super(Promise.resolve(list));
    } else {
      super(server.get('/groups').then(groups => groups.map(group => new Group(group))))
    }
  }

  getContent(list) {
    if (list.length == 0) {
      return `<div><h1 class="grey-text">Sadly, there don't seem to be any groups at the moment :(</h1></div>`;
    }

    return `<div><h1>Available groups:</h1><div class="group-list-wrapper">${list.map(group => this.placeView(new GroupItemView(group))).join("")}</div></div>`;
  }

  getLoader() {
    return `<div class="center">${this.__lv_loader()}</div>`
  }

  addGroup(group) {
    this.getData().push(group);
    this.redraw();
  }
}
