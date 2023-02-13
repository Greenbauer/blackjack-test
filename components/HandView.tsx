import Image from 'next/image'
import { Card } from '@/types';

type HandViewType = {
    cards: Card[]
    points: number
}

export default function HandView({ cards, points }: HandViewType) {
    return (
        <div>
            <div>
                <h4>
                    {`Points: ${points}`}
                </h4>
            </div>
            <div>
                {cards.map((card) => {
                    const { img, id } = card
                    return (<Image key={id} src={img} alt={id} width="300" height="400" />)
                })}
            </div>
        </div>
    )
}
