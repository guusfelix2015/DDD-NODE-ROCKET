/* eslint-disable prettier/prettier */
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository copy'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

let inMemoryQuestionRespository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionRespository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRespository)
  })

  it('should be able to get a question by slug', async () => {

    const newQuestion = makeQuestion({
      slug: Slug.create("exemple-slug")
    })

    inMemoryQuestionRespository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'exemple-slug',
    })

    expect(question.id).toBeTruthy()
  })
})


