export class PlayerService {
    constructor() {
        this.worker = new Worker('src/workers/playerWorker.js');
    }

    start(callback){
        this.worker.onmessage = (event) => {
            callback(event.data);
        }
    }
}