import type { DietPlan } from "@/types/diet";

export const dietPlans: DietPlan[] = [
	{
		id: "mediterranean",
		name: "Mediterranean Diet",
		shortDescription: "Heart-healthy diet inspired by Mediterranean cuisine",
		description:
			"The Mediterranean diet is inspired by the eating habits of people who live near the Mediterranean Sea. This diet plan is rich in vegetables, fruits, whole grains, nuts, seeds, and olive oil. Fish and seafood are consumed regularly, while poultry, eggs, and dairy are eaten in moderate amounts. Red meat is limited, and processed foods are avoided.",
		dailyCalories: 2000,
		macroRatio: {
			protein: 15,
			carbs: 50,
			fat: 35,
		},
		tags: ["Heart-healthy", "Balanced", "Anti-inflammatory"],
		benefits: [
			"Reduces risk of heart disease",
			"May help with weight management",
			"Improved cognitive function",
			"Lower risk of certain cancers",
			"Reduced inflammation",
		],
		recommendedFor:
			"People looking to improve heart health, reduce inflammation, and maintain a balanced approach to eating without strict rules.",
		duration: "Lifestyle change (long-term)",
		sampleMeals: [
			{
				name: "Breakfast",
				time: "7:00 AM",
				calories: 400,
				items: [
					"Greek yogurt with honey and walnuts",
					"Fresh berries",
					"Whole grain toast with olive oil",
				],
			},
			{
				name: "Lunch",
				time: "12:30 PM",
				calories: 600,
				items: [
					"Greek salad with feta cheese, olives, and olive oil dressing",
					"Whole grain pita bread",
					"Hummus",
				],
			},
			{
				name: "Dinner",
				time: "7:00 PM",
				calories: 700,
				items: [
					"Grilled fish with lemon and herbs",
					"Roasted vegetables with olive oil",
					"Brown rice",
					"Glass of red wine (optional)",
				],
			},
			{
				name: "Snack",
				time: "3:00 PM",
				calories: 300,
				items: ["Handful of mixed nuts", "Fresh fruit", "Olives"],
			},
		],
		tipsSummary:
			"The Mediterranean diet is more of a lifestyle than a strict diet. Focus on these key strategies for success:",
		tips: [
			"Use olive oil as your primary cooking fat",
			"Eat plenty of vegetables with every meal",
			"Include fish at least twice a week",
			"Limit red meat to a few times per month",
			"Enjoy fresh fruit for dessert instead of processed sweets",
			"Include nuts and seeds as healthy snacks",
			"Use herbs and spices instead of salt for flavor",
		],
	},
	{
		id: "keto",
		name: "Ketogenic Diet",
		shortDescription: "High-fat, low-carb diet that promotes ketosis",
		description:
			"The ketogenic diet is a high-fat, very low-carbohydrate diet that aims to put your body into a metabolic state called ketosis. In this state, your body becomes incredibly efficient at burning fat for energy. It also turns fat into ketones in the liver, which can supply energy for the brain. The standard ketogenic diet typically contains 70-75% fat, 20% protein, and only 5-10% carbohydrates.",
		dailyCalories: 1800,
		macroRatio: {
			protein: 20,
			carbs: 5,
			fat: 75,
		},
		tags: ["Low-carb", "High-fat", "Weight loss"],
		benefits: [
			"Rapid weight loss",
			"Reduced appetite",
			"Improved insulin sensitivity",
			"May benefit certain medical conditions",
			"Increased mental clarity for some people",
		],
		recommendedFor:
			"People looking for significant weight loss, those who struggle with carb cravings, and some individuals with specific medical conditions (under medical supervision).",
		duration: "Short-term (3-6 months) or cycling periods",
		sampleMeals: [
			{
				name: "Breakfast",
				time: "8:00 AM",
				calories: 500,
				items: [
					"Avocado and bacon omelet with cheese",
					"Bulletproof coffee (coffee with butter and MCT oil)",
				],
			},
			{
				name: "Lunch",
				time: "1:00 PM",
				calories: 600,
				items: [
					"Chicken salad with mixed greens, olive oil, and avocado",
					"Hard-boiled eggs",
					"Handful of macadamia nuts",
				],
			},
			{
				name: "Dinner",
				time: "7:00 PM",
				calories: 600,
				items: [
					"Steak with herb butter",
					"Cauliflower mash with cream and cheese",
					"Asparagus sauteed in olive oil",
				],
			},
			{
				name: "Snack",
				time: "4:00 PM",
				calories: 200,
				items: ["String cheese", "Pepperoni slices", "Olives"],
			},
		],
		tipsSummary:
			"The keto diet requires careful planning to maintain ketosis. Here are some important guidelines:",
		tips: [
			"Track your carb intake carefully (typically 20-50g per day)",
			"Focus on high-quality fats like avocados, olive oil, and nuts",
			"Stay well-hydrated and supplement electrolytes",
			"Prepare for the 'keto flu' during the transition period",
			"Read food labels carefully - hidden carbs are everywhere",
			"Include plenty of non-starchy vegetables",
			"Consider using ketone testing strips when starting out",
		],
	},
	{
		id: "plant-based",
		name: "Plant-Based Diet",
		shortDescription: "Focused on minimally processed plant foods",
		description:
			"A plant-based diet centers around foods derived from plants, including vegetables, fruits, whole grains, legumes, nuts, and seeds, with few or no animal products. This diet emphasizes whole, minimally processed foods and excludes or minimizes meat, dairy products, eggs, and refined foods like added sugars, white flour, and processed oils. It's rich in fiber, vitamins, and minerals, while being naturally lower in calories and saturated fat than omnivorous diets.",
		dailyCalories: 1800,
		macroRatio: {
			protein: 15,
			carbs: 65,
			fat: 20,
		},
		tags: ["Vegan-friendly", "High-fiber", "Environmentally sustainable"],
		benefits: [
			"Lower risk of heart disease",
			"Better weight management",
			"Reduced risk of certain cancers",
			"Improved digestion",
			"Smaller environmental footprint",
			"Often more affordable",
		],
		recommendedFor:
			"People interested in improving health, reducing environmental impact, supporting animal welfare, or managing chronic health conditions.",
		duration: "Lifestyle change (long-term)",
		sampleMeals: [
			{
				name: "Breakfast",
				time: "7:30 AM",
				calories: 400,
				items: [
					"Overnight oats with plant milk, chia seeds, and berries",
					"Sliced banana",
					"Tablespoon of almond butter",
				],
			},
			{
				name: "Lunch",
				time: "12:30 PM",
				calories: 550,
				items: [
					"Buddha bowl with quinoa, roasted sweet potatoes, chickpeas",
					"Steamed broccoli and avocado",
					"Tahini lemon dressing",
				],
			},
			{
				name: "Dinner",
				time: "6:30 PM",
				calories: 650,
				items: [
					"Lentil and vegetable stew",
					"Brown rice",
					"Side salad with vinaigrette",
					"Nutritional yeast as topping",
				],
			},
			{
				name: "Snack",
				time: "3:30 PM",
				calories: 200,
				items: [
					"Apple with peanut butter",
					"Handful of mixed nuts",
					"Herbal tea",
				],
			},
		],
		tipsSummary:
			"Transitioning to a plant-based diet can be easier with these strategies:",
		tips: [
			"Make gradual changes rather than overhauling your diet overnight",
			"Focus on adding plant foods rather than just removing animal products",
			"Ensure adequate protein from beans, lentils, tofu, tempeh, and nuts",
			"Consider B12 supplementation for fully vegan diets",
			"Experiment with meat alternatives if helpful during transition",
			"Learn to make plant-based versions of your favorite meals",
			"Try international cuisines that are naturally plant-focused",
		],
	},
	{
		id: "intermittent-fasting",
		name: "Intermittent Fasting",
		shortDescription: "Cycling between periods of eating and fasting",
		description:
			"Intermittent fasting is an eating pattern that cycles between periods of eating and fasting. It doesn't specify which foods to eat, but rather when to eat them. Common methods include the 16/8 method (16 hours of fasting, 8-hour eating window), the 5:2 diet (eating normally 5 days a week, restricting calories to 500-600 for 2 days), and alternate-day fasting. The primary mechanism behind IF is that it allows your body to use its stored energy (primarily fat) during fasting periods.",
		dailyCalories: 2000,
		macroRatio: {
			protein: 25,
			carbs: 40,
			fat: 35,
		},
		tags: ["Time-restricted", "Metabolic health", "Flexible"],
		benefits: [
			"Weight loss and fat reduction",
			"Improved insulin sensitivity",
			"Cellular repair through autophagy",
			"Reduced inflammation",
			"Potential longevity benefits",
			"Simplifies daily routine",
		],
		recommendedFor:
			"People looking for a sustainable approach to weight management without counting calories, those interested in metabolic health benefits, and individuals who prefer defined eating windows.",
		duration: "Flexible - can be short-term or adopted as a lifestyle",
		sampleMeals: [
			{
				name: "Breaking Fast Meal",
				time: "12:00 PM",
				calories: 600,
				items: [
					"Greek yogurt with berries and walnuts",
					"Two hard-boiled eggs",
					"Whole grain toast with avocado",
				],
			},
			{
				name: "Afternoon Meal",
				time: "3:00 PM",
				calories: 500,
				items: [
					"Grilled chicken breast",
					"Large mixed salad with olive oil dressing",
					"Sweet potato",
				],
			},
			{
				name: "Dinner",
				time: "7:00 PM",
				calories: 700,
				items: [
					"Salmon with herbs",
					"Roasted vegetables",
					"Quinoa",
					"Olive oil drizzle",
				],
			},
			{
				name: "End of Window Snack",
				time: "8:00 PM",
				calories: 200,
				items: ["Handful of mixed nuts", "Square of dark chocolate"],
			},
		],
		tipsSummary:
			"Intermittent fasting can be adjusted to fit your lifestyle. Here are some helpful tips:",
		tips: [
			"Start with a shorter fasting window and gradually extend it",
			"Stay well-hydrated during fasting periods (water, black coffee, tea)",
			"Break your fast with moderate portions, not huge meals",
			"Focus on nutrient-dense foods during eating windows",
			"Adjust your fasting schedule to fit your social life and work",
			"Consider electrolyte supplementation during longer fasts",
			"Monitor how you feel and adjust as needed",
		],
	},
	{
		id: "paleo",
		name: "Paleo Diet",
		shortDescription: "Based on foods similar to what hunter-gatherers ate",
		description:
			"The Paleolithic diet, also known as the Paleo diet, is designed to resemble what human hunter-gatherer ancestors ate thousands of years ago. It consists mainly of whole foods like lean meats, fish, fruits, vegetables, nuts, and seeds—foods that could be obtained by hunting and gathering in the past. The diet avoids processed foods, sugar, dairy, grains, and legumes, which became common when farming emerged about 10,000 years ago.",
		dailyCalories: 2200,
		macroRatio: {
			protein: 30,
			carbs: 30,
			fat: 40,
		},
		tags: ["Whole foods", "Grain-free", "Dairy-free"],
		benefits: [
			"Weight loss",
			"Improved blood lipids",
			"Reduced inflammation",
			"Better blood sugar control",
			"Less processed food consumption",
			"Higher protein intake",
		],
		recommendedFor:
			"People looking to eliminate processed foods, those with certain food sensitivities, and individuals interested in a higher protein, lower carb approach.",
		duration: "Can be followed short-term or as a lifestyle",
		sampleMeals: [
			{
				name: "Breakfast",
				time: "7:00 AM",
				calories: 500,
				items: [
					"Omelet with vegetables and herbs",
					"Avocado slices",
					"Fresh berries",
				],
			},
			{
				name: "Lunch",
				time: "12:30 PM",
				calories: 650,
				items: [
					"Grilled chicken over mixed greens",
					"Various raw vegetables",
					"Nuts and olive oil dressing",
				],
			},
			{
				name: "Dinner",
				time: "6:30 PM",
				calories: 750,
				items: [
					"Grass-fed steak",
					"Roasted sweet potatoes with herbs",
					"Steamed broccoli with olive oil",
				],
			},
			{
				name: "Snack",
				time: "3:00 PM",
				calories: 300,
				items: [
					"Apple slices with almond butter",
					"Beef jerky (no added sugar)",
				],
			},
		],
		tipsSummary:
			"Following a Paleo diet in the modern world requires some planning:",
		tips: [
			"Focus on quality protein sources when possible (grass-fed, wild-caught)",
			"Stock up on frozen vegetables and berries for convenience",
			"Prepare food in batches to make weekday meals easier",
			"Read labels carefully - added sugars and processed ingredients hide everywhere",
			"Use natural sweeteners like honey or maple syrup sparingly",
			"Incorporate a variety of herbs and spices for flavor",
			"Consider tracking nutrients initially to ensure adequate calcium intake",
		],
	},
	{
		id: "dash",
		name: "DASH Diet",
		shortDescription: "Dietary approach to stop hypertension",
		description:
			"The DASH (Dietary Approaches to Stop Hypertension) diet is designed to help treat or prevent high blood pressure. It emphasizes foods rich in nutrients that help lower blood pressure, such as potassium, calcium, magnesium, and fiber. The diet involves reducing sodium intake and eating a variety of nutrient-rich foods including fruits, vegetables, whole grains, lean proteins, and low-fat dairy. It limits foods high in saturated fat, such as fatty meats, full-fat dairy, and tropical oils, as well as sugar-sweetened foods and beverages.",
		dailyCalories: 2000,
		macroRatio: {
			protein: 18,
			carbs: 55,
			fat: 27,
		},
		tags: ["Heart-healthy", "Blood pressure", "Balanced"],
		benefits: [
			"Lowers blood pressure",
			"Reduces risk of heart disease",
			"May help prevent diabetes",
			"Supports overall heart health",
			"Nutritionally balanced approach",
		],
		recommendedFor:
			"People with high blood pressure, heart concerns, or those with a family history of cardiovascular disease.",
		duration: "Long-term lifestyle approach",
		sampleMeals: [
			{
				name: "Breakfast",
				time: "7:30 AM",
				calories: 400,
				items: [
					"Oatmeal with low-fat milk",
					"Sliced banana and berries",
					"Unsalted almonds",
					"Orange juice (small glass)",
				],
			},
			{
				name: "Lunch",
				time: "12:30 PM",
				calories: 600,
				items: [
					"Whole grain sandwich with turkey breast",
					"Sliced vegetables and avocado",
					"Side salad with olive oil vinaigrette",
					"Fresh fruit",
				],
			},
			{
				name: "Dinner",
				time: "6:30 PM",
				calories: 700,
				items: [
					"Baked fish with herbs (low sodium)",
					"Brown rice pilaf",
					"Steamed vegetables",
					"Green salad with low-sodium dressing",
				],
			},
			{
				name: "Snack",
				time: "3:30 PM",
				calories: 300,
				items: [
					"Low-fat yogurt",
					"Mixed fresh fruit",
					"Unsalted mixed nuts (small portion)",
				],
			},
		],
		tipsSummary:
			"The DASH diet focuses on reducing sodium while increasing nutrient-rich foods:",
		tips: [
			"Aim for no more than 2,300mg of sodium per day (1,500mg for stricter version)",
			"Read food labels to identify hidden sodium sources",
			"Use herbs and spices instead of salt to flavor foods",
			"Choose fresh or frozen vegetables over canned when possible",
			"Limit processed foods which often contain high amounts of sodium",
			"Include 4-5 servings of fruits and 4-5 servings of vegetables daily",
			"Choose low-fat or fat-free dairy products",
			"Include potassium-rich foods like bananas, potatoes, and leafy greens",
			"Aim for 4-5 servings of nuts, seeds, and legumes per week",
		],
	},
];
