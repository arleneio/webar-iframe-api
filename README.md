# WebAR JS Iframe library

## Getting Started

This library is intended to be imported in the html files that will be embedded in WebXR projects using iFrames to have some communication and interaction with the scene and elements.

#### DEMO: https://arleneio.github.io/webar-iframe-api/


## Setting up the library from CDN:

- Import the script in your html file

`<script src="https://arleneio.github.io/webar-iframe-api/webxr-webAR.umd.js"></script>`

- When you import the `webxr-webAR.js` script in your html, you will have an object you could access using `window.webxrWebAR`


## Setting up the library from our package:

- Import the package directly in your component:

`import { parent, child } from 'https://arleneio.github.io/webar-iframe-api/webxr-webAR.es.js'`

`child` is your page used when you want it to communicate with an embbedded webAR experience
and `parent` when your page is embbedded inside it.



## Basics

In order to give WebAR users a way to add some interaction to their projects, the webXR library expose some functions and listeners that allow you to create you own custom logic. 


## Variables and Objects

- `window.webxrWebAR.parent` this object expose some functions and listeners to communicate with a parent webAR.
- `window.webxrWebAR.child` this object expose some functions and listeners to communicate with a embbedded webAR.

## Parameters

All the methods exposed by the API receive two parameters, the first one is the ```props``` parameter that gives the information about what we want to change, and the second one is the new value for the target according to the function I am invocating.


### Change an element property

- `changeModel(props,value):void`:
Change a model or element information, the props object should have an index indicating the index of the element on the editor, the property I want to change ('model','scale','position','rotation')

For the 'model' property, the new value is the name of the asset on the asset manager on the editor
For the other properties the new value should be the values on X Y and Z separated by a space (ex: '0.5 0.5 0.5')

This example will change the model of the element with index 1 to the model with name 'model1' on the asset manager

```js
    document.getElementById('frame').webxrWebAR.child.changeModel({index: 1, property:'model'},'banana.glb');      
```

This other example will change the scale of the element with index 1 to 0.5 on X, 0.5 on Y and 0.5 on Z

```js
    document.getElementById('frame').webxrWebAR.child.changeModel({index: 1, property:'scale'},'0.5 0.5 0.5');      
```

