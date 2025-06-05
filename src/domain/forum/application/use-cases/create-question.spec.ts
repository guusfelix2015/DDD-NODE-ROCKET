/* eslint-disable prettier/prettier */
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionRespository } from 'test/repositories/in-memory-questions-repository copy'

let inMemoryQuestionRespository: InMemoryQuestionRespository
let sut: CreateQuestionUseCase

describe("Create Question", () => {
  beforeEach(() => {
    inMemoryQuestionRespository = new InMemoryQuestionRespository()
    sut = new CreateQuestionUseCase(inMemoryQuestionRespository)
  })

  it('should be able to create a question', async () => {

    const { question } = await sut.execute({
      authorId: '123',
      title: 'Nova pergunta',
      content: 'Conteudo da pergunta',
    })

    expect(question.id).toBeTruthy()
    expect(inMemoryQuestionRespository.items[0].id).toEqual(question.id)

  })
})


