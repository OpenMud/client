import { SoundConfiguration } from "../messages/ConfigureSoundMessage";

export interface SvrConfigureSoundMessage {
    entity_identifier_scope: string;
    sound: string;
    channel: number;
    configuration: SoundConfiguration;
}
