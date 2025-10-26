"use client";

import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";

interface CalorieGoalChartProps {
	data: Array<{
		day: string;
		consumed: number;
		target: number;
	}>;
}

export function CalorieGoalChart({ data }: CalorieGoalChartProps) {
	return (
		<ResponsiveContainer
			width="100%"
			height={350}
		>
			<BarChart data={data}>
				<XAxis
					dataKey="day"
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `${value} kcal`}
				/>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							return (
								<div className="rounded-lg border bg-background p-2 shadow-sm">
									<div className="grid grid-cols-2 gap-2">
										<div className="flex flex-col">
											<span className="text-[0.70rem] uppercase text-muted-foreground">
												Consumed
											</span>
											<span className="font-bold text-muted-foreground">
												{payload[0].value} kcal
											</span>
										</div>
										<div className="flex flex-col">
											<span className="text-[0.70rem] uppercase text-muted-foreground">
												Target
											</span>
											<span className="font-bold text-muted-foreground">
												{payload[1].value} kcal
											</span>
										</div>
									</div>
								</div>
							);
						}
						return null;
					}}
				/>
				<Bar
					dataKey="consumed"
					fill="#8884d8"
					radius={[4, 4, 0, 0]}
				/>
				<Bar
					dataKey="target"
					fill="#82ca9d"
					radius={[4, 4, 0, 0]}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}
