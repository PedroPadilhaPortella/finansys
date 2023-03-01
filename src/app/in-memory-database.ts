import { InMemoryDbService } from 'angular-in-memory-web-api'

export class InMemoryDatabase implements InMemoryDbService {
 
  createDb() {
    const categories = [
      { id: 1, nome: 'Lazer', descricao: 'Atividades de lazer como ir ao cinema, parque, etc'},
      { id: 2, nome: 'Saúde', descricao: 'Planos de saúde, etc'},
    ]

    return { categories }
  }
}