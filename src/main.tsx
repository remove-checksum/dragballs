import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";

const root = document.getElementById("root");

if (root === null) {
	throw new Error("no root");
}

ReactDOM.createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
