const defaultProps = {
  container: null,
  imgList: [],
  controls: {
    next: false,
    prev: false,
  },
  autoPlay: true,
  style: {
    boxSizing: 'border-box',
    border: '1px solid gray',
    borderRadius: '12px',
  },
  gap: 0,
  slidePerPage: 1,
};

const convertRemToPixels = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
class simpleSlider {
  constructor() {
    this.dragStartX = 0;
    this.touches = [0, 0];
    this.resizeTimeout = null;
    this.slides = [];
    this.changedCB = () => {};
  }

  init(opts) {
    // set default options
    const options = {
      ...defaultProps,
      ...opts,
      controls: { ...defaultProps.controls, ...opts.controls },
      style: { ...defaultProps.style, ...opts.style, display: 'flex', overflow: 'hidden' },
    };

    // Set options of class
    this.setOptions(options);
    // Check did root element set by user
    if (typeof options.container === typeof undefined || options.container === null) {
      console.error('SimpleSliderJS : "container" option is needed and have to be html element');
      return;
    }
    // Get image list from options
    const { imgList, itemList } = options;
    // Check imgList if it's length === 0 or it's type is not array throw error
    if (
      (typeof imgList !== typeof [] || imgList.length === 0) &&
      (typeof itemList !== typeof [] || itemList.length === 0 || typeof itemList[0] !== typeof document.createElement('div')) &&
      options.container.childElementCount === 0
    ) {
      console.error(
        'SimpleSliderJS : "imgList" option does not contain any url (need to be array of strings). Also itemList option does not contain any element (need to be array of elements)'
      );
      return;
    }
    // TODO check item types of array accept only if they are strings or html elements

    // set Styles
    this.setStyles();
    // if user did not set custom controls create default controls
    if (!options.noControl) {
      this.createControls();
    }
    if (options.createCustomControls) {
      this.createCustomControls();
    }

    this.createImages(imgList, itemList);

    this.slideCount = this.slides.length;

    this.setActiveSlide(0);
    // check did user set autoplay
    this.autoPlay();

    /* this.root.addEventListener("dragstart", this.dragStartHandler); */
    /* this.root.addEventListener("dragend", this.dragEndHandler); */

    this.root.addEventListener('touchstart', this.touchStartHandler);
    this.root.addEventListener('touchend', this.touchEndHandler);
    this.root.addEventListener('touchmove', this.touchMoveHandler);
    /* this.root.addEventListener('touchleave', this.touchLeaveHandler);
    this.root.addEventListener('touchcancel', this.touchCancelHandler); */
    this.root.addEventListener('mouseenter', this.mouseEnterHandler);
    this.root.addEventListener('mouseleave', this.mouseLeaveHandler);

    window.addEventListener('resize', (e) => {
      /* this.root.style.opacity = 0.1; */
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.setActiveSlide(0);
        /* this.root.style.opacity = 1; */
      }, 1);
    });

    this.root.simpleSlider = this;
    return this;
  }

  setOptions(options) {
    this.options = options;
    this.root = options.container;
    this.currentSlide = 0;
  }

  createImages(urlList, _itemList) {
    if (!urlList || urlList.length === 0) return this.appendItemsToList(_itemList);
    this.slides.forEach((e) => e.remove());
    const perPage = this.options.slidePerPage;
    urlList.forEach((url, i) => {
      const imgContainer = document.createElement('div');
      imgContainer.style.transition = 'all 400ms';
      if (perPage && perPage > 1) {
        imgContainer.style.width = `${100 / perPage}%`;
      } else {
        imgContainer.style.minWidth = `100%`;
      }
      imgContainer.style.display = 'flex';
      imgContainer.style.position = 'relative';
      imgContainer.style.alignItems = 'center';
      imgContainer.style.justifyContent = 'center';
      imgContainer.style.overflow = 'hidden';
      const img = document.createElement('img');
      img.src = url;
      img.draggable = false;
      imgContainer.append(img);
      this.root.append(imgContainer);
    });
    this.slides = Array.from(this.root.querySelectorAll('div:not([data-type="control"])'));
  }

  appendItemsToList(itemList) {
    if (!itemList || itemList.length === 0) return this.useRootSChilds();
    this.slides.forEach((e) => e.remove());
    const perPage = this.options.slidePerPage;
    let gap = 0;
    if (typeof this.options.gap === typeof '') {
      gap = this.options.gap.includes('rem') ? convertRemToPixels(parseFloat(this.options.gap)) : 0;
    } else if (typeof this.options.gap === typeof 1) {
      gap = this.options.gap;
    }
    itemList.forEach((item, i) => {
      const imgContainer = document.createElement('div');
      imgContainer.style.transition = 'all 400ms';
      if (perPage && perPage > 1) {
        imgContainer.style.maxWidth = `calc(${100 / perPage}% - ${gap * perPage}px)`;
      } else {
        imgContainer.style.minWidth = `100%`;
      }
      imgContainer.style.display = 'flex';
      imgContainer.style.position = 'relative';
      imgContainer.style.alignItems = 'center';
      imgContainer.style.justifyContent = 'center';
      imgContainer.style.overflow = 'hidden';
      try {
        item.draggable = false;
      } catch (error) {
        //
      }
      imgContainer.append(item);
      this.root.append(imgContainer);
    });
    this.slides = Array.from(this.root.querySelectorAll('div:not([data-type="control"])'));
  }

  useRootSChilds() {
    /* this.root.forEach(e=>e.remove()); */
    const slides = [];
    const perPage = this.options.slidePerPage;

    let gap = 0;
    if (typeof this.options.gap === typeof '' && perPage !== 1) {
      gap = this.options.gap.includes('rem') ? convertRemToPixels(parseFloat(this.options.gap)) : 0;
    } else if (typeof this.options.gap === typeof 1 && perPage !== 1) {
      gap = this.options.gap;
    }
    const childs = Array.from(this.root.children).filter((child) => child.getAttribute('data-type') !== 'control');
    childs.forEach((child) => {
      const imgContainer = document.createElement('div');
      imgContainer.style.transition = 'all 400ms';
      imgContainer.style.minWidth = `calc(${100 / perPage}% - ${gap * 2}px)`;
      imgContainer.style.margin = `0 ${gap * 2}px 0 0`;
      imgContainer.style.width = '100%';
      imgContainer.style.display = 'flex';
      imgContainer.style.position = 'relative';
      imgContainer.style.alignItems = 'center';
      imgContainer.style.justifyContent = 'center';
      imgContainer.style.overflow = 'hidden';
      try {
        child.draggable = false;
      } catch (error) {
        //
      }
      imgContainer.append(child);
      slides.push(imgContainer);
      this.root.append(imgContainer);
    });

    this.slides = slides;
    this.root.style.paddingLeft = `${2 * gap}px`;
  }

  // if user did not send custom controls in options and did not set no controls use this function
  createControls() {
    const previousButton = document.createElement('div');
    previousButton.setAttribute('data-type', 'control');
    previousButton.style.zIndex = '2';
    previousButton.innerHTML = '&#8249;';
    previousButton.style.width = '4rem';
    previousButton.style.height = '4rem';
    previousButton.style.color = 'skyblue';
    previousButton.style.borderRadius = '100%';
    previousButton.style.position = 'absolute';
    previousButton.style.fontSize = '3rem';
    previousButton.style.top = '50%';
    previousButton.style.transform = 'translateY(-50%)';
    previousButton.style.left = '0';
    previousButton.style.display = 'flex';
    previousButton.style.alignItems = 'center';
    previousButton.style.justifyContent = 'center';
    previousButton.style.cursor = 'pointer';
    previousButton.style.userSelect = 'none';
    previousButton.onclick = () => this.goToSlide('<');

    const nextButton = document.createElement('div');
    nextButton.setAttribute('data-type', 'control');
    nextButton.style.zIndex = '2';
    nextButton.innerHTML = '&#8250;';
    nextButton.style.width = '4rem';
    nextButton.style.height = '4rem';
    nextButton.style.color = 'skyblue';
    nextButton.style.borderRadius = '100%';
    nextButton.style.position = 'absolute';
    nextButton.style.fontSize = '3rem';
    nextButton.style.top = '50%';
    nextButton.style.transform = 'translateY(-50%)';
    nextButton.style.right = '0';
    nextButton.style.display = 'flex';
    nextButton.style.alignItems = 'center';
    nextButton.style.justifyContent = 'center';
    nextButton.style.cursor = 'pointer';
    nextButton.style.userSelect = 'none';
    nextButton.onclick = () => this.goToSlide('>');

    this.root.append(previousButton, nextButton);
  }

  // if user send custom controls in options use this function
  createCustomControls() {
    const {
      controls: { next, prev },
    } = this.options;
    prev.setAttribute('data-type', 'control');
    prev.onclick = () => this.goToSlide('<');

    next.setAttribute('data-type', 'control');
    next.onclick = () => this.goToSlide('>');

    this.root.append(prev, next);
  }

  goToSlide(index, event = 'userClick') {
    const perPage = this.options.slidePerPage;
    if (index === '<') {
      // go to previous
      if (this.currentSlide > 0) {
        // if selected slide bigger than 0 go back else go to last one
        this.setActiveSlide(-1);
      } else {
        this.currentSlide = this.slideCount - (perPage - 1);
        this.goToSlide('<', event);
      }
    } else if (index === '>') {
      // go to next
      if (this.currentSlide < this.slideCount - perPage) {
        // if selected slide smaller than total slide count minus one go forward else go to first one
        this.setActiveSlide();
      } else {
        this.currentSlide = -1;
        this.goToSlide('>', event);
      }
    } else {
      // parseint index and go to index
      this.currentSlide = parseInt(index);
      this.setActiveSlide(0, event === 'userClick');
    }
    if (event === 'userClick') {
      this.autoPlay();
    }
  }

  setActiveSlide(multiplier = 1, triggerCB = false) {
    const oldIDX = this.currentSlide;
    const { slides } = this;
    const slideWidth = slides[0].getBoundingClientRect().width;
    const perPage = this.options.slidePerPage;
    let gap = 0;
    if (typeof this.options.gap === typeof '' && perPage !== 1) {
      gap = this.options.gap.includes('rem') ? convertRemToPixels(parseFloat(this.options.gap)) : 0;
    } else if (typeof this.options.gap === typeof 1 && perPage !== 1) {
      gap = this.options.gap;
    }

    slides.forEach((slide, idx) => {
      slide.style.transform = `translateX(-${(slideWidth + gap * 2) * (this.currentSlide + multiplier)}px)`;
    });

    this.currentSlide += multiplier;
    if (this.currentSlide !== oldIDX || triggerCB) {
      this.changedCB(this.currentSlide);
    }
  }

  on(type, callBack) {
    this[`${type}CB`] = callBack;
  }

  autoPlay() {
    const { options } = this;
    if (options.autoPlay === true) {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
      }
      this.autoPlayInterval = setInterval(() => {
        this.goToSlide('>', 'autoPlay');
      }, options.autoPlayDuration || 4000);
    }
  }

  touchStartHandler(e) {
    // set x starting location in here
    this.simpleSlider.touches[0] = e.touches[0].screenX;
  }

  touchMoveHandler(e) {
    // set x location in here
    this.simpleSlider.touches[1] = e.touches[e.touches.length - 1].screenX;
  }

  touchEndHandler() {
    // handle where to go in here (prev or next)
    // eslint-disable-next-line no-shadow
    const { simpleSlider } = this;
    const firstTouch = simpleSlider.touches[0];
    const lastTouch = simpleSlider.touches[1];
    if (firstTouch === 0 || lastTouch === 0) {
      return;
    }
    const diff = Math.abs(lastTouch - firstTouch);
    if (diff < 50) {
      return;
    }
    if (lastTouch > firstTouch) {
      simpleSlider.goToSlide('<');
    }
    if (lastTouch < firstTouch) {
      simpleSlider.goToSlide('>');
    }
    simpleSlider.resetTouches();
  }

  mouseEnterHandler(){
    if (this.simpleSlider.options.autoPlay === true && this.simpleSlider.autoPlayInterval) {
      clearInterval(this.simpleSlider.autoPlayInterval);
    }
  }

  mouseLeaveHandler(){
    this.simpleSlider.autoPlay();
  }

  resetTouches() {
    this.touches = [0, 0];
  }

  setStyles() {
    const { root } = this;
    const styles = this.options.style;
    Object.keys(styles).forEach((key) => {
      root.style[key] = styles[key];
    });
    root.style.position = 'relative';
    root.style.overflow = 'hidden';

    let gap = 0;
    if (typeof this.options.gap === typeof '') {
      gap = this.options.gap.includes('rem') ? convertRemToPixels(parseFloat(this.options.gap)) : 0;
    } else if (typeof this.options.gap === typeof 1) {
      gap = this.options.gap;
    }
    /* root.style.display = 'flex'; */
  }

  getActiveSlide() {
    return this.currentSlide;
  }
}

// eslint-disable-next-line new-cap
const _simpleSlider = new simpleSlider();
export { _simpleSlider as simpleSlider };

/* 
      const event = new Event('changed');
      // Dispatch the event.
      this.dispatchEvent(event);
  */
