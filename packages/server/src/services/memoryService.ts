import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers';
import { query } from '../db/pool';

let extractor: FeatureExtractionPipeline | null = null;

/**
 * Singleton to lazy-load the embedding model.
 */
async function getExtractor() {
    if (!extractor) {
        console.log('[MemoryService] Loading local embedding model (Xenova/all-MiniLM-L6-v2)...');
        // Generates 384-dimensional embeddings optimal for basic RAG
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('[MemoryService] Embedding model loaded!');
    }
    return extractor;
}

/**
 * Generates an embedding vector for a given text.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const getFeature = await getExtractor();
    const output = await getFeature(text, { pooling: 'mean', normalize: true });
    // xenova returns a Tensor. The actual JS array is accessible via `.data` 
    return Array.from(output.data);
}

/**
 * Saves a memory logically into the vector database.
 */
export async function saveMemory(content: string, entityType: string = 'user'): Promise<void> {
    try {
        const embedding = await generateEmbedding(content);
        // Formatting the array into a string format compatible with pgvector
        const embeddingStr = `[${embedding.join(',')}]`;

        await query(
            `INSERT INTO agent_memories (entity_type, content, embedding) VALUES ($1, $2, $3)`,
            [entityType, content, embeddingStr]
        );
        console.log(`[MemoryService] Saved new memory: "${content.substring(0, 50)}..."`);
    } catch (error) {
        console.error('[MemoryService] Failed to save memory:', error);
    }
}

/**
 * Searches for the most relevant memories based on semantic similarity.
 */
export async function searchMemories(searchQuery: string, limit: number = 3): Promise<Array<{ content: string, similarity: number }>> {
    try {
        const embedding = await generateEmbedding(searchQuery);
        const embeddingStr = `[${embedding.join(',')}]`;

        // <=> is the cosine distance operator in pgvector. 
        // We order by distance ascending, which is the same as similarity descending.
        const result = await query(
            `SELECT id, entity_type, content, 1 - (embedding <=> $1) AS similarity 
       FROM agent_memories 
       ORDER BY embedding <=> $1 
       LIMIT $2`,
            [embeddingStr, limit]
        );

        return result.rows;
    } catch (error) {
        console.error('[MemoryService] Failed to search memories:', error);
        return [];
    }
}
