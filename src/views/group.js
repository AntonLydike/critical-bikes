class GroupItemView extends BaseView {
  constructor(group) {
    this.group = group;
  }

  getHtml() {
    return `${escapeHtml(group.address)} + `
  }
}
