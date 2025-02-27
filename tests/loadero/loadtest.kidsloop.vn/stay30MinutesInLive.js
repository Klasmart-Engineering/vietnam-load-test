var jwt = require('jsonwebtoken');

module.exports = {
  'Stay 30 minutes in Live': (client) => {
    // ----------------------------
    // Test configuration settings.
    // ----------------------------
    const DOMAIN = 'loadtest.kidsloop.vn';
    const SECRET = `iXtZx1D5AqEB0B9pfn+hRQ==`;
    const ORG_ID = '94c33343-0736-4100-9c61-704f098b2453';
    const USER_ID = 'b2f7136b-7eaa-440a-8942-b18218ab4239';
    const ROOM_ID = `${client.globals.group.id}_${client.globals.run.id}`;
    const CLASS_TYPE = 'live'; //live, class, study
    const MATERIALS = [
      {
        id: '6258f2ffd1ecfd49d143a316',
        name: 'Non H5P-Image - Welcome',
        url: 'https://live.loadtest.kidsloop.vn/assets/6258f2dbb53568f5dd2f4812.png',
        __typename: 'Image',
      },
      {
        id: '6258f56a53d32ac59ec45993',
        name: 'Find the words -number',
        url: '/h5p/play/6258f49f2ad8bc8d4768478a',
        __typename: 'Iframe',
      },
      {
        id: '6257a21dfd8b189cf168cf63',
        name: 'PDF file',
        url: 'assets/6257a21954a34625f4c063a0.pdf',
        __typename: 'Iframe',
      },
      {
        id: '6258f5c3b53568f5dd2f4964',
        name: 'Course Presentation - dragdrop',
        url: '/h5p/play/6258f0892ad8bc8d47684788',
        __typename: 'Iframe',
      },
      {
        id: '6258f3a9b53568f5dd2f486d',
        name: 'PDF file',
        url: 'assets/6258f3a61c4f2c1a0591cf1d.pdf',
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
        back: 'div.MuiGrid-root.MuiGrid-container.MuiGrid-wrap-xs-nowrap > div:nth-child(1) > div',
        next: 'div:nth-child(3) > div',
        confirm: 'div:nth-child(1) > div > div > button',
        leave: 'div > div > div > button',
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
      // TODO: Implement test case here
      const {buttons} = selectors;
      
      client.pause(30 * minute);
      client.takeScreenshot(`finish.png`);
      waitAndClick(buttons.endCall);
      waitAndClick(buttons.confirmEndClass);
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
