# loklok-clone

A web-based clone of the LokLok android app, which has been unpublished in November 2020.

Find the current state of the project deployed here (client): https://loklok-clone.netlify.app/

## Project setup: Frontend
```
cd fe
```
and then
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Project setup: Backend
```
cd be
```
and then
```
npm install
```
and then
```
npm start
```

## Description of the original LokLok app

To summarize, the LokLok app was a digital whiteboard that is always in-sync with you and your chosen group of people.
It lets you draw, write and add photos to the board. It's unique key feature is the usage of the **lock-screen** of your smartphone as communication medium.

Impressions and more detailed descriptions about the original LokLok app can be found under these sources:
* https://thenextweb.com/apps/2014/07/07/loklok/
* https://androidappsforme.com/loklok-app-review/
* https://www.youtube.com/watch?v=patgOkFHOgU

## Status 9.4.2021
### Topics and features implemented
* deployment on Netfliy: https://loklok-clone.netlify.app/
* feature: selecting drawing or erasing tool, color and line-width (global state management with Vuex)
* feature: drawing or erasing via mouse-input or touch-input
* feature: multi-touch-input for erasing (2 fingers)
* feature: clearing canvas
* feature: setting a background picture (work in progress)
* feature: undo / redo functionality (still many bugs)
* styling: dropdown-lists and icons
* JEST setup and first test

### Next steps
* Start with Back-end / Collaboration feature
* Frontend: https://trello.com/b/fdcYQZvQ/loklok-clone

## Requirements for the clone

| Priority (must-have \| nice-to-have) | Description                                                                                                                                  |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| **Tools**                                |                                                                                                                                          |
| must-have                            | Drawing tool <ul><li>select a color</li> <li>select a brush</li> <li>select line thickness</li> <li>draw onto canvas</li></ul>                                                    |
| must-have                            | Text input <ul><li>select a color</li> <li>select a font</li> <li>type onto canvas</li></ul>                                                                            |
| must-have                            | Add photo <ul><li>take a photo or</li> <li>select and upload image from storage</li> <li>set photo as background of canvas</li>        </ul>                             |
| must-have                            | Eraser <ul><li>erase by using an eraser tool with selectable size</li> <li>erase by using multi-touch (two fingers)</li> <li>erase entire canvas by button click</li> </ul> |
| must-have                            | Undo / Redo <ul><li>undo and redo any tool action</li> </ul>                                                                                                  |
| must-have                            | Export <ul><li>export artwork as jpg</li> </ul>                                                                                                               |
| **Synchronization / Collaboration**      |                                                                                                                                         |
| must-have                            | create a group <ul><li>invite people to your group</li> <li>delete people from your group</li> </ul>                                                                 |
| must-have                            | save canvas and synchronize it with entire group / receive canvases from peers.                                                              |
| **Technical aspects**                    |                                                                                                                                          |
| must-have                            | use web-based technologies (JavaScript)                                                                                                      |
| **Native app features**                  |                                                                                                                                          |
| nice-to-have                         | have canvas displayed on lockscreen of your Android device                                                                                   |
| **Further ideas for features**           |                                                                                                                                          |
| nice-to-have                         | display animated GIFs / stickers, handwritten-to-text-conversion, TicTacToe game...                                                             |

## Roadmap
1. Basic Demo Drawing app using HTML Canvas Element
2. Backend and synchronization / collaboration feature
3. Wrapper for native app features
