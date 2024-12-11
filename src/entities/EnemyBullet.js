export default class BulletEnemy extends Phaser.Physics.Arcade.Image
{
    constructor(scene){
        super(scene, 0, 0, 'bullet');

        this.speed = 1000;
        this.lifespan = 1000;

        this._temp = new Phaser.Math.Vector2();
    }
    fire(enemy, angleRad) {
        const offsetY = 40;
        const offsetX = 50;
    
        const bulletX = enemy.x + offsetX * Math.cos(angleRad);
        const bulletY = enemy.y + offsetY + offsetX * Math.sin(angleRad);
    
        const adjustedAngleRad = Phaser.Math.Angle.Between(bulletX, bulletY, this.scene.player.x, this.scene.player.y);
    
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(Phaser.Math.RadToDeg(adjustedAngleRad));
        this.setPosition(bulletX, bulletY);
        this.body.reset(bulletX, bulletY);
        this.scene.physics.velocityFromRotation(adjustedAngleRad, this.speed, this.body.velocity);
    
        this.lifespan = 1000;
    
        this.body.velocity.x *= 2;
        this.body.velocity.y *= 2;
    }
    
    update (time, delta)
    {
        this.lifespan -= delta;

        if (this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
            this.body.reset();
        }
    }
}