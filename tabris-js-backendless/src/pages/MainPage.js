/**
 * The main page of the application.
 */
import {Page, TabFolder, Tab, ui,TextView, ImageView} from 'tabris';
import {saveFile} from './../services/BackendLess';
export default class extends Page {

  constructor() {
    super({
      topLevel: true,
      title: 'Backendless Connector'
    });
    let img;
    this.append(
      new TabFolder({left: 0, top: 0, right: 0, bottom: 0}).append(
        new Tab({title: 'Tab 1'}).append(
          new TextView({text:'Tab 1'}),
          img = new ImageView({top: ["prev()", 20], left: 20, width: 200, height: 200})
        ),
        new Tab({title: 'Tab 2'}).append(
          new TextView({text:'Tab 2'})
        ),
        new Tab({title: 'Tab 3'}).append(
          new TextView({text:'Tab 3'})
        )
      )
    );

    navigator.camera.getPicture(onSuccess, onFail, {
      quality: 50,
      targetWidth: 1024,
      targetHeight: 1024,
      destinationType: window.Camera.DestinationType.DATA_URL,
      sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY
    });
    function onSuccess(imageData) {
      saveFile(imageData)
        .then(result => {
          console.log("SUCCESS");
          console.log(result);
        })
        .catch(err => {
          console.log("FAIL");
          console.log(err);
        });
      img.set("image", {src: "data:image/jpeg;base64,"+imageData});
    }
    function onFail(message) {
      console.log("Camera failed because: " + message);
    }
  }

}
