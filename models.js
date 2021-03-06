const Sequelize = require('sequelize');
const config = require('./config');

const instance = new Sequelize(config.db, {
    define: {
        freezeTableName: true
    },
    logging: (process.env.NODE_ENV === "production" ? false : console.log)
});
module.exports.instance = instance;

// Model definitions
const User = instance.define('User', {
    facebookId: {type: Sequelize.STRING, unique: true},
    googleId: {type: Sequelize.STRING, unique: true},
    name: {type: Sequelize.STRING, allowNull: false, validate: {len: [3, 40]}},
    email: {type: Sequelize.STRING, unique: true, validate: {isEmail: true}},
    password: {type: Sequelize.STRING},
    emailConfirmed: {type: Sequelize.BOOLEAN},
    emailConfirmToken: {type: Sequelize.UUID, unique: true},
    admin: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}
});

const Team = instance.define('Team', {
    name: {type: Sequelize.STRING, allowNull: false, validate: {len: [1, 100]}},
    code: {type: Sequelize.STRING, allowNull: false, validate: {len: [1,10]}}
}, {
    timestamps: false
});

const Match = instance.define('Match', {
    goalsHome: Sequelize.INTEGER,
    goalsAway: Sequelize.INTEGER,
    when: {type: Sequelize.DATE, allowNull: false}
});

const MatchType = instance.define('MatchType', {
    code: {type: Sequelize.STRING, allowNull: false, validate: {len: [1, 10]}},
    name: {type: Sequelize.STRING, allowNull: false, validate: {len: [1, 100]}}
}, {
    timestamps: false
});

const Bet = instance.define('Bet', {
    goalsHome: {type: Sequelize.INTEGER, allowNull: false, validate: {min: 0, max: 20}},
    goalsAway: {type: Sequelize.INTEGER, allowNull: false, validate: {min: 0, max: 20}}
}, {
    indexes : [
        {
            unique: true,
            fields: ['UserId', 'MatchId']
        }
    ]
});

const News = instance.define('News', {
    headline: {type: Sequelize.TEXT, allowNull: false}
});

const History = instance.define('History', {
    score: {type: Sequelize.INTEGER, allowNull: false},
    rank: {type: Sequelize.INTEGER, allowNull: false},
    count3: {type: Sequelize.INTEGER, allowNull: false},
    count2: {type: Sequelize.INTEGER, allowNull: false},
    count1: {type: Sequelize.INTEGER, allowNull: false},
    count0: {type: Sequelize.INTEGER, allowNull: false}
}, {
    timestamps: false,
    indexes : [
        {
            unique: true,
            fields: ['UserId', 'MatchId']
        }
    ]
});

// Associations
Bet.belongsTo(User, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
User.hasMany(Bet);

Bet.belongsTo(Match, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
Match.hasMany(Bet);

Match.belongsTo(Team, {as: 'HomeTeam', foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
Match.belongsTo(Team, {as: 'AwayTeam', foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
Match.belongsTo(MatchType, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});

History.belongsTo(Match, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
Match.hasMany(History);

History.belongsTo(User, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
User.hasMany(History);
