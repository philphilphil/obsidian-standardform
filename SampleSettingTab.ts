import Syllogism from "main";
import { PluginSettingTab, App, Setting } from "obsidian";

export class SampleSettingTab extends PluginSettingTab {
	plugin: Syllogism;

	constructor(app: App, plugin: Syllogism) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Proposition Prefix')
			.setDesc('The prefix for propositions (e.g., P1, P2, ...)')
			.addText(text => text
				.setPlaceholder('P')
				.setValue(this.plugin.settings.propositionPrefix)
				.onChange(async (value) => {
					this.plugin.settings.propositionPrefix = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Conclusion Prefix')
			.setDesc('The prefix for the conclusion')
			.addText(text => text
				.setPlaceholder('P')
				.setValue(this.plugin.settings.conclusionPrefix)
				.onChange(async (value) => {
					this.plugin.settings.conclusionPrefix = value;
					await this.plugin.saveSettings();
				}));
	}
}
