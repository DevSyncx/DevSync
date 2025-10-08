const cron = require('node-cron');
const LeetCode = require('../models/Leetcode'); 
const axios = require('axios');

console.log('✅ leetcodeCron.js file loaded');

const batchLimit = 50; // number users should update for the each hour

const runLeetCodeBatchUpdate = async () => {
  try {
    console.log('Starting batch update for LeetCode users...');

    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const usersToUpdate = await LeetCode.find({
      lastUpdated: { $lt: sixHoursAgo }
    }).limit(batchLimit);

    const totalUsers = usersToUpdate.length;

    if (totalUsers === 0) {
      console.log('No users need updating at the moment.');
      return;
    }

    console.log(`Found ${totalUsers} users to update.`);

    let successCount = 0;
    let failCount = 0;

    for (const user of usersToUpdate) {
      try {
        await updateUserLeetCodeProfile(user.username);
        successCount++;
      } catch (err) {
        console.error(`Failed to update user ${user.username}:`, err);
        failCount++;
      }
    }

    console.log('Batch update completed.');
    console.log(`Summary: Total: ${totalUsers}, Successfully updated: ${successCount}, Failed: ${failCount}`);
  } catch (err) {
    console.error('Error in batch update:', err);
  }
};



runLeetCodeBatchUpdate(); //comment this function to stop cronjon on server start / restart

cron.schedule('0 * * * *', runLeetCodeBatchUpdate); // execute on each one hour



const updateUserLeetCodeProfile = async (username) => {
  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: `query LeetCodeProfile($username: String!, $limit: Int!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              userAvatar
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
            badges {
              id
              displayName
              icon
            }
            submissionCalendar
          }
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
            badge {
              name
              icon
              expired
            }
          }
          userContestRankingHistory(username: $username) {
            attended
            rating
            contest {
              title
              startTime
            }
          }
          recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
          }
        }`,
        variables: { username, limit: 10 },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = response.data;  

    if (!json.data?.matchedUser) {
      console.error(`User ${username} not found.`);
      return;
    }

    const contestRanking = json.data.userContestRanking || {};
    const contestHistory = json.data.userContestRankingHistory || [];

    const result = {
      username: json.data.matchedUser.username,
      profile: {
        ranking: json.data.matchedUser.profile?.ranking,
        avatar: json.data.matchedUser.profile?.userAvatar,
      },
      submitStatsGlobal: json.data.matchedUser.submitStatsGlobal.acSubmissionNum.map(sub => ({
        difficulty: sub.difficulty,
        count: sub.count,
      })),
      badges: json.data.matchedUser.badges.map(badge => ({
        id: badge.id,
        displayName: badge.displayName,
        icon: badge.icon,
      })),
      submissionCalendar: JSON.parse(json.data.matchedUser.submissionCalendar || "{}"),
      recentSubmissions: json.data.recentAcSubmissionList.map(sub => ({
        id: sub.id,
        title: sub.title,
        titleSlug: sub.titleSlug,
        timestamp: new Date(sub.timestamp * 1000).toISOString(),
      })),
      contestRating: {
        attendedContestsCount: contestRanking.attendedContestsCount || 0,
        rating: contestRanking.rating || 0,
        globalRanking: contestRanking.globalRanking || 0,
        totalParticipants: contestRanking.totalParticipants || 0,
        topPercentage: contestRanking.topPercentage || 0,
        badge: {
          name: contestRanking.badge?.name || "No Badge",
          icon: contestRanking.badge?.icon || "/default_icon.png",
          expired: contestRanking.badge?.expired || false,
        },
      },
      contestHistory: contestHistory.map(contest => ({
        attended: contest.attended || false,
        rating: contest.rating || 0,
        contest: {
          title: contest.contest.title || "No Title",
          startTime: new Date(contest.contest.startTime * 1000).toISOString(),
        },
      })),
    };

    const user = await LeetCode.findOneAndUpdate(
      { username },
      { ...result, lastUpdated: new Date() },
      { new: true }
    );

  } catch (err) {
    console.error(`Error updating ${username}:`, err);
  }
};

