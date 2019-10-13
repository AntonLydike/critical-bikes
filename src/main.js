@include 'lib/*'
@include 'models/*'
@include 'views/*'

// set leaflet icon base
L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.5.1/dist/images/"

// initialize server
const server = new Server({
  url: '/api'
});

// configure model with server
BaseModel.server = server;

// create app
const app = new AppView();

app.start(server, document.querySelector('#app-body'))
