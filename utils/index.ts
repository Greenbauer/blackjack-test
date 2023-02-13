import { Card } from "@/types";

async function get(url: string) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getDeckId() {
  const data = await get(
    `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
  );

  return data.deck_id
};

export async function drawCards(deckId: string, numberOfCards: number = 1) {
  const data = await get(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numberOfCards}`
  );
  
  return data.cards.map((card: { code: string, value: string, images: { svg: string } }) => {
    const { code, value, images: { svg } } = card
    return {
      id: code,
      value,
      img: svg
    } as Card
  })
};