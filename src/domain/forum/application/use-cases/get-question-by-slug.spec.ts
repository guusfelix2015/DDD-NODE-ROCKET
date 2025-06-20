/* eslint-disable prettier/prettier */
import { InMemoryQuestionRespository } from 'test/repositories/in-memory-questions-repository copy'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionRespository: InMemoryQuestionRespository
let sut: GetQuestionBySlugUseCase

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionRespository = new InMemoryQuestionRespository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRespository)
  })

  it('should be able to get a question by slug', async () => {

    const newQuestion = Question.create({
      authorId: new UniqueEntityID(),
      title: "Exemple question",
      slug: Slug.create("exemple-slug"),
      content: "Exemple content"
    })

    inMemoryQuestionRespository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'exemple-slug',
    })

    expect(question.id).toBeTruthy()
  })
})


