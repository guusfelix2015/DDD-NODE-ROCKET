import {Answer} from "../entities/answer";

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
}

export class AnswerQuestionUseCase {
  execute({instructorId, questionId, content}: AnswerQuestionUseCaseRequest) {
    return new Answer({
      content,
      questionId,
      authorId: instructorId,
    });
  }
}