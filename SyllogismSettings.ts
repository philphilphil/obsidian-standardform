export interface SyllogismSettings {
	displayPrefixes: boolean;
	typeDefinitionSeparator: string;
	typeDisplaySeparator: string;

}
export const DEFAULT_SETTINGS: SyllogismSettings = {
	displayPrefixes: true,
	typeDefinitionSeparator: ":",
	typeDisplaySeparator: ".",
};
