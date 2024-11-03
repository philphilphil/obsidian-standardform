export interface SyllogismSettings {
	propositionPrefix: string;
	conclusionPrefix: string;
}
export const DEFAULT_SETTINGS: SyllogismSettings = {
	propositionPrefix: 'P',
	conclusionPrefix: 'C'
};
