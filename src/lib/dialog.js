class BaseDialog extends BaseView {
    constructor(buttons, width) {
        super();
        this.__bd_buttons = buttons || [];
        this.__bd_width = width || 400;
    }

    getHtml() {
        return `<div class="modal" style="max-width: ${escapeHtml(this.__bd_width)}px">
    <div class="modal-content">
      ${this.getContent()}
    </div>
    ${this.__bd_buttons.length > 0 ? `
      <div class="modal-footer">
        ${this.getButtons()}
      </div>` : ''}
  </div>`;
    }

    open() {
        this.renderInside(document.body);
        this.instance = M.Modal.init(this.____nodes[0], {
            onCloseEnd: () => {
                this.close();
            }
        });
        this.instance.open();
        this.opened();

        // focus first autofocus input field that we find
        if (this.$('input[autofocus]')) this.$('input[autofocus]').focus();

        M.updateTextFields();
    }

    close() {
        this.instance.close();

        setTimeout(() => {
          this.instance.destroy();
          this.remove();
        }, this.instance.options.outDuration || 250);
    }

    getContent() {
        return `Error, please overwrite getContent in your modal!`;
    }

    getButtons() {
        return this.__bd_buttons.map(btn => `<a id="${btn.id || ''}" class="${btn.close === false ? '' : 'modal-close'} waves-effect waves-${btn.color} btn-flat">${btn.text}</a>`).join('\n')
    }

    opened() {}

    /**
     * Overwrite redraw method to keep modal intact and only update modal contents
     */
    redraw() {
        let node = this.__getNode().querySelector('.modal-content');
        this.find('.modal-content')[0].replaceWith(node);
        this.opened();
        M.updateTextFields();
    }
}

BaseDialog.BTN_CLOSE = {
    id: 'btn_close',
    color: 'green',
    close: true,
    text: 'close'
};
BaseDialog.BTN_ACCEPT = {
    id: 'btn_accept',
    color: 'green',
    close: false,
    text: 'accept'
};
BaseDialog.BTN_CREATE = {
    id: 'btn_create',
    color: 'green',
    close: false,
    text: 'create'
};
BaseDialog.BTN_DISCARD = {
    id: 'btn_discard',
    color: 'red',
    close: true,
    text: 'discard'
};
BaseDialog.BTN_EDIT = {
    id: 'btn_edit',
    color: 'green',
    close: false,
    text: 'edit'
};
BaseDialog.BTN_CANCEL = {
    id: 'btn_cancel',
    color: 'red',
    close: true,
    text: 'cancel'
};
BaseDialog.BTN_UPDATE = {
    id: 'btn_update',
    color: 'green',
    close: false,
    text: 'update'
};
BaseDialog.BTN_YES = {
    id: 'btn_yes',
    color: 'green',
    close: false,
    text: 'YES'
};
BaseDialog.BTN_NO = {
    id: 'btn_no',
    color: 'red',
    close: false,
    text: 'NO'
};
