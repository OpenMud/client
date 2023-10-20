
export enum SoundConfiguration {
    Stop,
    PlayOnce,
    Loop
}

export class ConfigureSoundMessage {
    public constructor(
        public readonly name : string | undefined,
        public readonly channel : number,
        public readonly config : SoundConfiguration,
        public readonly frame: number
    ) { }
}