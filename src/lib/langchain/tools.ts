import { tool } from "langchain";
import { z } from "zod";

const getWeather = tool(({ city }) => `It's always sunny in ${city}!`, {
    name: "get_weather_for_location",
    description: "Get the weather for a given city",
    schema: z.object({
        city: z.string(),
    }),
});

const USER_LOCATION = {
    "1": "Florida",
    "2": "SF",
} as const;

const getUserLocation = tool(
    (_, config) => {
        const { user_id } = config.context as {
            user_id: keyof typeof USER_LOCATION;
        };
        console.log("user_id", config.context);
        return USER_LOCATION[user_id];
    },
    {
        name: "get_user_location",
        description: "Retrieve user information based on user ID",
        schema: z.object({}),
    }
);