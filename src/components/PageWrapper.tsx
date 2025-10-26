"use client";

import { type HTMLMotionProps, motion } from "framer-motion";

const PageWrapper = (props: HTMLMotionProps<"div">) => {
	return (
		<div className="bg-background">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1 }}
				{...props}
			/>
		</div>
	);
};

export default PageWrapper;
