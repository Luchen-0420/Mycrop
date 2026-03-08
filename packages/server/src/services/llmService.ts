import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client pointing to a compatible API (e.g., DeepSeek)
const openai = new OpenAI({
    apiKey: process.env.LLM_API_KEY || '',
    baseURL: process.env.LLM_BASE_URL || 'https://api.deepseek.com/v1',
});

// Default model to use (fallback to deepseek-chat if not specified)
const DEFAULT_MODEL = process.env.LLM_MODEL || 'deepseek-chat';

/**
 * Generate a chat completion using the LLM.
 * @param messages Array of chat messages
 * @param model Model string (optional)
 * @param temperature Temperature (optional)
 * @returns The response text from the LLM
 */
export async function generateChatResponse(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    model: string = DEFAULT_MODEL,
    temperature: number = 0.7
): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model,
            messages,
            temperature,
        });

        return response.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('LLM API Error:', error);
        throw new Error('Failed to generate response from LLM.');
    }
}

/**
 * Generate a structured JSON response using the LLM.
 * Note: Check if the specific API (like DeepSeek) fully supports response_format: { type: 'json_object' }
 * @param messages Array of chat messages
 * @returns Parsed JSON object
 */
export async function generateJSONResponse<T>(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    model: string = DEFAULT_MODEL
): Promise<T> {
    try {
        console.log(`[LLM JSON Request] Model: ${model}, Messages length: ${messages.length}`)
        const response = await openai.chat.completions.create({
            model,
            messages,
            response_format: { type: 'json_object' },
            temperature: 0.1, // Lower temperature for more deterministic JSON
        });

        let content = response.choices[0]?.message?.content || '';
        console.log(`[LLM JSON Response Text]:\n${content}\n------------------------`)

        if (!content) {
            throw new Error('Empty response from LLM');
        }

        // Clean up potential markdown formatting (```json ... ```)
        content = content.replace(/^```(json)?\n?/i, '').replace(/\n?```$/i, '').trim();

        return JSON.parse(content) as T;
    } catch (error) {
        console.error('LLM JSON API Error:', error);
        throw new Error('Failed to generate JSON response from LLM.');
    }
}
