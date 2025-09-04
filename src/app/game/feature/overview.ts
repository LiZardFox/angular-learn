import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Card {
    id: number;
    title: string;
    description: string;
    route: string;
    icon?: string;
}

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [RouterModule],
    template: `
        <div class="overview-container">
            <h1>Game Overview</h1>
            <div class="cards-grid">
                @for (card of cards; track $index) {
                    <div class="card">
                    <a [routerLink]="card.route" class="card-link">
                        <div class="card-content">
                            @if (card.icon) {
                                <div class="card-icon">{{ card.icon }}</div>
                                <h3>{{ card.title }}</h3>
                                <p>{{ card.description }}</p>
                            }
                        </div>
                    </a>
                </div>
                }
            </div>
        </div>
    `,
    styles: [`
        .overview-container {
            padding: 2rem;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
        }

        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .card-link {
            text-decoration: none;
            color: inherit;
            display: block;
        }

        .card-content {
            padding: 1.5rem;
            text-align: center;
        }

        .card-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .card h3 {
            margin: 0 0 0.5rem 0;
            color: #333;
        }

        .card p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
            .cards-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 768px) {
            .cards-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 480px) {
            .cards-grid {
                grid-template-columns: 1fr;
            }
        }
    `]
})
export default class Overview {
    cards: Card[] = [
        {
            id: 1,
            title: 'Game',
            description: 'View top players and rankings',
            route: '/game/play/hiragana',
            icon: '🎮'
        },
    ];
}