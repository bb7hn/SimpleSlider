"use strict"
const defaultProps = {
    container: null,
    imgList: [],
    controls: {
        next: false,
        prev: false,
        navigation: false,
    },
    autoPlay: true,
    style:{
        maxWidth:'90vw',
        boxSizing: 'border-box',
        maxHeight: '50vw',
        minHeight: '300px',
        border: '1px solid gray',
        borderRadius: '12px',
    }
    
};
class simpleSlider {

    constructor(){
        this.dragStartX = 0;
        this.touches = [0,0];
        this.resizeTimeout = null;
        this.slides = [];
    }
    
    init(opts) {
        // set default options
        const options = { ...defaultProps, ...opts, controls:{...defaultProps.controls, ...opts.controls }, style:{ ...defaultProps.style, ...opts.style }}
        // Set options of class
        this.setOptions(options);
        // Check did root element set by user
        if (typeof options.container === null) {
            console.error('SimpleSliderJS : "root" option is needed and have to be html element');
        }
        // Get image list from options
        const { imgList } = options;
        // Check imgList if it's length === 0 or it's type is not array throw error 
        if (typeof imgList !== typeof [] || imgList.length === 0) {
            console.error('SimpleSliderJS : "imgList" option does not contain any url (need to be array of strings)');
            return;
        }
        // TODO check item types of array accept only if they are strings or html elements

        //set Styles
        this.setStyles();
        // if user did not set custom controls create default controls
        if (options.controls.next === false || options.controls.prev === false || options.controls.navigation === false) {
            this.createControls();
        }
        else{
            this.createCustomControls();
        }

        this.slideCount = imgList.length;

        this.createImages(imgList);

        this.setActiveNavItem();
        // check did user set autoplay
        this.autoPlay();

        /* this.root.addEventListener("dragstart", this.dragStartHandler); */
        /* this.root.addEventListener("dragend", this.dragEndHandler); */

        this.root.addEventListener("touchstart", this.touchStartHandler);
        this.root.addEventListener("touchend", this.touchEndHandler);
        this.root.addEventListener('touchmove', this.touchMoveHandler);
        this.root.addEventListener('touchleave', this.touchLeaveHandler);
        this.root.addEventListener('touchcancel', this.touchCancelHandler);


        window.addEventListener('resize', (e) => {
            this.root.style.opacity = 0.1;
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(()=>{this.setActiveSlide(0); this.root.style.opacity = 1;}, 80);      
        });

        this.root.simpleSlider = this;
        return this;
    }

    setOptions(options) {
        this.options = options;
        this.root = options.container;
        this.currentSlide = 0;
    }

    createImages(urlList) {
        this.slides.forEach(e=>e.remove());
        urlList.forEach((url, i) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.transition = "all 400ms";
            imgContainer.style.minWidth = "100%";
            imgContainer.style.display = "flex";
            imgContainer.style.position = "relative";
            imgContainer.style.alignItems = "center";
            imgContainer.style.justifyContent = "center";
            imgContainer.style.overflow = "hidden";
            const img = document.createElement('img');
            img.src = url;
            img.draggable = false;
            imgContainer.append(img);
            this.root.append(imgContainer);
        });
        this.slides = Array.from(this.root.querySelectorAll('div:not([data-type="control"])'));
    }

    createControls() {
        const previousButton = document.createElement('div');
        previousButton.setAttribute('data-type', 'control');
        previousButton.style.zIndex = "2";
        previousButton.innerHTML = "&#8249;";
        previousButton.style.width = "4rem";
        previousButton.style.height = "4rem";
        previousButton.style.color = "skyblue";
        previousButton.style.borderRadius = "100%";
        previousButton.style.position = "absolute";
        previousButton.style.fontSize = "3rem";
        previousButton.style.top = "50%";
        previousButton.style.transform = "translateY(-50%)";
        previousButton.style.left = "0";
        previousButton.style.display = "flex";
        previousButton.style.alignItems = "center";
        previousButton.style.justifyContent = "center";
        previousButton.style.cursor = "pointer";
        previousButton.style.userSelect = "none";
        previousButton.onclick = () => this.goToSlide('<');

        const nextButton = document.createElement('div');
        nextButton.setAttribute('data-type', 'control');
        nextButton.style.zIndex = "2";
        nextButton.innerHTML = "&#8250;";
        nextButton.style.width = "4rem";
        nextButton.style.height = "4rem";
        nextButton.style.color = "skyblue";
        nextButton.style.borderRadius = "100%";
        nextButton.style.position = "absolute";
        nextButton.style.fontSize = "3rem";
        nextButton.style.top = "50%";
        nextButton.style.transform = "translateY(-50%)";
        nextButton.style.right = "0";
        nextButton.style.display = "flex";
        nextButton.style.alignItems = "center";
        nextButton.style.justifyContent = "center";
        nextButton.style.cursor = "pointer";
        nextButton.style.userSelect = "none";
        nextButton.onclick = () => this.goToSlide('>');

        const bottomNavigation = document.createElement('div');
        bottomNavigation.setAttribute('data-type', 'control');
        bottomNavigation.style.zIndex = "2";
        bottomNavigation.style.padding = "10px";
        bottomNavigation.style.display = "flex";
        bottomNavigation.style.alignItems = "center";
        bottomNavigation.style.justifyContent = "space-between";
        bottomNavigation.style.position = "absolute";
        bottomNavigation.style.left = "50%";
        bottomNavigation.style.bottom = "0";
        bottomNavigation.style.transform = "translateX(-50%)";
        bottomNavigation.style.userSelect = "none";
        this.options.imgList.forEach((_, index) => {
            const circle = document.createElement('span');
            circle.style.width = "20px";
            circle.style.height = "20px";
            circle.style.margin = "5px";
            circle.style.borderRadius = "100%";
            circle.style.background = "#FFFFFF50";
            circle.style.cursor = "pointer";
            circle.onclick = () => {
                this.goToSlide(index);
            }
            bottomNavigation.appendChild(circle);
        })

        this.navigation = bottomNavigation.children;

        this.root.append(previousButton, nextButton, bottomNavigation);
    }

    createCustomControls() {
        const { 
            controls:{
                    next,
                    prev,
                    navigation
            } 
        } = this.options;
        prev.setAttribute('data-type','control');
        prev.onclick = ()=>this.goToSlide('<');

        next.setAttribute('data-type','control');
        next.onclick = ()=>this.goToSlide('>');

        navigation.setAttribute('data-type','control');
        this.root.append(prev, next, navigation);
    }

    goToSlide(index, event = "userClick") {
        if (index === '<') {
            // go to previous
            if (this.currentSlide > 0) {
                // if selected slide bigger than 0 go back else go to last one
                this.setActiveSlide(-1);
            }
            else {
                this.currentSlide = this.slideCount;
                this.goToSlide('<');
            }
        } else if (index === '>') {
            // go to next
            if (this.currentSlide < this.slideCount - 1) {
                // if selected slide smaller than total slide count minus one go forward else go to first one
                this.setActiveSlide();
            } else {
                this.currentSlide = -1;
                this.goToSlide('>');
            }
        }
        else {
            // parseint index and go to index
            this.currentSlide = parseInt(index);
            this.setActiveSlide(0);
        }
        if (event === "userClick") {
            this.autoPlay();
        }
    }

    setActiveNavItem() {
        if(this.navigation){
            Array.from(this.navigation).forEach(item => {
                item.style.background = "#FFFFFF50";
            });
            this.navigation[this.currentSlide].style.background = "#FFFFFF90";
        }
    }

    setActiveSlide(multiplier = 1) {
        const oldIDX = this.currentSlide;
        const slides = this.root.querySelectorAll('div:not([data-type="control"])');
        const slideWidth = slides[0].getBoundingClientRect().width;

        slides.forEach((slide) => {
            slide.style.transform = `translateX(-${slideWidth * (this.currentSlide + multiplier)}px)`;
        });
        
        this.currentSlide += multiplier;
        if(this.currentSlide !== oldIDX){
            this.changedCB(this.currentSlide);
        }
        this.setActiveNavItem();
    }

    on(type, callBack) {
        this[`${type}CB`] = callBack;
    }

    autoPlay() {
        const options = this.options;
        if (options.autoPlay === true) {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
            }
            this.autoPlayInterval = setInterval(() => {
                this.goToSlide('>', "autoPlay");
            }, options.autoPlayDuration || 4000);
        }
    }

    touchStartHandler(e) {
        //set x starting location in here
        this.simpleSlider.touches[0] = e.touches[0].screenX;
    }
    touchMoveHandler(e){
        // set x location in here
        this.simpleSlider.touches[1] = e.touches[e.touches.length - 1].screenX;
    }
    touchEndHandler() {
        // handle where to go in here (prev or next)
        const simpleSlider = this.simpleSlider;
        const firstTouch = simpleSlider.touches[0];
        const lastTouch = simpleSlider.touches[1];
        if(firstTouch === 0 || lastTouch === 0){
            return;
        }
        const diff = Math.abs(lastTouch - firstTouch);
        if(diff < 50){
            return;
        }
        if(lastTouch > firstTouch){
            simpleSlider.goToSlide('<');
        }
        if(lastTouch < firstTouch){
            simpleSlider.goToSlide('>');
        }
        simpleSlider.resetTouches();
    }

    resetTouches(){
        this.touches = [0, 0];
    }

    setStyles(){
        const root = this.root;
        const styles = this.options.style;
        Object.keys(styles).forEach((key) => {
            root.style[key] = styles[key];
        });
        root.style.position = 'relative';
        root.style.overflow = 'hidden';
        root.style.display = 'flex';
    }

    getActiveSlide(){
        return this.currentSlide;
    }
}

const _simpleSlider = new simpleSlider;
export { _simpleSlider as simpleSlider };

/* 
    const event = new Event('changed');
    // Dispatch the event.
    this.dispatchEvent(event);
*/