# 📚 Guia de Aprendizado - Clean Architecture & DDD com Node.js

> **Bem-vindo!** Este guia foi criado para ajudá-lo a entender profundamente os conceitos de Clean Architecture e Domain-Driven Design (DDD) através deste projeto prático. Vou explicar cada conceito como se estivéssemos conversando em uma sessão de mentoria.

---

## 📋 Índice

1. [Visão Geral do Projeto](#-visão-geral-do-projeto)
2. [O que é DDD e Clean Architecture?](#-o-que-é-ddd-e-clean-architecture)
3. [Estrutura de Pastas Explicada](#-estrutura-de-pastas-explicada)
4. [Conceitos Fundamentais](#-conceitos-fundamentais)
5. [Fluxo de Requisição](#-fluxo-de-requisição)
6. [Exemplos de Código Comentados](#-exemplos-de-código-comentados)
7. [Dependências do Projeto](#-dependências-do-projeto)
8. [Boas Práticas Demonstradas](#-boas-práticas-demonstradas)
9. [Caminho de Aprendizado Sugerido](#-caminho-de-aprendizado-sugerido)
10. [Exercícios Práticos](#-exercícios-práticos)

---

## 🎯 Visão Geral do Projeto

### O que este projeto faz?

Este é um **sistema de fórum educacional** (similar ao Stack Overflow ou fóruns de cursos online) onde:

- **Estudantes** podem fazer perguntas
- **Instrutores** podem responder perguntas
- Perguntas podem ter uma "melhor resposta" selecionada
- Cada pergunta tem um slug único para URLs amigáveis

### Por que este projeto é importante para aprender?

Este não é apenas mais um CRUD simples. Ele demonstra como organizar código de forma que:

1. **Seja fácil de testar** - Cada parte pode ser testada isoladamente
2. **Seja fácil de manter** - Mudanças em uma parte não quebram outras
3. **Reflita o negócio** - O código "fala" a linguagem do domínio (fórum, perguntas, respostas)
4. **Seja escalável** - Novas funcionalidades podem ser adicionadas sem reescrever tudo

---

## 🏛️ O que é DDD e Clean Architecture?

### Domain-Driven Design (DDD)

Imagine que você está construindo uma casa. Antes de começar, você conversa com quem vai morar nela para entender suas necessidades, certo? DDD é exatamente isso, mas para software.

**Princípios principais:**

1. **Linguagem Ubíqua**: Todos (desenvolvedores, clientes, gerentes) falam a mesma língua

   - ❌ Ruim: "Vamos criar um registro no banco com os dados do usuário"
   - ✅ Bom: "Vamos criar uma pergunta no fórum"

2. **Foco no Domínio**: O código reflete as regras de negócio

   - Exemplo: Uma pergunta tem um autor, título, conteúdo e pode ter uma melhor resposta

3. **Bounded Contexts (Contextos Delimitados)**: Cada parte do sistema tem suas próprias regras
   - Neste projeto: Temos o contexto "Forum" (perguntas e respostas)

### Clean Architecture

É uma forma de organizar o código em camadas, onde:

```
┌─────────────────────────────────────────────────────────────┐
│         Camada Externa (Framework/DB/API)                   │
│  - Controllers HTTP                                         │
│  - Implementações de Repositórios (Prisma, TypeORM)        │
│  - Frameworks (Express, Fastify)                            │
│  ← Detalhes de implementação (podem mudar facilmente)      │
├─────────────────────────────────────────────────────────────┤
│         Camada de Aplicação (Use Cases)                     │
│  - CreateQuestionUseCase                                    │
│  - DeleteQuestionUseCase                                    │
│  - Interfaces de Repositórios                               │
│  ← Regras de negócio da aplicação (orquestração)           │
├─────────────────────────────────────────────────────────────┤
│         Camada de Domínio (Entidades)                       │
│  - Question, Answer, Student, Instructor                    │
│  - Value Objects (Slug)                                     │
│  - Regras de negócio puras                                  │
│  ← Núcleo do sistema (raramente muda)                      │
└─────────────────────────────────────────────────────────────┘
```

**Regra de Ouro**: As camadas internas NUNCA dependem das externas!

- ✅ Use Case pode usar Entity
- ✅ Use Case pode usar Repository (interface)
- ❌ Entity NÃO pode usar Use Case
- ❌ Entity NÃO pode usar Repository
- ❌ Entity NÃO pode usar banco de dados diretamente

**Fluxo de Dependências:**

```
┌──────────────┐
│  Controller  │  (não implementado neste projeto)
└──────┬───────┘
       │ depende de
       ▼
┌──────────────┐
│   Use Case   │
└──────┬───────┘
       │ depende de
       ▼
┌──────────────┐      ┌─────────────────────┐
│   Entity     │  ◄───│  Repository (interface)
└──────────────┘      └──────────┬──────────┘
                                 │ implementado por
                                 ▼
                      ┌─────────────────────┐
                      │  Prisma/TypeORM     │
                      │  (infraestrutura)   │
                      └─────────────────────┘
```

---

## 📁 Estrutura de Pastas Explicada

```
04-CLEAN-DDD/
│
├── src/                          # Código fonte da aplicação
│   ├── core/                     # Núcleo compartilhado (building blocks)
│   │   ├── entities/             # Classes base para todas as entidades
│   │   │   ├── entity.ts         # Classe base Entity
│   │   │   └── unique-entity-id.ts  # Gerador de IDs únicos
│   │   └── types/                # Tipos TypeScript utilitários
│   │       └── optional.ts       # Helper para propriedades opcionais
│   │
│   └── domain/                   # Camada de domínio (regras de negócio)
│       └── forum/                # Contexto delimitado "Forum"
│           ├── application/      # Camada de aplicação
│           │   ├── repositories/ # Contratos (interfaces) dos repositórios
│           │   │   ├── questions-repository.ts
│           │   │   └── answers-repository.ts
│           │   └── use-cases/    # Casos de uso (ações do sistema)
│           │       ├── create-question.ts
│           │       ├── answer-question.ts
│           │       ├── delete-question.ts
│           │       └── get-question-by-slug.ts
│           │
│           └── enterprise/        # Camada de domínio (entidades)
│               └── entities/      # Entidades do negócio
│                   ├── question.ts
│                   ├── answer.ts
│                   ├── student.ts
│                   ├── instructor.ts
│                   └── value-objects/  # Objetos de valor
│                       └── slug.ts
│
├── test/                         # Testes e mocks
│   ├── factories/                # Factories para criar dados de teste
│   │   └── make-question.ts
│   └── repositories/             # Implementações em memória para testes
│       ├── in-memory-questions-repository.ts
│       └── in-memory-answers-repository.ts
│
├── package.json                  # Dependências e scripts
├── tsconfig.json                 # Configuração TypeScript
├── vite.config.ts                # Configuração do Vitest
└── README.md                     # Documentação básica
```

### Por que essa estrutura?

**Separação por camadas e contextos:**

- `core/`: Código reutilizável em qualquer domínio
- `domain/forum/`: Tudo relacionado ao domínio de fórum
- `enterprise/`: Regras de negócio puras (não mudam com frequência)
- `application/`: Regras de aplicação (orquestram as entidades)

---

## 🧩 Conceitos Fundamentais

### 1. Entidades (Entities)

**O que são?**
Objetos que têm uma identidade única e ciclo de vida próprio.

**Exemplo do mundo real:**
Você é uma entidade. Mesmo que mude de nome, endereço ou aparência, continua sendo você (sua identidade é única).

**No código:**

```typescript
// src/core/entities/entity.ts
export class Entity<Props> {
  private readonly _id: UniqueEntityID; // ID único e imutável
  protected props: Props; // Propriedades da entidade

  get id() {
    return this._id;
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ?? new UniqueEntityID(); // Gera ID se não fornecido
  }
}
```

**Por que `protected constructor`?**
Para forçar o uso de métodos estáticos `create()`, garantindo que a entidade seja sempre criada de forma válida.

**Exemplo de Entidade Concreta:**

```typescript
// src/domain/forum/enterprise/entities/question.ts
export class Question extends Entity<QuestionProps> {
  get authorId() {
    return this.props.authorId;
  }

  get title() {
    return this.props.title;
  }

  // Método estático para criar uma pergunta
  static create(
    props: Optional<QuestionProps, "createdAt" | "slug">,
    id?: UniqueEntityID
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: new Date(),
      },
      id
    );
    return question;
  }
}
```

**Entidades no projeto:**

- `Question` - Uma pergunta no fórum
- `Answer` - Uma resposta a uma pergunta
- `Student` - Um estudante que faz perguntas
- `Instructor` - Um instrutor que responde perguntas

---

### 2. Value Objects (Objetos de Valor)

**O que são?**
Objetos que não têm identidade própria, são definidos apenas por seus valores.

**Exemplo do mundo real:**
Uma nota de R$ 50,00. Não importa qual nota específica você tem, o que importa é o valor. Se trocar por outra nota de R$ 50,00, é a mesma coisa.

**No código:**

```typescript
// src/domain/forum/enterprise/entities/value-objects/slug.ts
export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  // Cria slug a partir de texto
  static createFromText(text: string) {
    const slugText = text
      .normalize("NFKD") // Remove acentos
      .toLowerCase() // Minúsculas
      .trim() // Remove espaços nas pontas
      .replace(/\s+/g, "-") // Espaços viram hífens
      .replace(/[^\w-]+/g, "") // Remove caracteres especiais
      .replace(/_/g, "-") // Underscores viram hífens
      .replace(/--+/g, "-") // Remove hífens duplicados
      .replace(/-$/g, "-"); // Remove hífen final

    return new Slug(slugText);
  }
}
```

**Diferença entre Entity e Value Object:**

| Característica | Entity           | Value Object        |
| -------------- | ---------------- | ------------------- |
| Identidade     | Tem ID único     | Sem identidade      |
| Igualdade      | Comparado por ID | Comparado por valor |
| Mutabilidade   | Pode mudar       | Imutável            |
| Exemplo        | Question, User   | Slug, Email, Money  |

---

### 3. Repositórios (Repositories)

**O que são?**
Contratos (interfaces) que definem como acessar e persistir entidades, sem se preocupar com a implementação (banco de dados, API, memória, etc.).

**Analogia:**
Pense em um repositório como um bibliotecário. Você pede um livro (entidade) e ele busca para você. Você não precisa saber se o livro está no porão, no segundo andar ou em outro prédio.

**No código:**

```typescript
// src/domain/forum/application/repositories/questions-repository.ts
export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
  create(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
}
```

**Por que usar interfaces?**

1. **Inversão de Dependência**: O domínio define o contrato, a infraestrutura implementa
2. **Testabilidade**: Podemos criar implementações falsas (mocks) para testes
3. **Flexibilidade**: Podemos trocar o banco de dados sem mudar o domínio

**Implementação para testes:**

```typescript
// test/repositories/in-memory-questions-repository.ts
export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []; // Array simples em memória

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);
    return question ?? null;
  }

  async create(question: Question): Promise<void> {
    this.items.push(question);
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);
    this.items.splice(itemIndex, 1);
  }
}
```

---

### 4. Casos de Uso (Use Cases)

**O que são?**
Representam as ações que o sistema pode realizar. Cada caso de uso é uma funcionalidade específica.

**Analogia:**
São como os botões de um controle remoto. Cada botão faz uma coisa específica: ligar TV, mudar canal, aumentar volume.

**Estrutura de um Use Case:**

```typescript
// src/domain/forum/application/use-cases/create-question.ts

// 1. Interface de entrada (o que preciso para executar?)
interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
}

// 2. Interface de saída (o que vou retornar?)
interface CreateQuestionUseCaseResponse {
  question: Question;
}

// 3. Classe do caso de uso
export class CreateQuestionUseCase {
  // Injeção de dependência do repositório
  constructor(private questionRepository: QuestionsRepository) {}

  // Método que executa a lógica
  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    // Cria a entidade
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    });

    // Persiste usando o repositório
    await this.questionRepository.create(question);

    // Retorna o resultado
    return { question };
  }
}
```

**Casos de Uso no projeto:**

1. `CreateQuestionUseCase` - Criar uma nova pergunta
2. `AnswerQuestionUseCase` - Responder uma pergunta
3. `DeleteQuestionUseCase` - Deletar uma pergunta (com validação de autorização)
4. `GetQuestionBySlugUseCase` - Buscar pergunta por slug

---

### 5. Unique Entity ID

**O que é?**
Uma classe que encapsula a geração e manipulação de IDs únicos.

**Por que não usar string diretamente?**

❌ **Problema com strings:**

```typescript
const userId = "123";
const productId = "123";
// Ops! Posso confundir os IDs
```

✅ **Solução com Value Object:**

```typescript
const userId = new UniqueEntityID("123");
const productId = new UniqueEntityID("456");
// Tipo seguro e semântico
```

**Implementação:**

```typescript
// src/core/entities/unique-entity-id.ts
import { randomUUID } from "node:crypto";

export class UniqueEntityID {
  private value: string;

  toString() {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID(); // Gera UUID se não fornecido
  }
}
```

---

### 6. Type Helper: Optional

**O que é?**
Um utilitário TypeScript que torna algumas propriedades opcionais.

**Problema que resolve:**

```typescript
// Ao criar uma Question, não queremos fornecer createdAt e slug
// (são gerados automaticamente)

interface QuestionProps {
  authorId: UniqueEntityID;
  title: string;
  content: string;
  slug: Slug;
  createdAt: Date;
  updatedAt?: Date;
}

// Sem Optional, teríamos que passar tudo:
Question.create({
  authorId: new UniqueEntityID(),
  title: "Título",
  content: "Conteúdo",
  slug: Slug.create("titulo"), // Redundante!
  createdAt: new Date(), // Redundante!
});
```

**Com Optional:**

```typescript
// src/core/types/optional.ts
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

// Uso:
static create(
  props: Optional<QuestionProps, 'createdAt' | 'slug'>,
  id?: UniqueEntityID,
) {
  // Agora createdAt e slug são opcionais!
}

// Podemos criar assim:
Question.create({
  authorId: new UniqueEntityID(),
  title: "Título",
  content: "Conteúdo",
  // slug e createdAt são gerados automaticamente
})
```

---

## 🔄 Fluxo de Requisição

Vamos acompanhar o que acontece quando um usuário cria uma pergunta:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. ENTRADA (Controller/API - não implementado neste projeto)   │
│    POST /questions                                              │
│    Body: { authorId: "123", title: "Como usar DDD?", ... }    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. CASO DE USO (Application Layer)                             │
│    CreateQuestionUseCase.execute()                             │
│    - Recebe os dados                                           │
│    - Cria a entidade Question                                  │
│    - Chama o repositório para persistir                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. ENTIDADE (Domain Layer)                                     │
│    Question.create()                                           │
│    - Valida os dados                                           │
│    - Gera slug automaticamente                                 │
│    - Define createdAt                                          │
│    - Retorna instância válida                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. REPOSITÓRIO (Infrastructure - interface)                    │
│    QuestionsRepository.create(question)                        │
│    - Persiste no banco de dados                                │
│    - (Implementação real usaria Prisma, TypeORM, etc.)        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. RESPOSTA                                                     │
│    { question: { id: "uuid", title: "...", slug: "..." } }    │
└─────────────────────────────────────────────────────────────────┘
```

**Fluxo de Dependências:**

```
Controller → Use Case → Entity
                ↓
           Repository (interface)
                ↓
           Repository (implementação)
```

---

## 💻 Exemplos de Código Comentados

### Exemplo 1: Deletar uma Pergunta (com Autorização)

Este é um exemplo interessante porque mostra validação de regras de negócio:

```typescript
// src/domain/forum/application/use-cases/delete-question.ts
export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    // 1. Busca a pergunta
    const question = await this.questionsRepository.findById(questionId);

    // 2. Valida se existe
    if (!question) {
      throw new Error("Question not found.");
    }

    // 3. REGRA DE NEGÓCIO: Só o autor pode deletar
    if (authorId !== question.authorId.toString()) {
      throw new Error("Not allowed.");
    }

    // 4. Deleta
    await this.questionsRepository.delete(question);

    return {};
  }
}
```

**Pontos importantes:**

1. **Validação de existência**: Sempre verificar se o recurso existe
2. **Regra de negócio**: Autorização está no domínio, não no controller
3. **Separação de responsabilidades**: Use Case orquestra, Repository persiste

---

### Exemplo 2: Propriedades Computadas na Entidade

A entidade `Question` tem propriedades interessantes:

```typescript
// src/domain/forum/enterprise/entities/question.ts
export class Question extends Entity<QuestionProps> {
  // Propriedade computada: verifica se é nova (até 3 dias)
  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  // Propriedade computada: extrato do conteúdo
  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  // Método privado para atualizar updatedAt
  private touch() {
    this.props.updatedAt = new Date();
  }

  // Setter que atualiza o título E o slug automaticamente
  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title); // Regenera slug
    this.touch(); // Atualiza updatedAt
  }

  // Setter que atualiza o conteúdo
  set content(content: string) {
    this.props.content = content;
    this.touch(); // Atualiza updatedAt
  }
}
```

**Por que isso é importante?**

1. **Encapsulamento**: Lógica de negócio fica na entidade
2. **Consistência**: Ao mudar o título, o slug é atualizado automaticamente
3. **Rastreabilidade**: `updatedAt` é atualizado sempre que algo muda
4. **Reutilização**: `isNew` e `excerpt` podem ser usados em qualquer lugar

---

### Exemplo 3: Factory Pattern para Testes

```typescript
// test/factories/make-question.ts
import { faker } from "@faker-js/faker";

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(), // Dados aleatórios
      content: faker.lorem.text(),
      ...override, // Sobrescreve com dados específicos
    },
    id
  );
  return question;
}

// Uso no teste:
const question = makeQuestion({
  authorId: new UniqueEntityID("author-1"), // Específico
  // title e content são gerados automaticamente
});
```

**Vantagens:**

1. **Menos código nos testes**: Não precisa criar tudo manualmente
2. **Flexibilidade**: Pode sobrescrever apenas o que importa
3. **Dados realistas**: Faker gera dados que parecem reais

---

### Exemplo 4: Teste de Use Case

```typescript
// src/domain/forum/application/use-cases/create-question.spec.ts
describe("Create Question", () => {
  // Variáveis compartilhadas entre testes
  let inMemoryQuestionRepository: InMemoryQuestionsRepository;
  let sut: CreateQuestionUseCase; // SUT = System Under Test

  // Executado antes de cada teste
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository);
  });

  it("should be able to create a question", async () => {
    // Arrange (preparar)
    const input = {
      authorId: "123",
      title: "Nova pergunta",
      content: "Conteúdo da pergunta",
    };

    // Act (agir)
    const { question } = await sut.execute(input);

    // Assert (verificar)
    expect(question.id).toBeTruthy();
    expect(inMemoryQuestionRepository.items[0].id).toEqual(question.id);
  });
});
```

**Padrão AAA (Arrange-Act-Assert):**

1. **Arrange**: Prepara os dados e dependências
2. **Act**: Executa a ação que está sendo testada
3. **Assert**: Verifica se o resultado é o esperado

---

## 📦 Dependências do Projeto

### Dependências de Produção

```json
{
  "dayjs": "^1.11.13"
}
```

**dayjs**: Biblioteca leve para manipulação de datas

- Usada em: `Question.isNew` para calcular diferença de dias
- Alternativa ao Moment.js (mais leve e moderna)
- Exemplo: `dayjs().diff(this.createdAt, 'days')`

### Dependências de Desenvolvimento

```json
{
  "@faker-js/faker": "^9.8.0", // Gera dados falsos para testes
  "@rocketseat/eslint-config": "^2.2.2", // Configuração ESLint da Rocketseat
  "@types/node": "^22.13.14", // Tipos TypeScript para Node.js
  "eslint": "^8.57.1", // Linter (analisa código)
  "typescript": "^5.8.2", // Compilador TypeScript
  "vite-tsconfig-paths": "^5.1.4", // Suporte a path aliases (@/...)
  "vitest": "^3.0.9" // Framework de testes
}
```

**Por que cada uma?**

1. **@faker-js/faker**: Cria dados realistas para testes (nomes, textos, datas, etc.)
2. **@rocketseat/eslint-config**: Regras de código padronizadas e boas práticas
3. **@types/node**: Permite usar APIs do Node.js com TypeScript (crypto, fs, etc.)
4. **eslint**: Encontra problemas no código antes de executar (erros, más práticas)
5. **typescript**: Adiciona tipagem estática ao JavaScript (previne bugs)
6. **vite-tsconfig-paths**: Permite usar `@/core/...` ao invés de `../../../core/...`
7. **vitest**: Framework de testes rápido, moderno, compatível com Vite

### Scripts Disponíveis

```json
{
  "test": "vitest run", // Executa todos os testes uma vez
  "test:watch": "vitest", // Executa testes em modo watch (re-executa ao salvar)
  "lint": "eslint src --ext .ts", // Verifica problemas no código
  "lint:fix": "eslint src --ext .ts --fix" // Corrige problemas automaticamente
}
```

**Como usar:**

```bash
npm test              # Roda todos os testes
npm run test:watch    # Modo desenvolvimento (re-executa ao salvar)
npm run lint          # Verifica problemas
npm run lint:fix      # Corrige problemas automaticamente
```

---

## ✅ Boas Práticas Demonstradas

### 1. Inversão de Dependência (SOLID - D)

❌ **Errado:**

```typescript
class CreateQuestionUseCase {
  async execute() {
    const db = new PostgresDatabase(); // Dependência concreta
    await db.insert(...);
  }
}
```

✅ **Correto:**

```typescript
class CreateQuestionUseCase {
  constructor(private repository: QuestionsRepository) {} // Dependência abstrata

  async execute() {
    await this.repository.create(...);
  }
}
```

**Benefícios:**

- Fácil trocar PostgreSQL por MongoDB
- Fácil testar com repositório em memória
- Use Case não conhece detalhes de infraestrutura

---

### 2. Single Responsibility (SOLID - S)

Cada classe tem uma única responsabilidade:

- `Question`: Representa uma pergunta e suas regras
- `CreateQuestionUseCase`: Cria uma pergunta
- `QuestionsRepository`: Persiste perguntas
- `Slug`: Gera e valida slugs

**Por quê?**
Quando algo muda, você sabe exatamente onde mexer. Se a regra de slug mudar, você mexe apenas em `Slug`.

---

### 3. Imutabilidade de IDs

```typescript
export class Entity<Props> {
  private readonly _id: UniqueEntityID; // readonly = não pode mudar

  get id() {
    return this._id; // Apenas getter, sem setter
  }
}
```

**Por quê?**
IDs não devem mudar durante a vida de uma entidade. Se mudar, não é mais a mesma entidade!

---

### 4. Encapsulamento

```typescript
export class Slug {
  private constructor(value: string) {} // Construtor privado

  static createFromText(text: string) {
    // Factory method público
    // Validação e transformação
    return new Slug(slugText);
  }
}
```

**Benefícios:**

- Garante que Slug sempre é criado de forma válida
- Centraliza lógica de criação
- Impossível criar Slug inválido

---

### 5. Testes Isolados

Cada teste é independente:

```typescript
beforeEach(() => {
  // Cria novas instâncias para cada teste
  inMemoryQuestionRepository = new InMemoryQuestionsRepository();
  sut = new CreateQuestionUseCase(inMemoryQuestionRepository);
});
```

**Por quê?**
Testes não devem interferir uns nos outros. Se um teste falha, não deve afetar os outros.

---

### 6. Convenções de Nomenclatura

- **Entidades**: Substantivos no singular (`Question`, `Answer`)
- **Use Cases**: Verbo + Substantivo + UseCase (`CreateQuestionUseCase`)
- **Repositórios**: Substantivo + Repository (`QuestionsRepository`)
- **Value Objects**: Substantivos descritivos (`Slug`, `Email`)
- **Testes**: `*.spec.ts`
- **Factories**: `make-<entidade>.ts`

---

### 7. Path Aliases

```typescript
// ❌ Ruim
import { Entity } from "../../../core/entities/entity";

// ✅ Bom
import { Entity } from "@/core/entities/entity";
```

**Configuração:**

```json
// tsconfig.json
{
  "baseUrl": "./",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

---

## 🎓 Caminho de Aprendizado Sugerido

### Fase 1: Fundamentos (Comece aqui!)

**Objetivo**: Entender os building blocks básicos

1. **Entenda a estrutura básica**

   - [ ] Leia `src/core/entities/entity.ts`
   - [ ] Leia `src/core/entities/unique-entity-id.ts`
   - [ ] Entenda o conceito de classe base genérica

2. **Estude uma entidade simples**

   - [ ] Leia `src/domain/forum/enterprise/entities/student.ts`
   - [ ] Leia `src/domain/forum/enterprise/entities/instructor.ts`
   - [ ] Veja como herdam de `Entity`
   - [ ] Observe o padrão de método estático `create()`

3. **Entenda Value Objects**
   - [ ] Leia `src/domain/forum/enterprise/entities/value-objects/slug.ts`
   - [ ] Leia o teste `slug.spec.ts`
   - [ ] Execute o teste: `npm test slug`
   - [ ] Experimente: Crie um teste com diferentes textos

**Checkpoint**: Você deve conseguir explicar a diferença entre Entity e Value Object.

---

### Fase 2: Entidades Complexas

**Objetivo**: Ver como entidades reais funcionam

4. **Estude a entidade Question**

   - [ ] Leia `src/domain/forum/enterprise/entities/question.ts`
   - [ ] Observe os getters e setters
   - [ ] Entenda o método `create()`
   - [ ] Veja como usa `Optional<>`
   - [ ] Analise as propriedades computadas (`isNew`, `excerpt`)

5. **Estude a entidade Answer**
   - [ ] Leia `src/domain/forum/enterprise/entities/answer.ts`
   - [ ] Compare com `Question`
   - [ ] Identifique semelhanças e diferenças
   - [ ] Note a relação: Answer tem `questionId`

**Checkpoint**: Você deve conseguir criar uma nova entidade do zero.

---

### Fase 3: Repositórios

**Objetivo**: Entender a camada de persistência

6. **Entenda o contrato**

   - [ ] Leia `src/domain/forum/application/repositories/questions-repository.ts`
   - [ ] Leia `src/domain/forum/application/repositories/answers-repository.ts`
   - [ ] Entenda por que são interfaces (contratos)

7. **Veja a implementação de teste**
   - [ ] Leia `test/repositories/in-memory-questions-repository.ts`
   - [ ] Leia `test/repositories/in-memory-answers-repository.ts`
   - [ ] Entenda como implementam as interfaces
   - [ ] Veja como usam arrays simples para simular banco de dados

**Checkpoint**: Você deve conseguir criar um repositório em memória para uma nova entidade.

---

### Fase 4: Casos de Uso

**Objetivo**: Entender a lógica de aplicação

8. **Use Case simples**

   - [ ] Leia `src/domain/forum/application/use-cases/create-question.ts`
   - [ ] Leia o teste `create-question.spec.ts`
   - [ ] Execute: `npm test create-question`
   - [ ] Observe o padrão: Request → Execute → Response

9. **Use Case com validação**

   - [ ] Leia `src/domain/forum/application/use-cases/delete-question.ts`
   - [ ] Leia o teste `delete-question.spec.ts`
   - [ ] Observe a validação de autorização
   - [ ] Veja como testa cenários de erro

10. **Use Case de consulta**
    - [ ] Leia `src/domain/forum/application/use-cases/get-question-by-slug.ts`
    - [ ] Leia o teste correspondente
    - [ ] Veja como usa o repositório para buscar

**Checkpoint**: Você deve conseguir criar um novo Use Case com testes.

---

### Fase 5: Testes

**Objetivo**: Dominar testes automatizados

11. **Entenda os testes**

    - [ ] Leia `test/factories/make-question.ts`
    - [ ] Entenda o padrão Factory
    - [ ] Veja como é usado nos testes
    - [ ] Observe o uso do Faker

12. **Execute todos os testes**
    - [ ] Execute: `npm test`
    - [ ] Observe a saída
    - [ ] Execute: `npm run test:watch`
    - [ ] Tente quebrar um teste para ver o que acontece
    - [ ] Corrija o teste

**Checkpoint**: Você deve conseguir escrever testes para qualquer Use Case.

---

### Fase 6: Prática (Desafios!)

**Objetivo**: Aplicar o conhecimento

13. **Desafio 1: Editar Pergunta**

    - [ ] Crie `EditQuestionUseCase`
    - [ ] Permita editar título e conteúdo
    - [ ] Valide que só o autor pode editar
    - [ ] Escreva pelo menos 2 testes:
      - Deve conseguir editar pergunta própria
      - Não deve conseguir editar pergunta de outro usuário

14. **Desafio 2: Escolher Melhor Resposta**

    - [ ] Crie `ChooseBestAnswerUseCase`
    - [ ] Permita definir `bestAnswerId` em uma pergunta
    - [ ] Valide que só o autor da pergunta pode escolher
    - [ ] Valide que a resposta existe
    - [ ] Escreva testes

15. **Desafio 3: Nova Entidade**
    - [ ] Crie entidade `Comment` (comentário em uma resposta)
    - [ ] Crie `CommentsRepository`
    - [ ] Crie `CreateCommentUseCase`
    - [ ] Crie `DeleteCommentUseCase`
    - [ ] Escreva testes para tudo

**Checkpoint Final**: Se você completou os desafios, você domina DDD e Clean Architecture! 🎉

---

## 🏋️ Exercícios Práticos

### Exercício 1: Criar Value Object Email

**Objetivo**: Praticar criação de Value Objects

```typescript
// Crie: src/core/entities/value-objects/email.ts

export class Email {
  private constructor(public value: string) {}

  static create(email: string): Email {
    // TODO: Validar formato de email
    // TODO: Converter para lowercase
    // TODO: Remover espaços
    // TODO: Lançar erro se inválido
  }
}
```

**Testes esperados:**

- Deve aceitar email válido
- Deve rejeitar email sem @
- Deve rejeitar email sem domínio
- Deve converter para lowercase

---

### Exercício 2: Adicionar Paginação

**Objetivo**: Praticar modificação de repositórios

```typescript
// Modifique: src/domain/forum/application/repositories/questions-repository.ts

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
  findMany(page: number, perPage: number): Promise<Question[]>; // NOVO
  create(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
}
```

**Tarefas:**

1. Implemente `findMany` no repositório em memória
2. Crie `ListQuestionsUseCase`
3. Escreva testes

---

### Exercício 3: Adicionar Timestamps

**Objetivo**: Praticar modificação de entidades

**Tarefas:**

1. Adicione `deletedAt?: Date` em `QuestionProps`
2. Crie método `delete()` na entidade que define `deletedAt`
3. Crie getter `isDeleted` que verifica se `deletedAt` existe
4. Modifique `DeleteQuestionUseCase` para usar soft delete
5. Atualize testes

---

### Exercício 4: Validação de Conteúdo

**Objetivo**: Praticar regras de negócio

**Tarefas:**

1. Adicione validação: título deve ter entre 10 e 100 caracteres
2. Adicione validação: conteúdo deve ter no mínimo 20 caracteres
3. Lance erros descritivos se validação falhar
4. Escreva testes para cada validação

**Dica**: Crie as validações no método `create()` da entidade.

---

## 🤔 Perguntas para Reflexão

Responda estas perguntas para consolidar seu aprendizado:

1. **Por que separar em camadas?**

   - O que aconteceria se misturássemos regras de negócio com código de banco de dados?

2. **Por que usar interfaces para repositórios?**

   - Qual a vantagem de não usar o banco de dados diretamente no Use Case?

3. **Por que entidades têm métodos `create()` estáticos?**

   - Por que não usar `new Question()` diretamente?

4. **Quando usar Entity vs Value Object?**

   - Email é Entity ou Value Object? Por quê?
   - CPF é Entity ou Value Object? Por quê?

5. **Onde colocar validações?**
   - Validação de formato de email: Entity ou Use Case?
   - Validação de "usuário pode deletar": Entity ou Use Case?

---

## 📚 Recursos Adicionais

### Livros Recomendados

1. **Domain-Driven Design** - Eric Evans (o livro original)
2. **Implementing Domain-Driven Design** - Vaughn Vernon
3. **Clean Architecture** - Robert C. Martin (Uncle Bob)
4. **Patterns of Enterprise Application Architecture** - Martin Fowler

### Artigos e Vídeos

- [DDD na prática - Rocketseat](https://www.youtube.com/rocketseat)
- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/)
- [Martin Fowler - Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)

### Próximos Passos

Depois de dominar este projeto, você pode:

1. **Adicionar camada de infraestrutura**

   - Implementar repositórios com Prisma
   - Conectar a um banco de dados real (PostgreSQL)

2. **Adicionar camada de apresentação**

   - Criar controllers HTTP com Express ou Fastify
   - Criar rotas REST

3. **Adicionar autenticação**

   - Implementar JWT
   - Criar Use Cases de login/registro

4. **Adicionar eventos de domínio**

   - Disparar eventos quando algo acontece
   - Exemplo: Quando uma pergunta é respondida, notificar o autor

5. **Adicionar validação com Zod**
   - Validar entrada de dados
   - Criar schemas de validação

---

## 🎯 Conclusão

Parabéns por chegar até aqui! 🎉

Este projeto demonstra conceitos avançados de arquitetura de software que são usados em aplicações reais de grande escala. Ao dominar estes conceitos, você estará preparado para:

- Trabalhar em projetos complexos
- Escrever código manutenível e testável
- Colaborar em equipes de desenvolvimento
- Evoluir sistemas sem reescrever tudo

**Lembre-se:**

- DDD não é sobre código, é sobre entender o negócio
- Clean Architecture não é sobre pastas, é sobre dependências
- Testes não são perda de tempo, são investimento
- Código bom é código que outros entendem

**Continue praticando!** A melhor forma de aprender é fazendo. Tente implementar os exercícios e desafios propostos.

Se tiver dúvidas, revise as seções relevantes deste guia. Cada conceito está explicado com exemplos práticos do código.

**Bons estudos e bom código!** 💻✨

---

_Este guia foi criado com ❤️ para ajudar desenvolvedores a entenderem Clean Architecture e DDD de forma prática e acessível._
