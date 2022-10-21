# Simple Slider
## [Demo](https://bb7hn.github.io/SimpleSlider/)
## Overview
![npm bundle size](https://img.shields.io/bundlephobia/min/simpleslider-ssjs?style=plastic&label=Minified%20Size:)

![NPM](https://img.shields.io/npm/l/simpleslider-ssjs?style=plastic&label=License:)

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/bb7hn/SimpleSlider?label=Total%20Commits:)

![GitHub all releases](https://img.shields.io/github/downloads/bb7hn/simpleSlider/total?style=plastic&color=lightgreen&label=Total%20Downloads%20(GitHub):)

![npm](https://img.shields.io/npm/dw/simpleslider-ssjs?style=plastic&color=lightgreen&label=Total%20Downloads%20(npm))
## What is Simple Slider
- Simple Slider is a basic Vanilla JS carousel
## Quick Start

First install the package
```
npm i simpleslider-ssjs
```
Then go to example.html and browse example.

As an alternative you can `browse` [**React Example**](https://github.com/bb7hn/simpleSliderReactExample)

## Getting started
```html
<html>
    <head>
    </head>
    <body>
        <div id="mySlider">
            place your elements here..
        </div>
        <script type="module">
            import { simpleSlider } from 'simpleslider-ssjs';
            const options = {
                ... specialize the options or you can prefer to use defaults
                .. you can see the all options on  #Parameters section
            }

            const SimpleSlider = simpleSlider.init(options);
        </script>
    </body>
</html>
```  

That's all. Now you can manipulate simpleSlider by using your SimleSlider constant.
# Events
### ***on:***
```javascript
    const handler = (index) => { 
        console.log('active slide is:', index+1); 
    }
    slider.on('changed', handler);
```
- When slide changes, the carousel will trigger the *handler function*. This event could be usefull when you want to know which slide is seen by user or want to manipulate the DOM.

`IMPORTANT NOTE: If you set more than 1 slide per page in options this event will return only the first slide's index which seen by user`
# Methods
### init:
this is the most basic method to initialize your  container element
```javascript
    import { simpleSlider } from 'simpleslider-ssjs';

    simpleSlider.init(options)
```
### ***goToSlide:***
```javascript
    import { simpleSlider } from 'simpleslider-ssjs';

    ...initial code blocks

    const nextButtonHandler = () => { 
        slider.goToSlide('>');
    }

    const previousButtonHandler = () => { 
        slider.goToSlide('<');
    }
    
    const navigationButtonHandler = (index) => { 
        slider.goToSlide(index);
    }

```
- if you want to manipulate slider from other elements click events etc. this event could be usefull. This event accepts `integer` and `>` `<` strings as a parameter. If you prefer to set true noControl option you can handle next prev and navigation buttons by this method.
`<` means ***`previous`*** slide and `>` means ***`next`*** slide.

### ***getActiveSlide:***
```javascript
    import { simpleSlider } from 'simpleslider-ssjs';
    
    ... initial code blocks

    console.log(slider.getActiveSlide());

```
- You can get active index with this event
# Parameters (options)  
|     **_Option_**     	|       **_Type_**       	|  **_Is Parent_**  	|                                        **_Default_**                                       	|                               **_Is Needed_**                              	|                                                                                                                                                        **_Description_**                                                                                                                                                       	|
|:--------------------:	|:----------------------:	|:-----------------:	|:------------------------------------------------------------------------------------------:	|:--------------------------------------------------------------------------:	|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|
|       container      	|      HTML ELEMENT      	|         ✓         	|                                            null                                            	|                                     Yes                                    	|                                                                                                                This parameter need to be supplied for initialization. This must to be your main slider container                                                                                                               	|
|        imgList       	|    Array of strings    	|         ✓         	|                                             []                                             	| Only if there is no child element in container or didn't supplied itemList 	|                                                                                                                                                          Img url list                                                                                                                                                          	|
|       itemList       	| Array of HTML ELEMENTS 	|         ✓         	|                                          undefined                                         	|  Only if there is no child element in container or didn't supplied imgList 	|                                                                                                                                                       Html elements array                                                                                                                                                      	|
| createCustomControls 	|         Boolean        	|         ✓         	|                                          undefined                                         	|                                     No                                     	|                                                                                                                               **This is experimental till getting improved not to use is better**                                                                                                                              	|
|       noControl      	|         Boolean        	|         ✓         	|                                          undefined                                         	|                                     No                                     	|                                                                                                                              **For creating yout custom next prev buttons etc. set this to true**                                                                                                                              	|
|       controls       	|         Object         	|         ✓         	|               {     next: false,     prev: false,     navigation: false,   }               	|                 Only needed if createCustomControls is true                	|                                                                                                                                 This is connected with **createCustomControls** so same with it                                                                                                                                	|
|         next         	|      HTML ELEMENT      	| Child of controls 	|                                            false                                           	|                 Only needed if createCustomControls is true                	|                                                                                                                                                               --                                                                                                                                                               	|
|         prev         	|      HTML ELEMENT      	| Child of controls 	|                                            false                                           	|                 Only needed if createCustomControls is true                	|                                                                                                                                                               --                                                                                                                                                               	|
|      navigation      	|      HTML ELEMENT      	| Child of controls 	|                                            false                                           	|                 Only needed if createCustomControls is true                	|                                                                                                                                                               --                                                                                                                                                               	|
|       autoPlay       	|         Boolean        	|         ✓         	|                                            true                                            	|                                     No                                     	|                                                                                                                              **If don't you set it false slides will change in every 4 seconds.**                                                                                                                              	|
|         style        	|         Object         	|         ✓         	| {     boxSizing: 'border-box',     border: '1px solid gray',     borderRadius: '12px',   } 	|                                     No                                     	| **This option created for flexibility. You can set every key about css styles and all of them will applied to container element dynamically. For example width height marginTop borderRadius... There are only two things you can not set with this option. 1.) display (flex as default) and 2.) overflow hidden as default** 	|
| slidePerPage         	| Number                 	| ✓                 	| 1                                                                                          	| No                                                                         	| How many slides do you want to show to user ?                                                                                                                                                                                                                                                                                  	|
|          gap         	|    String or Number    	|         ✓         	|                                              0                                             	|                                     No                                     	|                                              This is the gap between each slide. This will get applied if slidePerPage option is bigger than 1. You can set it as integer or '1rem' \|\| 12 \|\| "15px". ***only px and rem supportted. If it is number then it'll agreed as px***                                             	|                                                     	|