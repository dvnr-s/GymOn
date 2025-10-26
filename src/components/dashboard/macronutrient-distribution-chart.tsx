"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface MacronutrientDistributionChartProps {
	data: {
		protein: number;
		carbs: number;
		fat: number;
	};
}

export function MacronutrientDistributionChart({
	data,
}: MacronutrientDistributionChartProps) {
	const chartData = [
		{ name: "Protein", value: data.protein },
		{ name: "Carbs", value: data.carbs },
		{ name: "Fat", value: data.fat },
	];

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

	return (
		<ResponsiveContainer
			width="100%"
			height={350}
		>
			<PieChart>
				<Pie
					data={chartData}
					cx="50%"
					cy="50%"
					labelLine={false}
					outerRadius={100}
					fill="#8884d8"
					dataKey="value"
					label={({ name, percent }) =>
						`${name} ${(percent * 100).toFixed(0)}%`
					}
				>
					{chartData.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={COLORS[index % COLORS.length]}
						/>
					))}
				</Pie>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							return (
								<div className="rounded-lg border bg-background p-2 shadow-sm">
									<div className="flex flex-col">
										<span className="text-[0.70rem] uppercase text-muted-foreground">
											{payload[0].name}
										</span>
										<span className="font-bold text-muted-foreground">
											{payload[0].value}g (
											{(
												(Number(payload[0].value) /
													(data.protein + data.carbs + data.fat)) *
												100
											).toFixed(1)}
											%)
										</span>
									</div>
								</div>
							);
						}
						return null;
					}}
				/>
			</PieChart>
		</ResponsiveContainer>
	);
}
