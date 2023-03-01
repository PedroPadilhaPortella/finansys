import { InMemoryDbService } from 'angular-in-memory-web-api'
import { Category } from './pages/categories/shared/category.model'

export class InMemoryDatabase implements InMemoryDbService {
 
  createDb() {
    const categories: Category[] = [
      { id: 1, name: 'Lazer', description: 'Atividades de lazer como ir ao cinema, parque, etc'},
      { id: 2, name: 'Saúde', description: 'Planos de saúde, etc'},
      { id: 2, name: 'Investimentos', description: 'Ações, Fiis, etc'},
    ]

    return { categories }
  }
}