import layout from "./game-layout.module.css";

export function GameLayout({
	header,
	children,
}: {
	header: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<main className={layout.self}>
			<section className={layout.content}>
				<div className={layout.save}>{header}</div>
				{children}
			</section>
		</main>
	);
}
