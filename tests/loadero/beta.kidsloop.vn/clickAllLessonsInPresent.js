var jwt = require('jsonwebtoken');

module.exports = {
  'Click all lessons in Present': (client) => {
    // ----------------------------
    // Test configuration settings.
    // ----------------------------
    const DOMAIN = 'beta.kidsloop.vn';
    const SECRET = `iXtZx1D5AqEB0B9pfn+hRQ==`;
    const ORG_ID = '051f6f59-ddf7-4d4a-9b88-d536235bae43';
    const USER_ID = 'baf70ce4-3ab0-4167-8877-c978f822ca90';
    const ROOM_ID = `${client.globals.group.id}_${client.globals.run.id}`;
    const CLASS_TYPE = 'live'; //live, class, study, home
    const MATERIALS = [
      {
        id: '60adca33b3eb96673eaf0eed',
        name: 'PDF',
        url: 'assets/60adc9e7b3eb96673eaf0eea.pdf',
        __typename: 'Iframe',
      },
      //   {
      //     id: '60adc9beb3eb96673eaf0ec2',
      //     name: 'Video',
      //     url: 'https://cdn-live.beta.kidsloop.vn/assets/60adc97db3eb96673eaf0ebf.mp4',
      //     __typename: 'Video',
      //   },
      {
        id: '60adc964b3eb96673eaf0ea3',
        name: 'Image',
        url: 'https://cdn-live.beta.kidsloop.vn/assets/60adc95eb3eb96673eaf0ea0.JPG',
        __typename: 'Image',
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

    const presentTime = 2 * minute;
    const actionTime = 3 * minute;
    const observeTime = 5 * minute;

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
        joinRoom: '.MuiTypography-root.MuiTypography-body1',
      },
      buttons: {
        lessonPlan: 'div:nth-child(3) > div:nth-child(2) > div > button',
        microphone: '#toolbar-item-microphone',
        camera: '#toolbar-item-camera',
        canvas:
          'div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div > button',
        text: '#body > div:nth-child(2) > div > div > div:nth-child(2) > div',
        container: '#main-content',
        viewModes: 'div:nth-child(3) > div:nth-child(3) > div',
        present: '[title="Present"]',
        observe: '[title="Observe"]',
        endCall: '#toolbar-item-call',
        confirmEndClass: 'button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary',
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

    const clickElementNthInLessonDialog = (nth) => {
      waitAndClick(`#body > div:nth-child(2) > div > div > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-true > div > div > div > div:nth-child(${nth}) > button`);
    };

    // Token generation functions
    const generateAccessToken = () => {
      const payload = {
        id: USER_ID,
        email: 'qa+stress_t1@calmid.com',
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
      const { joiningClass } = selectors;

      console.log('Room ID: ', ROOM_ID);
      console.log('Participant ID: ', client.globals.participant.id);
      console.log('Participant Name: ', client.globals.participant.name);
      console.log('Group ID: ', client.globals.group.id);

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

    // Loop of actions for participants
    const actionFlow = () => {
      const { buttons } = selectors;
      waitAndClick(buttons.viewModes);
      waitAndClick(buttons.present);
      waitAndClick(buttons.lessonPlan);

      for (let i = 0; i < MATERIALS.length; i++) {
        client.pause(10 * second);
        clickElementNthInLessonDialog(i*2 + 1);
      }
      client.pause(20 * second);
      waitAndClick(buttons.endCall);
      waitAndClick(buttons.confirmEndClass);
      client.pause(10 * second);
    };

    // Account credentials setup.
    switch (client.globals.participant.name.toLowerCase()) {
      case TEACHER:
        url +=
          generateTeacherAuthToken(
            `Teacher ${client.globals.run.participant.id}`,
            ROOM_ID
          ) + queryParams;

        joinClass();
        actionFlow();

        break;
      case STUDENT:
        url +=
          generateStudentAuthToken(
            `Student ${client.globals.run.participant.id}`,
            ROOM_ID
          ) + queryParams;

        joinClass();
        actionFlow();

        break;
      default:
        throw new Error(
          `Invalid account type: ${client.globals.participant.name.toLowerCase()}`
        );
    }
  },
};
