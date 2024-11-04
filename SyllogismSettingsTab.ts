import Syllogism from "main";
import { PluginSettingTab, App, Setting } from "obsidian";

export class SyllogismSettingsTab extends PluginSettingTab {
	plugin: Syllogism;

	constructor(app: App, plugin: Syllogism) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Type Separator')
			.setDesc('The separator between the type and the text. eg. P1":" or P1" - "')
			.addText(text => text
				.setPlaceholder(':')
				.setValue(this.plugin.settings.typeseparator)
				.onChange(async (value) => {
					this.plugin.settings.typeseparator = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Display Prefixes?')
			.setDesc('Show or not show P1, P2, ... and C prefixes')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.displayPrefixes)
				.onChange(async (value) => {
					this.plugin.settings.displayPrefixes = value;
					await this.plugin.saveSettings();
				}));
	}
}
