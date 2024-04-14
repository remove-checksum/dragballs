import { BilliardTable } from "./billiard-table";
import layout from "./game-layout.module.css";

export function App() {
	return (
		<main>
			<section className={layout.content}>
				<h2 className={layout.header}>Bounce</h2>
				<BilliardTable />
			</section>
		</main>
	);
}
