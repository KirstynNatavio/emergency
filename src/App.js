import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"


// The JavaScript client works in both Node.js and the browser.

// Require the client
const Clarifai = require('clarifai');

// initialize with your api key. This will also work in your browser via http://browserify.org/
const app = new Clarifai.App({
 apiKey: 'c546323e1683462a8d5bcb36f2e2cc78'
});

// You can also use the SDK by adding this script to your HTML:
//<script type="text/javascript" src="https://sdk.clarifai.com/js/clarifai-latest.js"></script>

var clarifai_arr = [];
var img_arr = [];

// predict the contents of an image by passing in a url
app.models.predict(Clarifai.GENERAL_MODEL, 'http://2f9cu53n92c71aq07f18fx9i-wpengine.netdna-ssl.com/wp-content/uploads/2013/12/car-accident-injuries.jpg').then(

//app.models.predict(Clarifai.GENERAL_MODEL, 'http://lymanorchards.com/files/7013/6725/1487/apples.jpg').then(
  function(response) {

    // Returns the 20 tags and their confidence
    var length = response['outputs'][0]['data']['concepts'].length;
    for (var i = 0; i < length; i++) {
       img_arr.push(response['outputs'][0]['data']['concepts'][i]['name']);
      //console.log('Value: ' + response['outputs'][0]['data']['concepts'][i]['value']);
    }
  },
  function(err) {
    console.error(err);
  }
);

// Create tags to describe a video in real-time
app.models.predict(Clarifai.GENERAL_MODEL, 'https://samples.clarifai.com/beer.mp4', {video: true}).then(

  function(res) {

    var framesLength = res['outputs'][0]['data']['frames'].length;
    var frames = res['outputs'][0]['data']['frames'];
    
    for (var i = 0; i < framesLength; i++) {

      // display each frame
      //console.log(frames[i]['data']['concepts'])

      var conceptsLength = frames[i]['data']['concepts'].length;
      //console.log(conceptsLength);

      //for each frame, display tags generated
      for (var j = 0; j < conceptsLength; j++) {
        clarifai_arr.push('Name ' + (j+1) + ': ' + frames[i]['data']['concepts'][j]['name']);
      }
    }

    //console.log(res['outputs'][0]['data']['frames']);
    //console.log(res);
  },
  function (err) {
    console.log(err);
  }
  //.catch(log);
);


console.log(img_arr);

var arr_nearby = [];

fetch('https://api.foursquare.com/v2/venues/explore?intent=checkin&ll=40.8089343,-73.95990859999999&radius=1000&query=hospital&client_id=Q21PILG1ICYCDEIOXQPR422YHZD4PM554VJOUXTHG2NLLAIQ&client_secret=BGO0MAHLHDD0RONDHCWNLO0BMP51LAXB3EWAJCHUWNA1WMR3&v=20170801')
.then((response) => {
  response.json().then(data => ({
    data: data,
  })).then(res => {
    for (var i = 0; i < 5; ++i) {
      console.log(res.data.response.groups[0])
      arr_nearby.push([res.data.response.groups[0].items[i].venue.location.lat,res.data.response.groups[0].items[i].venue.location.lng]);
    }
        
    console.log(arr_nearby);
  });
})
.then((jsonData) => { 
  console.log(jsonData);
});


const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCxE-IggEknugPDqXdVqBeqGI9M88KkEeQ&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: 40.8089343, lng: -73.95990859999999 }}
  >
    {props.isMarkerShown && <Marker position={{ lat: arr_nearby[0][0], lng: arr_nearby[0][1] }} onClick={props.onMarkerClick} />}
    {props.isMarkerShown && <Marker position={{ lat: arr_nearby[1][0], lng: arr_nearby[1][1] }} onClick={props.onMarkerClick} />}
    {props.isMarkerShown && <Marker position={{ lat: arr_nearby[2][0], lng: arr_nearby[2][1] }} onClick={props.onMarkerClick} />}
    {props.isMarkerShown && <Marker position={{ lat: arr_nearby[3][0], lng: arr_nearby[3][1] }} onClick={props.onMarkerClick} />}
    {props.isMarkerShown && <Marker position={{ lat: arr_nearby[4][0], lng: arr_nearby[4][1] }} onClick={props.onMarkerClick} />}



  </GoogleMap>
)



class App extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isMarkerShown: false,
    }
  }

  toggleShown() {
    this.setState({ isMarkerShown: true});
    document.getElementById("transcript").innerHTML = img_arr.toString();
  }


  

  render() {
    return (
      <div>
        <form>
        <div className="form-group">
          <label for="exampleInputEmail1">Search</label>
          <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter problem"/>
        </div>
        <div className="form-group">
          <label for="exampleInputPassword1">Rate</label>
          <input type="number" className="form-control" id="exampleInputPassword1" placeholder="1–10"/>
        </div>
        <input name="myFile" type="file"/>
        <p id="transcript"></p>
        <button type="button" className="btn btn-primary" id="submit-btn" onClick={this.toggleShown.bind(this)}>Submit</button>
      </form>
        <MyMapComponent isMarkerShown={this.state.isMarkerShown}/>
      </div>
    )
  }
}

export default App;