const ROOM_ID = process.env.ROOMID || 'test_room'
const GROUP_NAME = process.env.GROUPNAME || 'teacher'
const PARTICIPANT_ID = process.env.PARTICIPANTID || 'participant'
const PARTICIPANT_NAME = `${GROUP_NAME} - ${PARTICIPANT_ID}`;

module.exports = { ROOM_ID, GROUP_NAME, PARTICIPANT_ID, PARTICIPANT_NAME }