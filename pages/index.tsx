import styles from '@/styles/Home.module.css'
import { Card } from '@/types';
import { drawCards, getDeckId } from '@/utils';
import { useEffect, useState } from 'react'
import HandView from '../components/HandView'

export async function getStaticProps() {
  const deckId = await getDeckId()

  return {
    props: {
      deckId,
      initCards: await drawCards(deckId, 4)
    }
  }
}

type HomeType = {
  deckId: string
  initCards: Card[]
}

export default function Home({ deckId, initCards }: HomeType) {
  const [houseCards] = useState<Card[]>([initCards[0], initCards[2]])
  const [housePoints, setHousePoints] = useState<number>(0)
  const [playerCards, setPlayerCards] = useState<Card[]>([initCards[1], initCards[3]])
  const [playerPoints, setPlayerPoints] = useState<number>(0)
  const [gameWinner, setGameWinner] = useState<string | null>(null)

  const getPoints = (cards: Card[], currentPoints: number) => {
    let points = 0

    cards.forEach(card => {
      const { value } = card

      if (['JACK', 'QUEEN', 'KING'].includes(value)) {
        points += 10
      } else if (['ACE'].includes(value)) {
        // ace will be set to 1 point if it goes over the 21 limit
        if (currentPoints - 11 > 21) points += 1;
        else points += 11
      } else points += Number(value);
    })

    return points
  }

  const handlePlayerDrawCard = async () => {
    const cards = await drawCards(deckId, 1)

    if (cards) {
      setPlayerCards([...playerCards, ...cards])
    }
  }

  const handleFinishGame = () => {
    if (housePoints > playerPoints) {
      setGameWinner('house')
    } else setGameWinner('player')
  }
  
  useEffect(() => {
    setHousePoints(getPoints(houseCards, housePoints))
    setPlayerPoints(getPoints(playerCards, playerPoints))
  }, [houseCards, playerCards])

  useEffect(() => {
    if (playerPoints > 21) setGameWinner('house')
    if (playerPoints === 21) setGameWinner('player')
    else if (housePoints > 21) setGameWinner('player')
  }, [housePoints, playerPoints])

  return (
    <main className={styles.main}>
      <h2>Dealer</h2>
      <HandView cards={houseCards} points={housePoints} />
      <h2>Player</h2>
      <HandView cards={playerCards} points={playerPoints} />
      {gameWinner ? (
        <div>
          {gameWinner === 'player' ? 'You Win!' : 'You lose. haha'}
        </div>
      ) : (
        <div style={{display: 'flex', gap: '16px'}}>
          <button onClick={handlePlayerDrawCard}>Hit</button>
          <button onClick={handleFinishGame}>Stand</button>
        </div>
      )}
    </main>
  )
}
