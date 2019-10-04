@include 'lib/*'
@include 'models/*'
@include 'views/*'


// initialize server
const server = new Server({
  url: '/api'
});

// configure model with server
BaseModel.server = server;

// create app
const app = new AppView();

app.start(server, document.querySelector('#app-body'))
