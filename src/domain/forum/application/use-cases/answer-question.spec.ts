/* eslint-disable prettier/prettier */
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswerRespository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe("Create Question", () => {
  beforeEach(() => {
    inMemoryAnswerRespository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswerRespository)
  })

  it('should be able to create an answer', async () => {

    const { answer } = await sut.execute({
      instructorId: "123",
      questionId: "1234",
      content: 'Conteudo da pergunta',
    })

    expect(answer.id).toBeTruthy()
    expect(inMemoryAnswerRespository.items[0].id).toEqual(answer.id)
  })
})


