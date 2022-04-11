//let a = 6;

import {a} from './moduleC.js';

let c = function() {

    console.log(a);
}

export {a, c};