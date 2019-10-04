class GroupListView extends LazyView {
  constructor(list) {
    if (list) {
      super(Promise.resolve(list));
    } else {
      super(server.get('/groups'))
    }
  }

  getContent(list) {
    return `<div><h1>Available groups:</h1><div class="group-list-wrapper">${list.map(grup => this.placeView(new GroupItemView(group))).join("")}</div></div>`;
  }
}
