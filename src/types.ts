export type QuestionType = "text" | "true-false" | "multi-select" | "matching" | "fill-in-the-blank";

export interface BaseQuestion {
  type: QuestionType;
  question: string;
  hint?: string;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
  answer: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  answer: boolean;
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: "multi-select";
  options: string[];
  answer: string[];
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: "matching";
  pairs: MatchingPair[];
}

export interface FillInTheBlankQuestion extends BaseQuestion {
  type: "fill-in-the-blank";
  answers: string[][];
}

export type Question =
  | TextQuestion
  | TrueFalseQuestion
  | MultiSelectQuestion
  | MatchingQuestion
  | FillInTheBlankQuestion;