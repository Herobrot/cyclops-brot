export default class Bullet extends Phaser.Physics.Arcade.Image
{
    constructor (scene)
    {
        super(scene, 0, 0, 'bullet');

        this.speed = 1000;
        this.lifespan = 1000;

        this._temp = new Phaser.Math.Vector2();
    }
    fire (player, angleRad)
    {
        this.setActive(true);
        this.setVisible(true);
        this.setAngle(player.angle);
        this.setPosition(player.x, player.y);
        this.body.reset(player.x, player.y);
        this.scene.physics.velocityFromRotation(angleRad, this.speed, this.body.velocity);

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
