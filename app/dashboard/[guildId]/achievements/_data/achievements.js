// app/dashboard/[guildId]/achievements/_data/achievements.js

// 🔥 Single source of truth for ALL achievements
// Editor + Overview both read from this

export const ACHIEVEMENTS = [
  {
    id: "king-of-spam",
    name: "King of Spam",
    description: "Send messages",
    actionType: "messages",

    tiers: [
      {
        id: "bronze",
        label: "Bronze",
        count: 20,
        rewards: {
          giveRole: false,
          removeRole: false,
          giveXP: false,
          giveCoins: false,
          giveRoleId: null,
          removeRoleId: null,
        },
      },
      {
        id: "silver",
        label: "Silver",
        count: 100,
        rewards: {
          giveRole: false,
          removeRole: false,
          giveXP: false,
          giveCoins: false,
          giveRoleId: null,
          removeRoleId: null,
        },
      },
      {
        id: "gold",
        label: "Gold",
        count: 500,
        rewards: {
          giveRole: false,
          removeRole: false,
          giveXP: false,
          giveCoins: false,
          giveRoleId: null,
          removeRoleId: null,
        },
      },
      {
        id: "diamond",
        label: "Diamond",
        count: 1000,
        rewards: {
          giveRole: false,
          removeRole: false,
          giveXP: false,
          giveCoins: false,
          giveRoleId: null,
          removeRoleId: null,
        },
      },
    ],

    settings: {
      dontTrackPast: true,
      setDeadline: false,
      deadline: "",
      almostThere: true,
    },
  },

  {
    id: "reaction-master",
    name: "Reaction Master",
    description: "Add reactions to messages",
    actionType: "reactions",

    tiers: [
      { id: "bronze", label: "Bronze", count: 50, rewards: defaultRewards() },
      { id: "silver", label: "Silver", count: 250, rewards: defaultRewards() },
      { id: "Gold", label: "Gold", count: 1000, rewards: defaultRewards() },
      { id: "diamond", label: "Diamond", count: 2000, rewards: defaultRewards() },
    ],

    settings: {
      dontTrackPast: true,
      setDeadline: false,
      deadline: "",
      almostThere: true,
    },
  },

  {
    id: "stay-awhile",
    name: "Stay Awhile and Listen",
    description: "Spend minutes in voice channels",
    actionType: "voice",

    tiers: [
      { id: "bronze", label: "Bronze", count: 10, rewards: defaultRewards() },
      { id: "silver", label: "Silver", count: 60, rewards: defaultRewards() },
      { id: "gold", label: "Gold", count: 300, rewards: defaultRewards() },
      { id: "diamond", label: "Diamond", count: 600, rewards: defaultRewards() },
    ],

    settings: {
      dontTrackPast: true,
      setDeadline: false,
      deadline: "",
      almostThere: true,
    },
  },

  {
    id: "thread-creator",
    name: "Thread Creator",
    description: "Create threads",
    actionType: "threads",

    tiers: [
      { id: "bronze", label: "Bronze", count: 5, rewards: defaultRewards() },
      { id: "silver", label: "Silver", count: 25, rewards: defaultRewards() },
      { id: "gold", label: "Gold", count: 100, rewards: defaultRewards() },
      { id: "diamond", label: "Diamond", count: 200, rewards: defaultRewards() },
    ],

    settings: {
      dontTrackPast: true,
      setDeadline: false,
      deadline: "",
      almostThere: true,
    },
  },
];

// Default reward template
function defaultRewards() {
  return {
    giveRole: false,
    removeRole: false,
    giveXP: false,
    giveCoins: false,
    giveRoleId: null,
    removeRoleId: null,
  };
}
