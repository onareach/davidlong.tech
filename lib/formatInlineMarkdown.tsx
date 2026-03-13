import React from "react";

/**
 * Parses plain text with **bold** and *italic* markers and returns
 * an array of React nodes for rendering (e.g. in a preview).
 * Bold (**...**) is matched before italic (*...*) so ** is not split.
 */
export function formatInlineMarkdown(
  text: string,
  keyPrefix = "md"
): (string | React.ReactNode)[] {
  const result: (string | React.ReactNode)[] = [];
  let keyIndex = 0;
  // Match **bold** or *italic* (bold pattern first so ** wins)
  const regex = /\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
  let lastEnd = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastEnd) {
      result.push(text.slice(lastEnd, match.index));
    }
    if (match[1] !== undefined) {
      result.push(<strong key={`${keyPrefix}-${keyIndex++}`}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      result.push(<em key={`${keyPrefix}-${keyIndex++}`}>{match[2]}</em>);
    }
    lastEnd = regex.lastIndex;
  }
  if (lastEnd < text.length) {
    result.push(text.slice(lastEnd));
  }
  return result;
}
