self.onmessage = (e) => {
    const { action, data } = e.data;
    
    if (action === 'calculateEnemyMovement') {
        if (data && data.x !== undefined && data.y !== undefined && data.speed && data.bounds) {
            const { x, y, speed, bounds } = data;
            const newX = x + speed.x;
            const newY = y + speed.y;

            // Rebotar en los límites
            const adjustedX = newX < bounds.minX || newX > bounds.maxX ? -speed.x : speed.x;
            const adjustedY = newY < bounds.minY || newY > bounds.maxY ? -speed.y : speed.y;

            self.postMessage({
                action: 'updateEnemyPosition',
                newPosition: { x: newX, y: newY },
                newSpeed: { x: adjustedX, y: adjustedY }
            });
        } else {
            console.error('Datos incompletos o inválidos recibidos en "calculateEnemyMovement":', data);
        }
    } else {
        console.error('Acción no reconocida:', action);
    }
};
