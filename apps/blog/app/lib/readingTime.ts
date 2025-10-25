interface Block {
    _type: string;
    children?: Block[];
    text?: string;
    [key: string]: unknown;
}

export function calculateReadingTime(blocks: Block[]): number {
    const imageCount = blocks.filter((b) => b._type === "image").length;
    let wordCount = 0;

    const count = (block: Block): void => {
        if (!block) return;
        if (block._type === "block" && block.children) {
            for (const child of block.children) {
                if (child.text) wordCount += child.text.trim().split(/\s+/).filter(Boolean).length;
            }
        }
        if (Array.isArray(block.children)) {
            for (const child of block.children) count(child);
        }
    };

    for (const block of blocks) count(block);

    return Math.max(1, Math.round(wordCount / 200 + (imageCount * 2) / 60));
}

export function formatReadingTime(minutes: number): string {
    return `~${minutes} min`;
}

