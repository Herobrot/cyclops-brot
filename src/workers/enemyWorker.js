self.onmessage = function (event) {
    const { action, payload } = event.data;

    if (action === "initialize") {
        self.enemyHealth = payload.health;
        self.bulletDamage = payload.bulletDamage;
    }

    if (action === "hit") {
        self.enemyHealth -= self.bulletDamage;
        if (self.enemyHealth <= 0) {
            self.postMessage({ status: "dead" });
            self.destroy();
        } else {
            self.postMessage({ status: "alive", health: self.enemyHealth });
        }
    }
};
