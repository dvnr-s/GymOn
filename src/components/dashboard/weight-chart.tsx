"use client";

import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface WeightChartProps {
	data: Array<{
		date: string;
		weight: number;
	}>;
}

export function WeightChart({ data }: WeightChartProps) {
	return (
		<ResponsiveContainer
			width="100%"
			height={350}
		>
			<AreaChart
				data={data}
				margin={{
					top: 10,
					right: 30,
					left: 0,
					bottom: 0,
				}}
			>
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
					tickFormatter={(value) => `${value} kg`}
					domain={["dataMin - 2", "dataMax + 2"]}
				/>
				<Tooltip
					content={({ active, payload }) => {
						if (active && payload && payload.length) {
							return (
								<div className="rounded-lg border bg-background p-2 shadow-sm">
									<div className="flex flex-col">
										<span className="text-[0.70rem] uppercase text-muted-foreground">
											Weight
										</span>
										<span className="font-bold text-muted-foreground">
											{payload[0].value} kg
										</span>
									</div>
								</div>
							);
						}
						return null;
					}}
				/>
				<Area
					type="monotone"
					dataKey="weight"
					stroke="#8884d8"
					fill="#8884d8"
					fillOpacity={0.3}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
