/**
 * PSCMRCET SPORTS ARENA - Mongoose Schemas & MongoDB Model Definitions
 * Academic FSD Reference Architecture
 */

export interface MongooseSchemaDefinition {
  collection: string;
  fields: Record<string, any>;
  relations: Record<string, string>;
}

export const MongoModels = {
  User: {
    name: 'User',
    fields: {
      name: { type: 'String', required: true, trim: true },
      email: { type: 'String', required: true, unique: true, lowercase: true },
      password: { type: 'String', required: true },
      role: { type: 'String', enum: ['admin', 'coordinator', 'student'], default: 'student' },
      department: { type: 'String', ref: 'Department', required: true },
      rollNo: { type: 'String' },
      phone: { type: 'String' },
      avatar: { type: 'String' },
      createdAt: { type: 'Date', default: 'Date.now' },
    },
  },
  Department: {
    name: 'Department',
    fields: {
      code: { type: 'String', required: true, unique: true },
      name: { type: 'String', required: true },
      hod: { type: 'String', required: true },
      coordinator: { type: 'String', required: true },
      color: { type: 'String', default: '#3B82F6' },
      goldMedals: { type: 'Number', default: 0 },
      silverMedals: { type: 'Number', default: 0 },
      bronzeMedals: { type: 'Number', default: 0 },
      totalPoints: { type: 'Number', default: 0 },
      matchesPlayed: { type: 'Number', default: 0 },
      matchesWon: { type: 'Number', default: 0 },
      studentAthleteCount: { type: 'Number', default: 0 },
    },
  },
  Tournament: {
    name: 'Tournament',
    fields: {
      title: { type: 'String', required: true },
      sport: {
        type: 'String',
        enum: ['Cricket', 'Badminton', 'Football', 'Volleyball', 'Basketball', 'Kabaddi', 'Chess', 'Table Tennis'],
        required: true,
      },
      format: { type: 'String', enum: ['Knockout', 'League'], required: true },
      genderCategory: { type: 'String', enum: ['Boys', 'Girls', 'Mixed'], default: 'Boys' },
      subCategory: { type: 'String' },
      participatingDepartments: [{ type: 'String', ref: 'Department' }],
      startDate: { type: 'Date', required: true },
      endDate: { type: 'Date', required: true },
      registrationDeadline: { type: 'Date', required: true },
      venue: { type: 'String', required: true },
      rules: { type: 'String' },
      maxTeams: { type: 'Number', default: 8 },
      status: { type: 'String', enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
      bannerImage: { type: 'String' },
      winnerDepartment: { type: 'String', ref: 'Department' },
      runnerUpDepartment: { type: 'String', ref: 'Department' },
    },
  },
  Team: {
    name: 'Team',
    fields: {
      name: { type: 'String', required: true },
      department: { type: 'String', ref: 'Department', required: true },
      sport: { type: 'String', required: true },
      genderCategory: { type: 'String', enum: ['Boys', 'Girls', 'Mixed'], default: 'Boys' },
      subCategory: { type: 'String' },
      tournamentId: { type: 'ObjectId', ref: 'Tournament', required: true },
      captain: {
        name: { type: 'String', required: true },
        rollNo: { type: 'String', required: true },
        phone: { type: 'String' },
        email: { type: 'String' },
      },
      logo: { type: 'String' },
      playerCount: { type: 'Number', default: 1 },
      status: { type: 'String', enum: ['Registered', 'Verified', 'Eliminated', 'Champion', 'Runner-up'], default: 'Registered' },
    },
  },
  Player: {
    name: 'Player',
    fields: {
      name: { type: 'String', required: true },
      rollNo: { type: 'String', required: true },
      department: { type: 'String', ref: 'Department', required: true },
      sport: { type: 'String', required: true },
      teamId: { type: 'ObjectId', ref: 'Team', required: true },
      gender: { type: 'String', enum: ['Male', 'Female'], default: 'Male' },
      jerseyNo: { type: 'Number', required: true },
      role: { type: 'String', required: true },
      avatar: { type: 'String' },
      stats: {
        matches: { type: 'Number', default: 0 },
        mvpCount: { type: 'Number', default: 0 },
        pointsOrRuns: { type: 'Number', default: 0 },
        goalsOrWickets: { type: 'Number', default: 0 },
      },
    },
  },
  Match: {
    name: 'Match',
    fields: {
      tournamentId: { type: 'ObjectId', ref: 'Tournament', required: true },
      sport: { type: 'String', required: true },
      round: { type: 'String', required: true },
      bracketNodeId: { type: 'Number' },
      teamA: {
        id: { type: 'ObjectId', ref: 'Team' },
        name: { type: 'String', required: true },
        department: { type: 'String', ref: 'Department', required: true },
        score: { type: 'String' },
        detail: { type: 'String' },
      },
      teamB: {
        id: { type: 'ObjectId', ref: 'Team' },
        name: { type: 'String', required: true },
        department: { type: 'String', ref: 'Department', required: true },
        score: { type: 'String' },
        detail: { type: 'String' },
      },
      scheduledDate: { type: 'Date', required: true },
      scheduledTime: { type: 'String', required: true },
      venue: { type: 'String', required: true },
      status: { type: 'String', enum: ['Scheduled', 'Live', 'Completed', 'Postponed'], default: 'Scheduled' },
      winnerId: { type: 'ObjectId', ref: 'Team' },
      winnerDepartment: { type: 'String', ref: 'Department' },
      playerOfTheMatch: {
        name: { type: 'String' },
        department: { type: 'String', ref: 'Department' },
        rollNo: { type: 'String' },
        statsSnippet: { type: 'String' },
      },
      nextMatchId: { type: 'ObjectId', ref: 'Match' },
    },
  },
  Announcement: {
    name: 'Announcement',
    fields: {
      title: { type: 'String', required: true },
      content: { type: 'String', required: true },
      category: { type: 'String', enum: ['Tournament', 'Schedule', 'Registration', 'Notice', 'Urgent'], default: 'Notice' },
      author: { type: 'String', required: true },
      date: { type: 'Date', default: 'Date.now' },
      pinned: { type: 'Boolean', default: false },
    },
  },
};
