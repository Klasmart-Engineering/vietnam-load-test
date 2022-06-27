const jwt = require('jsonwebtoken');
const globalModule = require('../../globals');
const {
  ROOM_ID,
  GROUP_NAME,
  PARTICIPANT_ID,
  PARTICIPANT_NAME,
} = require('../../../configs/config');

module.exports = globalModule({
  'Test Output and Logs': (client) => {
    // ----------------------------
    // Test configuration settings.
    // ----------------------------

    const DOMAIN = 'beta.kidsloop.vn';
    const SECRET = `iXtZx1D5AqEB0B9pfn+hRQ==`;
    const ORG_ID = '94c33343-0736-4100-9c61-704f098b2453';
    const USER_ID = 'b2f7136b-7eaa-440a-8942-b18218ab4239';
    const CLASS_TYPE = 'live'; //live, class, study
    const MATERIALS = [
      {
        id: '60adc964b3eb96673eaf0ea3',
        name: 'Image',
        url: 'https://cdn-live.beta.kidsloop.vn/assets/60adc95eb3eb96673eaf0ea0.JPG',
        __typename: 'Image',
      },
      {
        id: '60adca33b3eb96673eaf0eed',
        name: 'PDF',
        url: 'assets/60adc9e7b3eb96673eaf0eea.pdf',
        __typename: 'Iframe',
      },
      {
        id: '60adc9beb3eb96673eaf0ec2',
        name: 'Video',
        url: 'https://cdn-live.beta.kidsloop.vn/assets/60adc97db3eb96673eaf0ebf.mp4',
        __typename: 'Video',
      },
      {
        id: '60adc93fb3eb96673eaf0e7d',
        name: 'Quiz1',
        url: '/h5p/play/60adc939eaceec00120c3fcf',
        __typename: 'Iframe',
      },
      {
        id: '60adc913b3eb96673eaf0e5a',
        name: 'Drag and Drop',
        url: '/h5p/play/60adc90feaceec00120c3fce',
        __typename: 'Iframe',
      },
      {
        id: '60adc750b3eb96673eaf0e06',
        name: 'Image Pairing',
        url: '/h5p/play/60adc746eaceec00120c3fc5',
        __typename: 'Iframe',
      },
    ];

    const second = 1000;
    const minute = 60 * second;
    const timeout = 10 * 1000;

    const presentTime = 1 * minute;
    const actionTime = 1 * minute;
    const observeTime = 1 * minute;

    let url = `https://live.${DOMAIN}/?token=`;
    let queryParams = '&selectionStrategy=random';

    const TEACHER = 'teacher';
    const STUDENT = 'student';

    const selectors = {
      homePage: {
        container: '#body',
      },
      joiningClass: {
        goLive: '.MuiFab-label',
        joinRoom: 'form > div > div:nth-child(3) > button',
      },
      livePage: {
        container: '#main-content',
      },
      buttons: {
        back: 'div.MuiGrid-root.MuiGrid-container.MuiGrid-wrap-xs-nowrap > div:nth-child(1) > div',
        next: 'div:nth-child(3) > div',
        confirm: 'div:nth-child(1) > div > div > button',
        leave: 'div > div > div > button',
        microphone: '#toolbar-item-microphone',
        camera: '#toolbar-item-camera',
        canvas:
          'div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div > button',
        text: '#body > div:nth-child(2) > div > div > div:nth-child(2) > div',
        viewModes: 'div:nth-child(3) > div:nth-child(3) > div',
        present: '[title="Present"]',
        observe: '[title="Observe"]',
        endCall: '#toolbar-item-call',
        confirmEndClass:
          'button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary',
        pen: '#body > div:nth-child(2) > div > div > div:nth-child(1) > div',
        chat: 'div:nth-child(4) > div > button',
        chatInput: 'div:nth-child(3) > form',
      },
    };

    // Internal variable for checking session state.
    let isActiveSession = true;

    // ----------------------------
    // Helper functions.
    // ----------------------------

    // Waits until element is visible and clicks on it. If screenshotName is provided, then
    // screenshot is taken before clicking.
    const waitAndClick = (selector, screenshotName = '', t = timeout) => {
      client.waitForElementVisible(selector, t);

      if (screenshotName !== '') {
        client.takeScreenshot(screenshotName);
      }
      client.click(selector);
    };

    const doSessionAction = (action) => {
      const { buttons } = selectors;

      client.isVisible(
        { suppressNotFoundErrors: true, selector: buttons.container },
        ({ value, status }) => {
          // Not found or not visible
          if (
            status !== 0 ||
            !value ||
            (Array.isArray(value) && value.length === 0)
          ) {
            isActiveSession = false;

            return;
          }

          action();
        }
      );
    };

    const padTo2Digits = (num) => {
      return num.toString().padStart(2, '0');
    };

    const formatDate = (date) => {
      return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join('-');
    };

    // Token generation functions
    const generateAccessToken = () => {
      const payload = {
        id: USER_ID,
        email: 'qavn1+teacher1@calmid.com',
        exp: 1945208998,
        iss: 'calmid-debug',
      };
      return jwt.sign(payload, SECRET, {
        algorithm: 'HS256',
        header: { issuer: 'calmid-debug' },
      });
    };

    const generateAuthToken = ({ name, roomID, isTeacher }) => {
      const payload = {
        aud: 'kidsloop-live',
        exp: 1945283699,
        iat: 1945208073,
        iss: 'calmid-debug',
        sub: 'authorization',
        name: name,
        schedule_id: roomID,
        user_id: USER_ID,
        type: CLASS_TYPE,
        teacher: isTeacher,
        roomid: roomID,
        materials: MATERIALS,
        classtype: CLASS_TYPE,
        org_id: ORG_ID,
        start_at: 1645200000,
        end_at: 1945282799,
      };

      return jwt.sign(payload, SECRET, {
        algorithm: 'HS256',
        header: { issuer: 'calmid-debug' },
      });
    };

    const generateTeacherAuthToken = (teacherName, roomID) => {
      return generateAuthToken({
        name: teacherName,
        roomID: roomID,
        isTeacher: true,
      });
    };

    const generateStudentAuthToken = (studentName, roomID) => {
      return generateAuthToken({
        name: studentName,
        roomID: roomID,
        isTeacher: false,
      });
    };

    // ----------------------------
    // Script functions.
    // ----------------------------

    // Joining class function
    const joinClass = () => {
      const { joiningClass, livePage } = selectors;

      console.log('Room ID: ', ROOM_ID);
      console.log('Participant ID: ', PARTICIPANT_ID);
      console.log('Participant Name: ', `${GROUP_NAME} - ${PARTICIPANT_ID}`);
      console.log('Group Name: ', GROUP_NAME);

      client
        .url(url)
        .setCookie({
          name: `access`,
          value: generateAccessToken(),
          path: `/`,
          domain: `.${DOMAIN}`,
          secure: false,
          httpOnly: false,
        })
        .resizeWindow(1920, 1080);

      waitAndClick(joiningClass.joinRoom);
    };

    const teacherActionFlow = () => {
      // TODO: Implement test case here
      const { buttons } = selectors;
      client.pause(1 * minute);
      waitAndClick(buttons.viewModes);
      waitAndClick(buttons.observe);
      client.pause(1 * minute);
      client.takeScreenshot(
        `${PARTICIPANT_ID}-joinRoomAfter5m-${formatDate(new Date())}.png`
      );
      client.pause(1 * minute);
      client.takeScreenshot(
        `${PARTICIPANT_ID}-finish-${formatDate(new Date())}.png`
      );
    };
    // Loop of actions for participants
    const studentActionFlow = () => {
      // TODO: Implement test case here
      const { buttons } = selectors;

      client.pause(1 * minute);
      client.takeScreenshot(
        `${PARTICIPANT_ID}-joinRoomAfter5m-${formatDate(new Date())}.png`
      );
      client.pause(1 * minute);
      client.takeScreenshot(
        `${PARTICIPANT_ID}-finish-${formatDate(new Date())}.png`
      );
    };

    // Account credentials setup.
    switch (GROUP_NAME.toLowerCase()) {
      case TEACHER:
        url +=
          generateTeacherAuthToken(PARTICIPANT_NAME, ROOM_ID) + queryParams;

        joinClass();
        teacherActionFlow();

        break;
      case STUDENT:
        url +=
          generateStudentAuthToken(PARTICIPANT_NAME, ROOM_ID) + queryParams;

        joinClass();
        studentActionFlow();

        break;
      default:
        throw new Error(`Invalid account type: ${PARTICIPANT_NAME}`);
    }
  },
});
