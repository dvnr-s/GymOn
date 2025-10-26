"use client";

import {
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface HealthMetricsChartProps {
	data: Array<{
		date: string;
		weight: number;
		calories: number;
	}>;
}

export function HealthMetricsChart({ data }: HealthMetricsChartProps) {
	return (
		<ResponsiveContainer
			width="100%"
			height={350}
		>
			<LineChart data={data}>
				<XAxis
					dataKey="date"
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
					tickFormatter={(value) => `${value}`}
				/>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							return (
								<div className="rounded-lg border bg-background p-2 shadow-sm">
									<div className="grid grid-cols-2 gap-2">
										<div className="flex flex-col">
											<span className="text-[0.70rem] uppercase text-muted-foreground">
												Weight
											</span>
											<span className="font-bold text-muted-foreground">
												{payload[0].value} kg
											</span>
										</div>
										<div className="flex flex-col">
											<span className="text-[0.70rem] uppercase text-muted-foreground">
												Calories
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
				<Line
					type="monotone"
					dataKey="weight"
					stroke="#8884d8"
					strokeWidth={2}
					activeDot={{ r: 8 }}
				/>
				<Line
					type="monotone"
					dataKey="calories"
					stroke="#82ca9d"
					strokeWidth={2}
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
