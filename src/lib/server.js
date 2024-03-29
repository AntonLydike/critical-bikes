class Server {
  constructor(settings = {}) {
    this.url = settings.url || window.location.href + "api/";
    this.onError = settings.onError || ((code, json) => {
      M.toast({html: `${json.message}`, duration: 9000});
      console.error("Server error:", code, json);
    });

    this.settings = settings;

    // auth
    this.authenticated = false;
    this.uid = null;
    this.username = null;

    // try to read from local storage
    let auth = localStorage.getItem('session');
    if (auth) {
      try {
        auth = JSON.parse(auth);
        if (auth.uid && auth.name) {
          this.uid = auth.uid;
          this.username = auth.name;
          this.authenticated = true;
          console.log("[Server] initialized with account", this);

          if (typeof this.settings.onAuth == 'function') this.settings.onAuth(this);
        } else {
          this.logout()
        }
      } catch(e) {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  authenticate(uid, username) {
    console.log("[Server.authenticate]", this);
    if (this.authenticated) {
      throw new Error("Already authenticated!");
    }

    this.authenticated = true;
    this.uid = uid;
    this.username = username;

    localStorage.setItem('session', JSON.stringify({uid: this.uid, name: this.username}));
  }

  logout() {
    console.log("[Server] logged out", this);
    this.authenticated = false;
    this.uid = null;
    this.username = null;
    localStorage.removeItem('session');
    if (typeof this.settings.onLogout == 'function') this.settings.onLogout(this);
  }

  post(url, body) {
    console.log("[Server.post]", url, body);
    return fetch(this.url + url, this.addUid({
      method: 'POST',
    	headers: {
    		'Content-Type': 'application/json'
    	},
      body: JSON.stringify(body) || ''
    })).then(this.handleRequest(true));
  }

  delete(url, body) {
    console.log("[Server.delete]", url, body);
    return fetch(this.url + url, this.addUid({
      method: 'DELETE',
    	headers: {
    		'Content-Type': 'application/json'
    	},
      body: JSON.stringify(body) || ''
    })).then(this.handleRequest(true));
  }

  get(url) {
    console.log("[Server.get]", url);
    return fetch(this.url + url, this.addUid({})).then(this.handleRequest(true));
  }

  /**
   *  add uid to a request if available
   */
  addUid(opts) {
    if (!this.authenticated) return opts;

    if (!opts.headers) opts.headers = {};
    opts.headers['X-UID'] = this.uid;

    return opts;
  }

  handleRequest(json = true, status = null) {
    return resp => {
      if (resp.status == 401) {
        this.logout();
        throw new Error("You are unauthorized, please log in!");
      }

      // handle expected and unexpected no content
      if (resp.status == 204) {
        json = false;
      }

      if (status === null ? resp.ok : resp.status === status) {
        if (json) {
          return resp.json();
        }
        return resp;
      }

      return resp.json().then(json => {
        console.log("[Server.handleRequest]", this, json);

        return json;
      }).catch(err => {
        this.onError(resp.status, {
          message: "Error while parsing json body",
          errors: [err, resp]
        })

        throw err;
      }).then(json => {
        this.onError(resp.status, json);

        throw json;
      });
    }
  }

  parseDate(date) {
    return new Date(date + " UTC");
  }
}
