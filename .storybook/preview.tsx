import "../src/storybook.css";

import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
	parameters: {
		layout: "padded",
		viewport: { options: { phone: { name: "Телефон 390", styles: { width: "390px", height: "844px" } } } },
		options: { storySort: { order: ["Labs UI", ["Primitives", "Shell", "Auth"]] } },
	},
	tags: ["autodocs"],
};
export default preview;
