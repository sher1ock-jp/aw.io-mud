import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import createjs from 'createjs-module';
import { Power3 } from 'gsap';

import socket from '../socket';
import { scene } from '../game/main';
import{ hideInstructions, keepPlaying } from '../reducers/gameState';
import Chat from './chat';

const Canvas = () => {
  const [leaderboard, setLeaderboard] = useState<Array<{nick: string, vol: number}>>([]);
  const [displayVol, setDisplayVol] = useState(4000);
  const [instructionsList, setInstructions] = useState([
    'use arrow keys to move',
    'roll over smaller objects to grow',
    'avoid being rolled up by larger players',
    'hold & release spacebar to trade volume for speed'
  ]);

  const gameState = useSelector((state: any) => state.gameState);
  const players = useSelector((state: any) => state.players);
  const abilities = useSelector((state: any)  => state.abilities);
  const casualty = useSelector((state: any)  => state.casualty);

  const dispatch = useDispatch();

  const leaderboardRef = useRef<HTMLDivElement>(null);
  const recordRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const abilitiesRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { state } = gameState;

    // load sound(s)
    createjs.Sound.registerSound('eat.ogg', 'eatSound');
    createjs.Sound.registerSound('eat_player.wav', 'eatPlayerSound');

    // animate HUD fly-in
    gsap.from(leaderboardRef.current, {
      x: '-=400',
      y: '-=400',
      scale: 3,
      opacity: 0,
      ease: "power3.out",
      delay: 2,
      duration: 1
    });
    
    gsap.from(recordRef.current, {
      x: '+=400',
      y: '-=400',
      scale: 3,
      opacity: 0,
      ease: "power3.out",
      delay: 2,
      duration: 1
    });
    
    gsap.from(abilitiesRef.current, {
      x: '-=400',
      y: '+=400',
      scale: 3,
      opacity: 0,
      ease: "power3.out",
      delay: 2,
      duration: 1
    });
    
    gsap.from(scoreRef.current, {
      x: '+=400',
      y: '+=400',
      scale: 3,
      opacity: 0,
      ease: "power3.out",
      delay: 2,
      duration: 1
    });

    // show instructions
    if (!state) {
      const tl = gsap.timeline({ repeat: -1 })
        .from(instructionsRef.current, {
          duration: 1.5,
          opacity: 0,
          ease: Power3.easeOut,
        }, '+=3.5')
        .to(instructionsRef.current, {
          duration: 0.5,
          opacity: 0,
          ease: Power3.easeOut,
          onComplete: () => setInstructions(prevInstructions => prevInstructions.slice(1)),
        }, '+=3')
        .fromTo(instructionsRef.current, 
          {
            opacity: 0,
            ease: Power3.easeOut,
          }, 
          { 
            duration: 1.5,
            opacity: 1 
          }, '+=1')
        .to(instructionsRef.current, {
          duration: 0.5,
          opacity: 0,
          ease: Power3.easeOut,
          onComplete: () => setInstructions(prevInstructions => prevInstructions.slice(1)),
        }, '+=4')
        .fromTo(instructionsRef.current, 
          {
            opacity: 0,
            ease: Power3.easeOut,
          }, 
          { 
            duration: 1.5,
            opacity: 1 
          }, '+=1')
        .to(instructionsRef.current, {
          duration: 0.5,
          opacity: 0,
          ease: Power3.easeOut,
          onComplete: () => {
            dispatch(hideInstructions());
          }
        }, '+=5')
    }
  }, [gameState]);

  const player = players[socket.id];
  let myNick = '';

  // populate leaderboard
  if (player && scene) {
    const newLeaderboard = [];

    // shorten own nickname
    myNick = scene.getObjectByName(socket.id).nickname;
    if (myNick.length > 15) {
      myNick = `${myNick.slice(0, 14)}...`;
    }

    // shorten all other nicknames
    for (const id in players) {
      let nick = scene.getObjectByName(id).nickname;
      if (nick.length > 15) {
        nick = `${nick.slice(0, 14)}...`;
      }
      newLeaderboard.push({ nick, vol: players[id].volume });
    }

    // order by volume
    newLeaderboard.sort((a, b) => b.vol - a.vol);
    setLeaderboard(newLeaderboard);
  }

  // show score
  if (player) {
    if (player.volume > displayVol) {
      if (player.volume / displayVol > 1.01) {
        setDisplayVol(prevDisplayVol => Math.floor(prevDisplayVol * 1.01));
      } else {
        setDisplayVol(player.volume);
      }
    } else if (player.volume < displayVol) {
      if (displayVol / player.volume > 1.01) {
        setDisplayVol(prevDisplayVol => Math.floor(prevDisplayVol / 1.01));
      } else {
        setDisplayVol(player.volume);
      }
    }
  }

  // show eater/eaten status for 3 seconds before fading
  if (gameState.status.length) {
    setTimeout(() => dispatch(keepPlaying()), 3000);
  }

  return (
    <div className="in-game">
      <div className="hud">
        <div ref={leaderboardRef} className="leaderboard">
          <table>
            <tbody>
              {player && leaderboard.map((person, index) => (
                <tr key={`leaderboard-row-${index + 1}`} style={myNick === person.nick ? { backgroundColor: 'rgba(0,0,0,0.3)' } : {}}>
                  {/* <td style={{ padding: '0px 10px', borderRadius: '0px' }}>{person.place || index + 1}</td> */}
                  <td style={{ padding: '0px 10px', borderRadius: '0px' }}>{person.nick}</td>
                  <td style={{ padding: '0px 10px', borderRadius: '0px' }}>{person.vol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div ref={recordRef} className="record">
          <div>
            { casualty && casualty.map((e: any, i: any) => <div key={`casualty-${i}`}>{e}</div>) }
          </div>
        </div>
        <div ref={statusRef} className="status">
          <div>{gameState.status}</div>
        </div>
        <div ref={instructionsRef} className="instructions">
          <div>{instructionsList[0]}</div>
        </div>
        <div ref={abilitiesRef} className="abilities">
          <div>
            { abilities && abilities.map((a: any, i: any) => <div key={`ability-${i}`}>{a}</div>) }
          </div>
        </div>
        <div ref={scoreRef} className="score">
          <div>{displayVol}</div>
        </div>
      </div>
      <div>
        <canvas id="canvas" style={{ background: 'linear-gradient(#004570,#00ABD6)' }} />
      </div>
      <Chat />
    </div>
  );
}

export default Canvas;