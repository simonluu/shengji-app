import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class HowToPlay extends Component {
  render() {
    return (
      <div className='how-to-play-page'>
        <h1>How to Play Sheng ji</h1>
        <h4>Players and objectives</h4>
        <p>
          The game is played with four players in fixed partnerships, with players sitting across each other forming a team. Each team
          has a rank that they are currently playing, henceforth referred to as their score. At the beginning of a match, everyone starts at a score of 2.
        </p>
        <p>
          The teams are divided into the 'masters' and the 'attackers', which are determined in the process of the game and will change frequently.
          Ultimately the purpose of the game is to raise one's own team to the score above ace, while preventing the other team from doing so.
        </p>
        <h4>The deck</h4>
        <p>The game is played with two decks, with two jokers per deck, giving a total of four jokers. The jokers are separated into big and small.</p>
        <p>
          The order of the cards depends on the dominant suit and rank, which are determined before every round. The typical order, from
          highest to lowest, is:
          <ol>
            <li>Big jokers</li>
            <li>Small jokers</li>
            <li>Cards in both the dominant suit and rank</li>
            <li>Other cards in the dominant rank</li>
            <li>Other cards in the dominant suit, descending order ace through 2</li>
            <li>Cards in other suits, descending order ace through 2</li>
          </ol>
        </p>
        <p>
          Note that the other dominant rank cards are no longer considered members of their respective suit, but part of the trump suit;
          the big jokers are equally ranked with each other, and so are the small jokers, and the dominant rank card of all suits. In other words,
          they are all considered to be a trump card with the order big jokers > small joker > dominant suit and rank > dominant rank.
        </p>
        <p>If two or more equally ranked cards or combinations are played during a trick, the first one played wins.</p>
        <h5>Point cards</h5>
        <p>
          In the deck, all kings and 10s are worth 10 points each, while 5s are worth 5 points each, although the presence of the points do not
          affect the order of the cards. In two decks, there are a total of 200 points. All other cards do not contain points.
        </p>
        <p>
          For the attackers, the goal of each round is to obtain 80 points or more in one round to become masters in the next round,
          while for the masters, it would be preventing the attackers from obtaining 80 points, and thus raising their team's rank.
        </p>
        <h4>Dealing</h4>
        <p>
          The cards are dealt out in Chinese fashion, where the players take turns drawing one card at a time in counter-clockwise order.
          The cards are shuffled when the game starts and the host of the game draws the first card.
        </p>
        <h5>Determining masters and dealers</h5>
        <p>
          The dealer is a member of the masters' team that starts every round, and plays an important role in helping his team increase their
          rank in that round. The dealer is usually determined as such:
          <ul>
            <li>
              In the first round, everytime starts at rank of 2. For teams are not separated into masters or attackers yet, players should reveal
              any 2 card from the cards he or she drew as quickly as possible; the first to do so will instantly become the dealer. His team will thus
              become the masters while the other team will become the attackers. If the masters have been declared, you may reveal a pair of 2s of the same
              suit to become the masters.
            </li>
            <li>
              In subsequent rounds, if the masters have defended their points in the previous round, they will remain as declarers, but the
              partner of the previous dealer will become the new dealer. If the attackers achieved 80 points, they will become the new masters, with
              the player sitting on the right of the previous dealer becoming the new dealer.
            </li>
          </ul>
        </p>
        <h5>Determining the dominant suit and rank</h5>
        <p>
          The dominant rank is always equal to the score of the masters in any particular round. Hence, when the masters obtain a score of 5,
          the rank for that round is 5; when the score is raised to 7, the rank is 7, and so on.
        </p>
        <p>
          The dominant suit, on the other hand, is determined during the drawing of cards where any player decides to reveal a card in the trump rank
          he has, and the suit of the card becomes the trump suit.
          <ul>
            <li>
              In cases where players do not agree to the dominant suit set, they may play doubles of another suit in the same rank to cancel the original
              declaration, making the new suit the dominant suit.
            </li>
            <li>
              In certain cases, where no player decides to reveal a card to determine the dominant suit, then the first card in the deck is turned over, and its
              suit is adopted as the dominant suit. If the card turned over is a joker, then the subsequent card is turned over.
            </li>
          </ul>
        </p>
        <h5>Concluding the deal</h5>
        <p>
          Drawing continues until everyone has drawn 25 cards and a pool of reserve cards (usually consisting of eight cards), remain. The dealer then picks up all the cards,
          integrates them into his hand, and then discards the same number of cards into a pile in the center into the deck. These cards are kept unopened throughout the duration
          of that round and may or may not be turned over thereafter, depending on the result of the last trick in the round.
        </p>
        <h4>Play</h4>
        <p>
          The dealer leads the first trick with any single card or combination of carads, and the game proceeds like most trick-taking games, where the players take turn to play their
          cards in a counter-clockwise direction, and the player who plays the highest-ordered card or combination of cards take the trick and leads the next round. All cards taken by the
          masters may be discarded for the rest of the round; point cards taken by the attackers count towards their number of points collected, and should be kept, but other cards may be
          similarly discarded.
        </p>
        <p>
          A lead may be one of four types, each with different rules dealing with what can be played on it. As a rule of thumb, when any card or combination of cards is lead, other players
          must always follow the number of card(s) played.
        </p>
        <h5>Single or double cards</h5>
        <p>
          Any single card may be lead. Players must follow suit if they have cards in the same suit; if a trump card is lead, other players must play a trump card, if they still have any. The
          highest trump, or, if no trump is played, the highest-ordered card of the suit lead takes the trick. In case of ties, the first highest card played wins the trick.
        </p>
        <p>
          Only two identical cards are considered doubles, so two different-suited trump rank cards, two ordinary non-trump cards with the same value, or a combination of a big joker and a
          small joker are not counted.
        </p>
        <p>
          After a double-cards lead, other players must also follow suit with double cards, if they have them; for players who do not have double cards in the suit lead, they may either play
          separate cards in the same suit, any two cards from other suits, or a double from the trump suit to 'ruff' the trick. In this case, the highest-ordered trump double, if it is played,
          wins the trick; otherwise the highest-ordered double in the suit lead wins. Two singles may not beat a double even if they are both higher-ordered than the double.
        </p>
        <h5>Consecutive double cards</h5>
        <p>
          If a player has consecutive pairs of cards in the same suit (trump or non-trump), he or she may lead it as a group. In this case, other players must follow suit by playing cards according
          to the following priority, if they have them:
          <ol>
            <li>Other consecutive doubles in the same suit</li>
            <li>Other doubles in the same suit</li>
            <li>Other singles in the same suit</li>
          </ol>
        </p>
        <p>
          The first combination, if all consecutive and of greater order than the suit lead, wins the trick. Only when a player does not have any other card in the suit played, then he is allowed
          to play cards of other suits, or ruff the combination with the same number of consecutive pairs in the trump suit.
        </p>
        <h5>Combination of multiple cards</h5>
        <p>
          A player may lead a combination of multiple cards if he has them, provided that each of the singles or doubles played are the largest in the suit and no other player has larger combinations
          in that round. Leading such combinations usually result in the leading player's favour.
          <ol>
            <li>
              If any card(s) in the combination may be bested by another player in the suit lead, he will be asked, by that player, to take back the cards that are the largest in the suit, and play
              any of the single/double cards that may be bested as penalty.
            </li>
            <li>If the cards are consecutive doubles, the player is exempted from the above rule.</li>
            <li>
              Any non-trump combinations played are subjected to be bested (ruffed) by trump cards played by other players. Combinations ruffed do not require taking back cards, but this is not
              guaranteed (see rule 1 above).
              <ul>
                <li>Any single trump card or trump doubles may, respectively, beat a single card or double cards in the combination.</li>
                <li>Consecutive non-trump doubles may only be ruffed by consecutive trump doubles.</li>
              </ul>
            </li>
            <li>Any combinations with cards that are not trump, yet do not follow the suit lead may not take the trick.</li>
          </ol>
        </p>
        <h4>Scoring</h4>
        <p>
          At the end of a round, all points taken by the attackers are collected and counted, while other cards may be discarded. The last trick of that round is also taken into consideration:
          <ul>
            <li>If the masters win the last round, then the point count ends there.</li>
            <li>If the attackers win the last round, then the pile of 9 cards in the deck is turned over, and any points in there are doubled and added to the attackers' point count</li>
            <li>In total, if the attackers capture 80 points or more, then they become the new masters, and the other team becomes the attackers</li>
          </ul>
        </p>
        <p>
          The results of the attackers' point count determine the change of the scores or dealers as such:
          <ul>
            <li>Points taken by attackers: 0, Score Change: Masters +3, Team Swap: No, Change Dealer: Partner of current dealer</li>
            <li>Points taken by attackers: 5-35, Score Change: Masters +2, Team Swap: No, Change Dealer: Partner of current dealer</li>
            <li>Points taken by attackers: 40-75, Score Change: Masters +1, Team Swap: No, Change Dealer: Partner of current dealer</li>
            <li>Points taken by attackers: 80-115, Score Change: None, Team Swap: Yes, Change Dealer: Opposing player right of current dealer</li>
            <li>Points taken by attackers: 120-155, Score Change: Attackers +1, Team Swap: Yes, Change Dealer: Opposing player right of current dealer</li>
            <li>Points taken by attackers: 160-195, Score Change: Attackers +2, Team Swap: Yes, Change Dealer: Opposing player right of current dealer</li>
            <li>Points taken by attackers: 200+, Score Change: Attackers +3, Team Swap: Yes, Change Dealer: Opposing player right of current dealer</li>
          </ul>
        </p>
        <p>Thereafter, all cards are recollected and shuffled, and the next round thus begins.</p>
        <p style={{ textAlign: 'center' }}>Rules taken from <a href='https://en.wikipedia.org/wiki/Sheng_ji'>Sheng ji</a> Wikipedia page</p>
        <hr />
        <Link className='secondary-button' to='/'>Back</Link>
      </div>
    );
  }
}