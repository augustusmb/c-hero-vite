export type AssessmentQuestion = {
  id: number;
  title: string;
  correct_answer: string;
  incorrect_answer1: string;
  incorrect_answer2: string;
  incorrect_answer3: string;
  true_or_false: string;
  answerOptions: string[];
};

export type CompletedAssessmentData = {
  classId: string;
  first_name: string;
  last_name: string;
  phone: string;
  userId: number;
  questionsMissed: any;
};
