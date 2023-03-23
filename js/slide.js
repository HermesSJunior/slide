import debounce from './debounce.js';

export class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.distance = { finalPosition: 0, startX: 0, movement: 0 }
        this.activeClass = 'active';
    }

    moveSlide(distanceX) {
        this.distance.movePosition = distanceX;
        this.slide.style.transform = `translate3d(${distanceX}px, 0, 0)`;
    }

    updatePosition(clientX) {
        this.distance.movement = (this.distance.startX - clientX) * 1.6;
        return this.distance.finalPosition - this.distance.movement;
    }

    onStart(event) {
        let moveType;

        if (event.type === 'mousedown') {
            event.preventDefault();
            this.distance.startX = event.clientX;
            moveType = 'mousemove';
        } else {
            this.distance.startX = event.changedTouches[0].clientX;
            moveType = 'touchmove';
        }

        this.wrapper.addEventListener(moveType, this.onMove);
        this.trasition(false);
    }

    trasition(active) {
        this.slide.style.trasition = active ? 'transform: 0.3s;' : '';
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(moveType, this.onMove);
        this.distance.finalPosition = this.distance.movePosition;
        this.trasition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        if (this.distance.movement > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if (this.distance.movement < -120 && this.index.previous !== undefined) {
            this.activePreviousSlide();
        } else {
            this.changeSlide(this.index.active);
        }
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return -(slide.offsetLeft - margin);
    }

    // Slides configuration
    slidesConfiguration() {
        this.slideArray = [...this.slide.children].map((element) => {
            const position = this.slidePosition(element);
            return { position, element }
        });
    }

    slidesIndexNavigation(index) {
        const last = this.slideArray.length - 1;
        this.index = {
            previous: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        }
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.position);
        this.slidesIndexNavigation(index);
        this.distance.finalPosition = activeSlide.position;
        this.changeActiveClass();
    }

    changeActiveClass() {
        this.slideArray.forEach(item => item.element.classList.remove(this.activeClass));
        this.slideArray[this.index.active].element.classList.add(this.activeClass);
    }

    activePreviousSlide() {
        if (this.index.previous !== undefined) this.changeSlide(this.index.previous);
    }

    activeNextSlide() {
        if (this.index.next !== undefined) this.changeSlide(this.index.next);
    }

    onResize() {
        setTimeout(() => {
            this.slidesConfiguration();
            this.changeSlide(this.index.active);
        }, 1000);
    }

    addResizeEvent() {
        window.addEventListener('resize', this.onResize);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.activePreviousSlide = this.activePreviousSlide.bind(this);
        this.activeNextSlide = this.activeNextSlide.bind(this);
        this.onResize = debounce(this.onResize.bind(this), 200);
    }

    init() {
        this.bindEvents();
        this.trasition(true);
        this.addSlideEvents();
        this.slidesConfiguration();
        this.addResizeEvent();
        this.changeSlide(0);
        return this;
    }
}

export class SlideNavigation extends Slide {
    addArrow(previous, next) {
        this.previousElement = document.querySelector(previous);
        this.nextElement = document.querySelector(next);
        this.addArrowEvent();
    }

    addArrowEvent() {
        this.previousElement.addEventListener('click', this.activePreviousSlide);
        this.nextElement.addEventListener('click', this.activeNextSlide);
    }
}