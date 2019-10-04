@include 'lib/*'
@include 'models/*'
@include 'views/*'


// initialize server
const server = new Server({
  url: '/api'
});

// create app
const app = new AppView();

app.start(server, document.querySelector('#app-body'))
