import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateImagePrompt(name: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an creative AI assistant capable of generating thumbnails. Your output will be fed into the DALLE API to generate a thumbnail. The description of image should be simple, minimal and flat",
        },
        {
          role: "user",
          content: `Please generate a thumbnail for ${name}`,
        },
      ],
    });
    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      console.error('No choices available in the response', data);
      return ''; // Or handle this case as you see fit
    }
    const image_description = data.choices[0].message.content;
    return image_description as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function generateImage(image_description: string) {
  try {
    const response = await openai.createImage({
      prompt: image_description,
      n: 1,
      size: "512x512",
    });
    const data = await response.json();
    const image_url = data.data[0].url;
    return image_url as string;
  } catch (error) {
    console.error(error);
  }
}
