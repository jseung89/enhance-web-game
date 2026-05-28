import React, { useMemo, useState } from 'react';
import { rankingTabs } from '../data/mockRankings.js';
import { getHallOfFame, getMyRanking, getRankingLogs, getRankings } from '../services/rankingService.js';
import RankingWeaponSprite from './RankingWeaponSprite.jsx';

const tabCopy = {
  overall: '종합 점수 기준으로 강화 중독자들을 정렬했습니다.',
  floor: '악마의 동굴 최고층 돌파 기록입니다.',
  enhance: '가장 높은 강화 수치를 기록한 무기들입니다.',
  kills: '몬스터를 많이 혼낸 순서입니다.',
  hall: '시즌 명예 기록을 보관하는 전당입니다.'
};

function formatFloor(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? `${n}층` : '기록 없음';
}

function formatEnhancement(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `+${n}` : '+0';
}

function formatKills(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getWeaponName(weapon) {
  return weapon?.displayName || weapon?.name || '기본 무기';
}

function WeaponLabel({ weapon, showSprite = true, spriteSize = 'table' }) {
  const safeWeapon = weapon || { name: '기본 무기', displayName: '기본 무기', enhancement: 0 };
  return (
    <span className="ranking-weapon">
      {showSprite && <RankingWeaponSprite weapon={safeWeapon} size={spriteSize} />}
      <span className="ranking-weapon-name"><b>{formatEnhancement(safeWeapon.enhancement)}</b> {getWeaponName(safeWeapon)}</span>
    </span>
  );
}

function RankingSummary({ summary }) {
  const weapon = summary.representativeWeapon || { name: '기본 무기', enhancement: summary.highestEnhancement || 0 };
  return (
    <section className="ranking-summary ranking-card">
      <div className="ranking-ribbon">내 랭킹 요약</div>
      <div className="ranking-summary-profile">
        <div className="ranking-avatar ranking-avatar-large">{summary.avatarText || summary.displayName?.slice(0, 1) || '강'}</div>
        <div>
          <h2>{summary.displayName || '승이형'}</h2>
          <p className="ranking-my-weapon"><WeaponLabel weapon={weapon} spriteSize="table" /></p>
          <p className="ranking-guild">🛡️ {summary.guildName || '우리들의 강화단'}</p>
        </div>
      </div>
      <div className="ranking-summary-weapon" aria-label="내 대표 무기">
        <RankingWeaponSprite weapon={weapon} size="summary" />
        <div className="ranking-summary-weapon-copy">
          <span>대표 무기</span>
          <strong>{formatEnhancement(weapon?.enhancement ?? summary.highestEnhancement)} {getWeaponName(weapon)}</strong>
        </div>
      </div>
      <div className="ranking-summary-stats">
        <div className="ranking-stat ranking-stat-rank"><span>종합</span><strong>{summary.overallRank || 1}위</strong></div>
        <div className="ranking-stat"><span>최고층</span><strong>{formatFloor(summary.highestFloor)}</strong></div>
        <div className="ranking-stat"><span>최고강화</span><strong>{formatEnhancement(summary.highestEnhancement)}</strong></div>
        <div className="ranking-stat"><span>처치 수</span><strong>{formatKills(summary.monsterKills)}</strong></div>
      </div>
      <div className="ranking-next-goal">
        <span>다음 목표</span>
        <strong>{summary.nextGoalMessage || 'PVE 모험을 플레이하면 랭킹이 갱신됩니다.'}</strong>
        <em>화이팅!</em>
      </div>
    </section>
  );
}

function RankingTabs({ activeTab, onChange }) {
  return (
    <div className="ranking-tabs" role="tablist" aria-label="랭킹 분류">
      {rankingTabs.map((tab) => (
        <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => onChange(tab.id)} type="button">
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ChallengerWaitingCard({ place }) {
  const tone = place === 2 ? 'silver' : 'bronze';
  return (
    <article className={`ranking-top-card ${tone} ranking-waiting-card place-${place}`}>
      <div className="ranking-medal"><span>{place}</span></div>
      <div className="ranking-card-main">
        <div className="ranking-avatar">?</div>
        <div>
          <h3>도전자 대기중</h3>
          <p className="ranking-waiting-copy">PVE 모험을 플레이하면 랭킹에 등록됩니다.</p>
        </div>
      </div>
      <div className="ranking-title-badge">칭호 다음 강화 중독자</div>
    </article>
  );
}

function TopThreeCard({ player, place }) {
  const tone = place === 1 ? 'gold' : place === 2 ? 'silver' : 'bronze';
  const weapon = player.representativeWeapon || { name: '기본 무기', enhancement: player.highestEnhancement || 0 };
  return (
    <article className={`ranking-top-card ${tone} place-${place}`}>
      <div className="ranking-medal"><span>{place}</span></div>
      <div className="ranking-card-main">
        <div className="ranking-avatar">{player.avatarText || player.displayName?.slice(0, 1) || '강'}</div>
        <div>
          <h3>{player.displayName || `테스터${place}`}</h3>
          <WeaponLabel weapon={weapon} showSprite={false} />
        </div>
      </div>
      <div className="ranking-weapon-art" aria-hidden="true">
        <RankingWeaponSprite weapon={weapon} size={place === 1 ? 'top1' : 'topCard'} />
      </div>
      <div className="ranking-card-stats">
        <span>최고층 <b>{formatFloor(player.highestFloor)}</b></span>
        <span>처치 <b>{formatKills(player.monsterKills)}</b></span>
        <span>강화 <b>{formatEnhancement(player.highestEnhancement)}</b></span>
      </div>
      <div className="ranking-title-badge">칭호 {player.title || '강화 입문자'}</div>
    </article>
  );
}

function RankingTopThree({ rankings }) {
  const first = rankings[0];
  const second = rankings[1];
  const third = rankings[2];

  if (!first) {
    return (
      <section className="ranking-empty-state ranking-card">
        <strong>아직 등록된 랭킹이 없습니다.</strong>
        <span>PVE 모험을 플레이하면 랭킹이 등록됩니다.</span>
      </section>
    );
  }

  return (
    <section className="ranking-top-three" aria-label="TOP 3 랭킹">
      {second ? <TopThreeCard player={second} place={2} /> : <ChallengerWaitingCard place={2} />}
      <TopThreeCard player={first} place={1} />
      {third ? <TopThreeCard player={third} place={3} /> : <ChallengerWaitingCard place={3} />}
    </section>
  );
}

function RankingTable({ rankings }) {
  const rows = rankings.slice(3, 10);
  return (
    <section className="ranking-table-wrap ranking-card">
      <table className="ranking-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>유저</th>
            <th>대표 무기</th>
            <th>최고층</th>
            <th>최고강화</th>
            <th>처치 수</th>
            <th>칭호</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map((player) => (
            <tr key={player.userId}>
              <td className="rank-no">{player.rank}</td>
              <td><span className="ranking-mini-avatar">{player.avatarText || player.displayName?.slice(0, 1) || '강'}</span>{player.displayName || '테스터'}</td>
              <td><WeaponLabel weapon={player.representativeWeapon} spriteSize="table" /></td>
              <td>{formatFloor(player.highestFloor)}</td>
              <td className="ranking-blue">{formatEnhancement(player.highestEnhancement)}</td>
              <td>{formatKills(player.monsterKills)}</td>
              <td>{player.title || '강화 입문자'}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7" className="ranking-table-empty">아직 4위 이하 랭킹이 없습니다. 더 많은 플레이어가 참여하면 표시됩니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

function RankingLogIcon({ log }) {
  if (log.weapon) return <RankingWeaponSprite weapon={log.weapon} size="log" />;
  return <span>{log.icon || '✨'}</span>;
}

function RankingLogs({ logs }) {
  const safeLogs = Array.isArray(logs) ? logs.filter((log) => log?.message) : [];
  return (
    <section className="ranking-log-panel ranking-card">
      <div className="ranking-side-title"><h3>🕘 최근 기록</h3><button type="button">더보기</button></div>
      <div className="ranking-log-list">
        {safeLogs.length > 0 ? safeLogs.map((log) => (
          <article className={`ranking-log ${log.type || 'ranking_update'}`} key={log.id}>
            <span className="ranking-log-icon"><RankingLogIcon log={log} /></span>
            <p>{log.message}</p>
            <time>{log.createdAtLabel || '방금 전'}</time>
          </article>
        )) : (
          <article className="ranking-log ranking_update">
            <span className="ranking-log-icon">✨</span>
            <p>아직 최근 기록이 없습니다. 강화나 PVE 모험을 진행해보세요.</p>
            <time>대기중</time>
          </article>
        )}
      </div>
    </section>
  );
}

function HallOfFame({ hall }) {
  return (
    <section className="ranking-hall-panel ranking-card">
      <div className="ranking-side-title"><h3>👑 명예의 전당</h3></div>
      <div className="ranking-hall-body">
        <div className="ranking-hall-emblem">
          {hall.winningWeapon ? <RankingWeaponSprite weapon={hall.winningWeapon} size="hall" /> : (hall.icon || '👑')}
        </div>
        <div>
          <strong>{hall.title || '전설의 강화자'}</strong>
          <p>{hall.subtitle || '시즌 1 최종 1위'}</p>
          <b>{hall.displayName || '승이형'}</b>
          {hall.winningWeapon && <small>우승 무기 {formatEnhancement(hall.winningWeapon.enhancement)} {getWeaponName(hall.winningWeapon)}</small>}
        </div>
        <button type="button">보기</button>
      </div>
    </section>
  );
}

export default function RankingPage({ state }) {
  const [activeTab, setActiveTab] = useState('overall');
  const rankings = useMemo(() => getRankings({ type: activeTab, currentState: state }), [activeTab, state]);
  const myRanking = useMemo(() => getMyRanking(state), [state]);
  const logs = useMemo(() => getRankingLogs({ currentState: state }), [state]);
  const hall = useMemo(() => getHallOfFame(), []);

  return (
    <main className="ranking-page">
      <RankingSummary summary={myRanking} />
      <div className="ranking-content-grid">
        <section className="ranking-main-column">
          <RankingTabs activeTab={activeTab} onChange={setActiveTab} />
          <p className="ranking-tab-copy">{tabCopy[activeTab]}</p>
          {activeTab === 'hall' ? (
            <section className="ranking-hall-feature ranking-card">
              <div className="ranking-hall-crown">
                {hall.winningWeapon ? <RankingWeaponSprite weapon={hall.winningWeapon} size="top1" /> : '👑'}
              </div>
              <h2>{hall.title}</h2>
              <p>시즌 기록은 추후 API/DB와 연결되면 서버 전체 명예의 전당으로 확장됩니다. 지금은 로컬 프로토타입 전당입니다.</p>
              <div className="ranking-hall-feature-name">{hall.subtitle} · {hall.displayName} · {formatEnhancement(hall.winningWeapon?.enhancement)} {hall.winningWeapon?.name}</div>
            </section>
          ) : (
            <>
              <RankingTopThree rankings={rankings} />
              <RankingTable rankings={rankings} />
            </>
          )}
        </section>
        <aside className="ranking-side-column">
          <RankingLogs logs={logs} />
          <HallOfFame hall={hall} />
        </aside>
      </div>
    </main>
  );
}
