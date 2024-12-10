self.onmessage = function (event) {
    const { action, payload } = event.data;

    if (action === "initialize") {
        self.playerHealth = payload.health;
    }

    if (action === "hit") {
        self.playerHealth -= payload.damage;
        if (self.playerHealth <= 0) {
            self.postMessage({ status: "dead" });
            self.destroy();
        } else {
            self.postMessage({ status: "alive", health: self.playerHealth });
        }
    }

    if (action === "heal") {
        self.playerHealth += payload.amount;
        self.postMessage({ status: "alive", health: self.playerHealth });
    }
};
