self.onmessage = (e) => {
    const { action, data } = e.data;

    if (action === 'updateEnemyBullets') {
        const { bullets, player } = data;
        
        if (!bullets || !player) {
            console.warn('Invalid bullet or player data');
            return;
        }
        const updatedBullets = bullets.map((bullet) => {
            if (bullet && bullet.x !== undefined && bullet.y !== undefined) {
                const newX = bullet.x + 5;
                const newY = bullet.y;
                
                // Check for player collision
                const hit = Math.hypot(newX - player.x, newY - player.y) < player.radius;
                return hit ? null : { x: newX, y: newY };
            }
            return null;
        }).filter(bullet => bullet !== null);
        self.postMessage({
            action: 'updateEnemyBullets',
            updatedBullets
        });
    }

    else
        console.warn('Unrecognized action:', action);            
};