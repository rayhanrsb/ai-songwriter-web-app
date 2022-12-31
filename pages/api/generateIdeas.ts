// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { CreateCompletionResponseChoicesInner } from 'openai/dist/api';
import { Configuration, OpenAIApi } from 'openai';

type Data = {
  output: CreateCompletionResponseChoicesInner|undefined
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = 
`
List five ideas for songs based on the following story:

`;

const generateIdeasAction = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) => {
    // Run first prompt
    console.log(`First prompt: ${basePromptPrefix}${req.body.userInput}`);

    const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.95,
    max_tokens: 250,
    });

    const basePromptOutput: CreateCompletionResponseChoicesInner|undefined = baseCompletion.data.choices.pop();

    if (basePromptOutput) {
      // Prompt #2.
      const secondPrompt = 
      `
      Take these five ideas for songs and write a verse for each one. The verses must be catchy and rhyme:

      ${basePromptOutput.text}
      `
      
      // Call the OpenAI API a second time with Prompt #2
      console.log(`Second prompt: ${secondPrompt}`);
      const secondPromptCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${secondPrompt}`,
      temperature: 0.99,
      max_tokens: 300,
      });

      // Get the output
      const secondPromptOutput = secondPromptCompletion.data.choices.pop();

      // Send over the Prompt #2's output to our UI instead of Prompt #1's.
      res.status(200).json({ output: secondPromptOutput });
    }
    else {
      res.status(500);
    }
};

export default generateIdeasAction;