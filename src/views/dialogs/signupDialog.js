class SignupDialog extends BaseDialog {
  constructor(server, done, abort) {
    super([
      BaseDialog.BTN_ACCEPT,
      BaseDialog.BTN_CANCEL
    ]);

    this.server = server;

    const completionCallback = e => {
      e.preventDefault();
      let username = this.$('#name').value.trim();
      if (username.length == 0) username = "Anonymous";
      if (server.authenticated) {
        server.username = username;
      } else {
        server.authenticate(uuid(), username);
      }
      this.close();
      done();
    }

    this.events = {
      'click #btn_cancel': e => {
        e.preventDefault();
        this.close();
        abort();
      },
      'click #btn_accept': completionCallback,
      'submit form': completionCallback
    }

    this.open();
  }

  getContent() {
    return `<h3>Please choose a username</h3>
    <p>This name will be displayed publicly when you participate. Please no last names.</p>
    <form>
      <input type="text" id="name" name="name" placeholder="username"/>
    </form>`;
  }
}

SignupDialog.asPromise = server => new Promise((res, rej) => new SignupDialog(server, res, rej));

// promise resolves instantly when user is signed, otherwise dialog is shown
SignupDialog.ensureSignedIn = server => {
  if (server.authenticated) return Promise.resolve();
  return SignupDialog.asPromise(server);
}
