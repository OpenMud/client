import { System, SystemType, Scene, Entity, Sound } from "excalibur";

import { ConfigureSoundMessage, SoundConfiguration } from "../messages/ConfigureSoundMessage";

interface ChannelState {
    origin: ConfigureSoundMessage,
    sound: Sound,
    config: SoundConfiguration
}

export class SoundSystem extends System {
    public systemType = SystemType.Update
    public readonly types = ['untyped_system'] as const;

    private scene: Scene | undefined;
    private readonly channelState: Map<number, ChannelState> = new Map<number, ChannelState>();

    constructor(private readonly gameSounds: any) {
        super();
    }

    override initialize(scene: Scene): void {
        this.scene = scene;
        this.scene.on('configureSound', (t) => this.ConfigureSound(t as ConfigureSoundMessage));
    }

    private ApplySoundConfig(channel: number, cfg : SoundConfiguration) {
        const sound = this.channelState.get(channel)!.sound;

        switch(cfg) {
            case SoundConfiguration.Loop:
                sound.loop = true;
                sound.play();
                break;
            case SoundConfiguration.PlayOnce:
                sound.loop = false;
                sound.play();
                break;
            case SoundConfiguration.Stop:
                sound.stop();
                break;
            default:
                throw new Error("Unknown state.");
        }
    }

    private ConfigureSound(config: ConfigureSoundMessage): void {
        if(this.channelState.has(config.channel) && this.channelState.get(config.channel)!.origin.frame > config.frame)
            return;

        var old = this.channelState.get(config.channel);

        if(old)
            old.sound.stop();
    
        const fieldName = config.name as keyof typeof this.gameSounds;
        var sound = this.gameSounds[fieldName] as Sound;

        if(sound) {
            this.channelState.delete(config.channel);

            var newState : ChannelState = {
                origin: config,
                sound: sound,
                config: config.config
            }

            this.channelState.set(config.channel, newState);
        } else {
            const currentState = this.channelState.get(config.channel);
            currentState!.config = config.config;
        }

        this.ApplySoundConfig(config.channel, config.config);
    }


    public update(entities: Entity[], delta: number) { }

}

