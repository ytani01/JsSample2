//
// Copyright (c) 2022 Yoichi Tanibayashi
//
/**
 * MyBase .. w, h, z
 *  |
 *  +- MyTouchable .. onmouseXXX
 *      |
 *      +- MyMoveable .. absolute, x, y
 */

/**
 *
 */
class MyBase {
    /**
     * @param {string} id string
     */
    constructor(id, innerHTML=undefined) {
        this.id = id;
        this.el = document.getElementById(this.id);

        const domRect = this.el.getBoundingClientRect();
        this.x = Math.floor(domRect.x);
        this.y = Math.floor(domRect.y);
        this.w = Math.floor(domRect.width);
        this.h = Math.floor(domRect.height);
        this.right = Math.floor(domRect.right);
        this.bottom = Math.floor(domRect.bottom);

        this.z = this.el.style.zIndex;
        if ( ! this.z ) {
            this.set_z(1);
        }
        console.log(`id=${this.id}, <${this.el.tagName}> [${this.x},${this.y}],[${this.right},${this.bottom}],${this.w}x${this.h},z=${this.z}`);

        if ( innerHTML !== undefined ) {
            this.set_innerHTML(innerHTML);
        } else if ( this.el.innerHTML ) {
            this.innerHTML = this.el.innerHTML.trim();
        }

        this.prev_msec = 0;

    } // MyBase.constructor()
     
    /**
     *
     */
    isOn(x, y) {
        if ( x >= this.x && x <= (this.x + this.w) &&
             y >= this.y && y <= (this.y + this.h) ) {
            console.log(`${this.id}> isOn(${x},${y}): true`);
            return true;
        }
        return false;
    } // MyBase.on()

    /**
     * @param {string} innerHTML
     */
    set_innerHTML(innerHTML) {
        this.innerHTML = innerHTML.trim();
        this.el.innerHTML = this.innerHTML;
    } // MyBase.set_innerHTML()

    /**
     * @param {number} z
     */
    set_z(z) {
        this.z = z;
        this.el.style.zIndex = this.z;
    } // MyBase.set_z()

    /**
     * @param {number} z (optional)
     */
    on(z=1) {
        this.el.style.opacity = 1;
        this.set_z(z);
    } // MyBase.on()

    /**
     *
     */
    off() {
        this.el.style.opacity = 0;
        this.set_z(0);
    } // MyBase.off()

    /**
     *
     */
    enableUpdate() {
        if ( UpdateObj.indexOf(this) >= 0 ) {
            UpdateObj.push(this);
        }
    } // MyBase.enableUpdate()

    /**
     * @param {number} current msec
     */
    update(cur_msec) {
        // to be overridden

        if ( UpdateObj.indexOf(this) >= 0 ) {
            if ( this.prev_lap === undefined ) {
                this.prev_lap = 0;
            }
            if ( cur_msec - this.prev_lap >= 1000 ) {
                console.log(`${this.id} update> ${cur_msec/1000} ${cur_msec - this.prev_lap}`);
                this.prev_lap = cur_msec;
            }
        }
        this.prev_msec = cur_msec;
    } // MyBase.update()

} // class MyBase

/**
 *
 */
class MyTouchable extends MyBase {
    /**
     * @param {string} id
     * @param {string} innerHTML
     */
    constructor(id, innerHTML=undefined) {
        super(id, innerHTML);

        this.el.onmousedown = this.on_mouse_down.bind(this);
        this.el.ontouchstart = this.on_mouse_down.bind(this);
        this.el.onmouseup = this.on_mouse_up.bind(this);
        this.el.ontouchend = this.on_mouse_up.bind(this);
        this.el.onmousemove = this.on_mouse_move.bind(this);
        this.el.ontouchmove = this.on_mouse_move.bind(this);
        this.el.ondragstart = this.null_handler.bind(this);
    }

    /**
     * touch event to mouse event
     * only for get_xy() function
     *
     * @param {MouseEvent} e
     */
    touch2mouse(e) {
        e.preventDefault();
        if ( e.changedTouches ) {
            e = e.changedTouches[0];
        }
        return e;
    } // MyBase.touch2mouse()
    
    /**
     * @param {MouseEvent} e
     */
    get_xy(e) {
        e = this.touch2mouse(e);
        return [Math.round(e.pageX), Math.round(e.pageY)];
    } // MyBase.get_xy()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_down(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_down_xy(x, y);
    } // MyBase.on_mouse_down()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_up(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_up_xy(x, y);
    } // MyBase.on_mouse_up()

    /**
     * @param {MouseEvent} e
     */
    on_mouse_move(e) {
        let [x, y] = this.get_xy(e);
        this.on_mouse_move_xy(x, y);
    } // MyBase.on_mouse_move()

    /**
     * @param {MouseEvent} e
     */
    null_handler(e) {
        return false;
    } // MyBase.null_handler()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_down_xy(x, y) {
        // to be overridden
        console.log(`${this.id} mouse_down(${x}, ${y})`);
    } // MyBase.on_mouse_down_xy()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_up_xy(x, y) {
        // to be overridden
        console.log(`${this.id} mouse_up[${x}, ${y}]`);
    } // MyBase.on_mouse_down_xy()

    /**
     * @param {number} x
     * @param {number} y
     */
    on_mouse_move_xy(x, y) {
        // to be overridden
        console.log(`${this.id} mouse_move[${x}, ${y}]`);
    } // MyBase.on_mouse_down_xy()
        
} // class MyTouchable

/**
 *
 */
class MyImage extends MyTouchable {
    /**
     *
     */
    constructor(id, x=undefined, y=undefined, innerHTML=undefined) {
        super(id, x, y, innerHTML);

        this.image_el = this.el.children[0];

        const domRect = this.image_el.getBoundingClientRect();
        this.x = Math.floor(domRect.x);
        this.y = Math.floor(domRect.y);
        this.w = Math.floor(domRect.width);
        this.h = Math.floor(domRect.height);
        this.right = Math.floor(domRect.right);
        this.bottom = Math.floor(domRect.bottom);

        this.image_src = this.image_el.src;

        const n = this.image_src.lastIndexOf("/");
        this.image_parent_url = this.image_src.slice(0, n+1);
        this.image_file_name = this.image_src.slice(n+1);

        console.log(`${this.image_parent_url} / ${this.image_file_name}`);
    } // MyImage.constructor()

    /**
     *
     */
    set_image_file(image_file) {
        const image_url = this.image_parent_url + image_file;
        this.image_el.src = image_url;
        this.image_file_name = image_file;
    }
    
} // class MyImage

/**
 *
 */
class MyMoveable extends MyTouchable {
    /**
     * @param {string} id
     * @param {string} innerHTML
     * @param {number} x
     * @param {number} y
     */
    constructor(id, x=undefined, y=undefined, innerHTML=undefined) {
        super(id, innerHTML);

        this.el.style.position = "absolute";

        if ( x !== undefined && y !== undefined ) {
            this.move(x, y);
        }

    } // MyMoveable.constructor()

    /**
     * @param {number} x
     * @param {number} y
     */
    move(x, y) {
        if ( x === undefined || y === undefined ) {
            return;
        }

        this.x = x;
        this.y = y;

        this.el.style.left = `${this.x}px`;
        this.el.style.top = `${this.y}px`;
    } // MyMoveable.move()

    /**
     *
     */
    move_center(x, y) {
        if ( x === undefined || y === undefined ) {
            return;
        }

        const x1 = x - this.w / 2;
        const y1 = y - this.h / 2;
        this.move(x1, y1);
    } // MyMoveable.move_center()
} // class MyMoveable

/**
 *
 */
class MyDraggable extends MyMoveable {
    /**
     *
     */
    constructor(id, x=undefined, y=undefined, innerHTML=undefined) {
        super(id, x, y, innerHTML);
        this.moving = false;
        this.draggable = false;
    }

    on_mouse_down_xy(x, y) {
        console.log(`${this.id} [${x},${y}]`);
        if ( ! this.draggable ) {
            return;
        }
        this.moving = true;
        this.orig_z = this.z;
        this.set_z(1000);
        this.move_center(x, y);
    }

    on_mouse_up_xy(x, y) {
        console.log(`${this.id} [${x},${y}]`);
        this.moving = false;
        this.set_z(this.orig_z);
    }

    on_mouse_move_xy(x, y) {
        if ( this.moving ) {
            this.move_center(x,y);
        }
    }
} // class MyDraggable

//////////
const UPDATE_INTERVAL = 27; // msec
let UpdateObj = [];
let PrevLap = 0;

/**
 *
 */
const updateAll = () => {
    const cur_msec = (new Date()).getTime();
    
    if ( cur_msec - PrevLap >= 1000 ) {
        console.log(`updateAll> ${cur_msec/1000} ${cur_msec - PrevLap}`);
        PrevLap = cur_msec;
    }
    
    UpdateObj.forEach(obj => {
        obj.update(cur_msec);
    });
}; // update_All()


//////////
const ImageAirPump1 = "AirPump1.png";
const ImageAirPump2 = "AirPump2.png";

let timerId1;
let objAirPump;
let objSwipeTop, objSwipeArea, objSwipeBottom;
let objSwipeCount;
let swipeCount = 0;

/**
 *
 */
class AirPump extends MyImage {
    /**
     *
     */
    constructor(id, image1, image2) {
        super(id);

        this.image1 = image1;
        this.image2 = image2;

        this.pushed = false;
    }

    push_pump() {
        this.pushed = true;
        this.set_image_file(this.image2);
    }

    pull_pump() {
        this.pushed = false;
        this.set_image_file(this.image1);
        clearTimeout(timerId1);
    }
  
} // class AirPump

/**
 *
 */
class SwipeTop extends MyImage {
    /**
     *
     */
    constructor(id) {
        super(id);

        this.swiping = false;
    } // SwipeTop.constructor()

    /**
     *
     */
    on_mouse_down_xy(x, y) {
        this.swiping = true;
        console.log(`on_mouse_down_xy(${x},${y}): swiping=${this.swiping}`);
    } // SwipeTop.on_mousedown_xy()

    /**
     *
     */
    on_mouse_move_xy(x, y) {
        if ( ! this.swiping ) {
            console.log(`A on_mouse_move_xy(${x},${y}): swiping=${this.swiping}`);
            return;
        }
        if ( objSwipeTop.isOn(x, y) || objSwipeArea.isOn(x, y) ) {
            console.log(`B on_mouse_move_xy(${x},${y}): swiping=${this.swiping}`);
            return;
        }
        if ( objSwipeBottom.isOn(x, y) ) {
            this.on_swipe_complete();
        }
        this.swiping = false;
        console.log(`C on_mouse_move_xy(${x},${y}): swiping=${this.swiping}`);
    } // SwipeTop.on_mouse_move_xy()

    /**
     *
     */
    on_mouse_up_xy(x, y) {
        this.swiping = false;
    } // SwipeTop.on_mouse_move_xy()

    /**
     *
     */
    on_swipe_complete() {
        console.log(`Swipe Complete !!`);
        objAirPump.push_pump();
        swipeCount++;
        objSwipeCount.set_innerHTML(String(swipeCount));

        timerId1 = setInterval(() => {
            objAirPump.pull_pump();
        }, 300);
    } // SwipeTop.on_swipe_complete()
}; // class SwipeTop

/**
 *
 */
window.onload = () => {
    console.log(`window.onload()> start`);

    objAirPump = new AirPump("air_pump", ImageAirPump1, ImageAirPump2);
    objSwipeArea = new MyImage("swipe_area");
    objSwipeBottom = new MyImage("swipe_bottom");
    objSwipeTop = new SwipeTop("swipe_top");

    swipeCount = 0;
    objSwipeCount = new MyBase("swipe_count", String(swipeCount));

    // setInterval(updateAll, UPDATE_INTERVAL);
}; // window.onload
