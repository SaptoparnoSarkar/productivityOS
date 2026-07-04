
// RANKS
const RANKS = [
    { name: "Private / Recruit", minXp: 0 },
    { name: "Corporal", minXp: 500 },
    { name: "Sergeant", minXp: 1500 },
    { name: "Lieutenant", minXp: 3500 },
    { name: "Vice Captain", minXp: 7000 },
    { name: "Captain", minXp: 13000 },
    { name: "Sergeant Major", minXp: 22000 },
    { name: "Major", minXp: 35000 },
    { name: "Lieutenant Colonel", minXp: 55000 },
    { name: "Colonel", minXp: 80000 },
    { name: "General", minXp: 150000 },
    { name: "Napoleon", minXp: 300000 },
];

// Get's the rank of user based on his xp.
export function getRankForXp(totalXp: number) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        const rank = RANKS[i]
        if (rank && totalXp >= rank.minXp) {
            return rank;
        }
    }
    return RANKS[0]!;
}

// This is to get the progress.
export function getRankProgress(totalXp: number) {
    const currentRank = getRankForXp(totalXp);
    const nextRank = RANKS.find(r => r.minXp > totalXp);
    if (!nextRank) {
        return { percent: 100, text: 'MAXED OUT' };
    }
    const requiredXp = nextRank.minXp - currentRank.minXp;

    // How much xp you've earned since you entered this rank
    const amountToNextRank = totalXp - currentRank.minXp;
    const percent = (amountToNextRank / requiredXp) * 100;
    return {
        percent: Math.floor(percent),
        text: `${currentRank.name} → ${nextRank.name}`
    }
}