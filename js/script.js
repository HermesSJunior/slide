import SlideNavigation from './slide.js';

const slide = new SlideNavigation('.slide', '.slide_wrapper');
slide.init();
slide.addArrow('.previous', '.next');
slide.addControl('.custom_controls');