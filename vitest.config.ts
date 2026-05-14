import { defineConfig } from "vitest/config";
import * as path from "path";

export default defineConfig({
	test: {
		environment: "happy-dom",
		include: ["test/**/*.test.ts"],
		setupFiles: ["test/setup.ts"],
	},
	resolve: {
		alias: {
			obsidian: path.resolve(__dirname, "test/__mocks__/obsidian.ts"),
		},
	},
});
