import { Entity } from '../entity.js';
import { CONFIG } from '../game.js';
import { Obstacle } from './obstacle.js';

export class scrollingText extends Obstacle {
    constructor(x, y, width, height, text) {
        super(x, y, width, height, 'text', 'black');
        this.text = text;
    }

    update(dt) {
        super.update(dt);
    }
}