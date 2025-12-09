import { Tip } from '../types';

export const mockTips: Tip[] = [
    {
        id: '1',
        title: 'Você sabia?',
        content: 'Nossos hambúrgueres são feitos com blend de carnes frescas moídas diariamente.',
        tags: ['ingredientes', 'qualidade'],
        image: 'https://placehold.co/400x200?text=Carne+Fresca'
    },
    {
        id: '2',
        title: 'Dica do Chef',
        content: 'Experimente adicionar bacon extra no X-Salada. O sabor defumado combina perfeitamente!',
        relatedProductId: 'mock-bacon', // Assuming we handle ID matching or just navigation to menu generally if not found, but better to use a real ID or category
        tags: ['dica', 'sabor'],
        image: 'https://placehold.co/400x200?text=Dica+Bacon'
    },
    {
        id: '3',
        title: 'Curiosidade',
        content: 'O Hot Dog surgiu na Alemanha, mas foi popularizado nos Estados Unidos por imigrantes.',
        relatedProductId: 'mock-hotdog',
        tags: ['historia', 'hotdog'],
        isSponsored: true,
        sponsorLabel: 'Patrocínio Cultural',
        image: 'https://placehold.co/400x200?text=Historia+HotDog'
    }
];
