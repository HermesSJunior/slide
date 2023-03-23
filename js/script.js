import Slide from './slide.js';

const slide = new Slide('.slide', '.slide_wrapper');
slide.init();
slide.changeSlide(3);
slide.activePreviousSlide();