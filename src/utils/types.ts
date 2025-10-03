export interface IconEntry {
  name: string;
  component: React.ComponentType<any>;
  path?: string;
}

export interface SimilarityScore {
  name: string;
  similarity: number;
}

export interface ComparisonProgress {
  current: number;
  total: number;
}

export interface IconCompareProps {
  /** 
   * Object containing icon components 
   * Example: { SearchIcon: SearchIconComponent, UserIcon: UserIconComponent }
   */
  icons: Record<string, React.ComponentType<any>>;
  
  /**
   * Custom class name for the container
   */
  className?: string;
  
  /**
   * Callback when comparison is complete
   */
  onComparisonComplete?: (scores: Record<string, number>) => void;
  
  /**
   * Similarity threshold for highlighting duplicates (default: 90)
   */
  duplicateThreshold?: number;
  
  /**
   * Similarity threshold for highlighting similar icons (default: 70)
   */
  similarThreshold?: number;
  
  /**
   * Number of columns in the grid (default: 8)
   */
  gridColumns?: number;
}
