export type Orders = Order[];
export type Order = Track[];
export type Track = WeightedIssue[];

export default function proposeOrderFor ({ issues, timeframe, tracks }: {
  issues: WeightedIssues,
  timeframe: number, // Quantity of "story point" time to try to optimize within.
  tracks: number, // Number of parallel work streams
}): Orders {

  // TODO: Make this algorithm do all the magic.
  return [];
}
