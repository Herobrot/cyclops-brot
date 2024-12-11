let playerHP = 5;
let enemyHP = 50;

self.onmessage = (e) => {
    const { action } = e.data;
    console.log('Acción recibida:', action);
    switch (action) {
        case 'hitPlayer':
            playerHP -= 1;
            self.postMessage({
                action: 'updatePlayerHP',
                newHP: playerHP,
            });
            if (playerHP <= 0) {
                self.postMessage({ action: 'playerDied' });
            }
            break;

        case 'hitEnemy':
            enemyHP -= 1;
            self.postMessage({
                action: 'updateEnemyHP',
                newHP: enemyHP,
            });
            if (enemyHP <= 0) {
                console.log('Enemy died');
                self.postMessage({ action: 'enemyDied' });
            }
            break;

        case 'resetEnemy':
            enemyHP = 3;
            break;

        case 'resetPlayer':
            playerHP = 3;
            break;

        default:
            console.error('Acción no soportada:', action);
            break;
    }
};
