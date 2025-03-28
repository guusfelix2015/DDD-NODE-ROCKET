import {expect, test} from "vitest";
import {AnswerQuestionUseCase} from "./answer-question";


test("create an answer", async () => {
  const answerQuestion = new AnswerQuestionUseCase()

  const answer = answerQuestion.execute({
    questionId: "123",
    instructorId: "123",
    content: "Nova resposta"
  })

  expect(answer.content).toEqual("Nova resposta");
})