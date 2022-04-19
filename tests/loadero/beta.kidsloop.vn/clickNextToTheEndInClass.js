var jwt = require('jsonwebtoken');

module.exports = {
  'Click next to the end in In-class': (client) => {
    // ----------------------------
    // Test configuration settings.
    // ----------------------------
    const DOMAIN = 'beta.kidsloop.vn';
    const SECRET = `iXtZx1D5AqEB0B9pfn+hRQ==`;
    const ORG_ID = '051f6f59-ddf7-4d4a-9b88-d536235bae43';
    const USER_ID = 'baf70ce4-3ab0-4167-8877-c978f822ca90';
    const ROOM_ID = `${client.globals.group.id}_${client.globals.run.id}`;
    const CLASS_TYPE = 'class'; //live, class, study, home
    const MATERIALS = [
      {
        id: '6257a1a02794403b76f8a1c6',
        name: 'Non H5P-Image',
        url: 'https://live.loadtest.kidsloop.vn/assets/6257a19ea95d97347657aea3.png',
        __typename: 'Image',
      },
      {
        id: '6257a1effd8b189cf168cf4d',
        name: 'Non H5P-video shape song',
        url: 'https://live.loadtest.kidsloop.vn/assets/6257a1dfa95d97347657aec1.mp4',
        __typename: 'Video',
      },
      {
        id: '6257a21dfd8b189cf168cf63',
        name: 'PDF file',
        url: 'assets/6257a21954a34625f4c063a0.pdf',
        __typename: 'Iframe',
      },
      {
        id: '6257a177b3ef45c796598069',
        name: 'Audio Recording -Count to five in English',
        url: '/h5p/play/6257a15b007a27f7f3bc84c7',
        __typename: 'Iframe',
      },
      {
        id: '6257a00dfd8b189cf168ce7f',
        name: 'Fill in the blank -math',
        url: '/h5p/play/6257a00ae0357c37e2383373',
        __typename: 'Iframe',
      },
      {
        id: '62579fdea95d97347657ade8',
        name: 'Multiple hotspots',
        url: '/h5p/play/62579fca545667bacf0b6a99',
        __typename: 'Iframe',
      },
      {
        id: '62579f9ba95d97347657adc7',
        name: 'Drap and Drop -Math',
        url: '/h5p/play/62579f941ff58acf4733fbce',
        __typename: 'Iframe',
      },
      {
        id: '62579f6ce5c4be21fbacf537',
        name: 'memory game -math',
        url: '/h5p/play/62579f4f2ad8bc8d47684787',
        __typename: 'Iframe',
      },
      {
        id: '6257aa91e5c4be21fbacfa15',
        name: 'Speak the word sets',
        url: '/h5p/play/62579c4b35b4545d627fd117',
        __typename: 'Iframe',
      },
      {
        id: '6257a9eeebd79e6afc18cf3b',
        name: 'Find the words -number',
        url: '/h5p/play/62579bf635b4545d627fd116',
        __typename: 'Iframe',
      },
      {
        id: '62579b41e5c4be21fbacf37b',
        name: 'Quiz',
        url: '/h5p/play/62579b3d2ad8bc8d47684786',
        __typename: 'Iframe',
      },
      {
        id: '6257995fe5c4be21fbacf2b1',
        name: 'Interactive Video -Youtube',
        url: '/h5p/play/6257994d007a27f7f3bc84c5',
        __typename: 'Iframe',
      },
      {
        id: '6257968a54a34625f4c05ec0',
        name: 'Course Presentation - multiple choice',
        url: '/h5p/play/62579783007a27f7f3bc84c4',
        __typename: 'Iframe',
      },
      {
        id: '6256a2ec54a34625f4bffd18',
        name: 'test1 -Course presentation',
        url: '/h5p/play/625682058ccccefae42a5476',
        __typename: 'Iframe',
      },
      {
        id: '6256a2e42794403b76f83b6d',
        name: 'test2-drap and drop',
        url: '/h5p/play/6256a2d58ccccefae42a5477',
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
        leave: 'div:nth-child(2) > div > div:nth-child(2) > button',
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

    const nextToTheEnd = () => {
      const { buttons } = selectors;

      for (let i = 0; i < MATERIALS.length; i++) {
        client.pause(10 * second);
        doSessionAction(() => waitAndClick(buttons.next));
      }
    };

    const backToTheFirst = () => {
      const { buttons } = selectors;
      
      for (let i = 0; i < MATERIALS.length; i++) {
        client.pause(10 * second);
        doSessionAction(() => waitAndClick(buttons.back));
      }
    };

    // Loop of actions for participants
    const actionFlow = () => {
      // TODO: Implement test case here
      const { buttons } = selectors;

      nextToTheEnd();

      for (let count = 0; count < 2; count++) {
        backToTheFirst();
        nextToTheEnd();
      }

      client.pause(20 * second);
      waitAndClick(buttons.leave);
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
