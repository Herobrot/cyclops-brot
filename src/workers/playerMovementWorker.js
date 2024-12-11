// playerMovementWorker.js
self.onmessage = (e) => {
    const { action, data } = e.data;

    if (action === 'calculatePlayerMovement') {
        const { x, y, speed, inputs, bounds } = data;
        let newX = x;
        let newY = y;

        if (inputs.left) newX -= speed;
        if (inputs.right) newX += speed;
        if (inputs.up) newY -= speed;
        if (inputs.down) newY += speed;

        if (bounds) {
            newX = Math.max(bounds.minX, Math.min(newX, bounds.maxX));
            newY = Math.max(bounds.minY, Math.min(newY, bounds.maxY));
        }
        
        self.postMessage({
            action: 'updatePlayerPosition',
            newPosition: { x: newX, y: newY }
        });
    }

    else
        console.warn('Acción no reconocida:', action);            
};