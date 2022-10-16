# Simple Slider
## [Demo](https://bb7hn.github.io/SimpleSlider/)
## Overview
![npm bundle size](https://img.shields.io/bundlephobia/min/simpleslider-ssjs?style=plastic&label=Minified%20Size:)

![NPM](https://img.shields.io/npm/l/simpleslider-ssjs?style=plastic&label=License:)

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/bb7hn/SimpleSlider?label=Total%20Commits:)

![GitHub all releases](https://img.shields.io/github/downloads/bb7hn/simpleSlider/total?style=plastic&color=lightgreen&label=Total%20Downloads%20(GitHub):)

![npm](https://img.shields.io/npm/dw/simpleslider-ssjs?style=plastic&color=lightgreen&label=Total%20Downloads%20(npm))
### What is Simple Slider
- Simple Slider is a basic Vanilla JS carousel
### Getting started
**npm :**

first install the package
```
npm i simpleslider-ssjs
```
then go to index.html and browse example

# Events
### ***on:***
```javascript
    const handler = (index) => { 
        console.log('active slide is:', index+1); 
    }
    slider.on('changed', handler);
```
- When slide changes the carousel will trigger *the handler function*. this event could be usefull when you want to know which slide is seen by user or want to manipulate the DOM. 

### ***goToSlide:***
```javascript
    const nextButtonHandler = () => { 
        slider.goToSlide('>');
    }
    const previousButtonHandler = () => { 
        slider.goToSlide('<');
    }
    const indexedButtonHandler = (index) => { 
        slider.goToSlide(index);
    }
```
- if you want to manipulate slider from other elements click events etc. this event could be usefull. This event accepts `integer` and `>` and `<` strings as a parameter.
`<` means ***`previous`*** slide and `>` means ***`next`*** slide.

### ***getActiveSlide:***
```javascript
    console.log(slider.getActiveSlide());
```
- You can get active index with this event