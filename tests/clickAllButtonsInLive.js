var jwt = require('jsonwebtoken');

module.exports = {
  'Click all buttons in Live': (client) => {
    // ----------------------------
    // Test configuration settings.
    // ----------------------------
    const SECRET = `iXtZx1D5AqEB0B9pfn+hRQ==`;
    const ROOM_ID = `${client.globals.group.id}_${client.globals.run.id}`;

    const selectors = {
      homePage: {
        container: '#body',
      },
      joiningClass: {
        goLive: '.MuiFab-label',
        joinRoom: '.MuiTypography-root.MuiTypography-body1',
      },
      buttons: {
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

    const second = 1000;
    const minute = 60 * second;
    const timeout = 10 * 1000;

    const presentTime = 5 * minute;
    const actionTime = 20 * minute;
    const observeTime = 5 * minute;

    let url = 'https://live.loadtest.kidsloop.vn/?token=';
    let queryParams = '&selectionStrategy=random';

    const TEACHER = 'teacher';
    const STUDENT = 'student';

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
        //client.takeScreenshot(screenshotName);
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
        id: '21c9beb9-ae74-4447-9e4f-3582cae53774',
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
        user_id: '21c9beb9-ae74-4447-9e4f-3582cae53774',
        type: 'live',
        teacher: isTeacher,
        roomid: roomID,
        materials: [
          {
            id: '625546ca78a103bbfdccbb9b',
            name: 'Non H5P-Image',
            url: 'https://live.kidsloop.vn/assets/625546c478a103bbfdccbb94.png',
            __typename: 'Image',
          },
          {
            id: '625547d078a103bbfdccbc55',
            name: 'Course Presentation - dragdrop',
            url: '/h5p/play/6255461cc994c8716316cb5a',
            __typename: 'Iframe',
          },
          {
            id: '6255457078a103bbfdccbaa9',
            name: 'Course Presentation',
            url: '/h5p/play/62554582dd4e31ae654a92fd',
            __typename: 'Iframe',
          },
          {
            id: '6255438b78a103bbfdccb9c2',
            name: 'Drap and Drop',
            url: '/h5p/play/625543774ed8aaabe4d5c670',
            __typename: 'Iframe',
          },
          {
            id: '6255467f78a103bbfdccbb5a',
            name: 'Non H5P-video',
            url: 'https://live.kidsloop.vn/assets/6255466e78a103bbfdccbb51.mp4',
            __typename: 'Video',
          },
        ],
        classtype: 'live',
        org_id: '94c33343-0736-4100-9c61-704f098b2453',
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
          domain: `.loadtest.kidsloop.vn`,
          secure: false,
          httpOnly: false,
        })
        .resizeWindow(1920, 1080);

      waitAndClick(joiningClass.joinRoom);
    };

    // Teacher's present and observe flow function
    const session = () => {
      const { buttons } = selectors;

      client.waitForElementVisible(buttons.container, minute);

      waitAndClick(buttons.viewModes);
      client.pause(5 * second);
      waitAndClick(buttons.present);
      client.pause(5 * second);
      waitAndClick(buttons.canvas);
      client.pause(5 * second);
      waitAndClick(buttons.text);
      waitAndClick(buttons.container);
      client.keys('KIDSLOOP').pause(5 * second);
      waitAndClick(buttons.pen, 'canvas.png');

      client.pause(presentTime);

      waitAndClick(buttons.canvas);
      waitAndClick(buttons.viewModes);
      waitAndClick(buttons.observe, 'observe.png');

      client.pause(observeTime);
    };

    // Student flow and loop of actions during observe mode
    const studentInput = () => {
      const { buttons } = selectors;

      client.pause(presentTime);

      const iterations = ~~(observeTime / minute);

      for (let i = 0; i < iterations; i++) {
        client.pause(minute);
        waitAndClick(buttons.chat);
        waitAndClick(buttons.chatInput);
        client.keys(`message ${i}`);
        client.keys(client.Keys.ENTER);
        waitAndClick(buttons.chat);
        waitAndClick(buttons.microphone);
        waitAndClick(buttons.camera, `observeInput_${i}.png`);
      }
    };

    // Loop of actions for participants after observe mode
    const actionFlow = () => {
      const { buttons } = selectors;

      const iterations = ~~(actionTime / minute);

      for (let i = 0; i < iterations; i++) {
        client.perform(() => {
          if (!isActiveSession) {
            return;
          }

          client.pause(minute);

          doSessionAction(() => waitAndClick(buttons.chat));
          doSessionAction(() => waitAndClick(buttons.chatInput));
          doSessionAction(() =>
            client
              .keys(`message ${i} by ${client.globals.run.participant.id}`)
              .keys(client.Keys.ENTER)
          );
          doSessionAction(() => waitAndClick(buttons.chat));
          doSessionAction(() => waitAndClick(buttons.microphone));
          doSessionAction(() => waitAndClick(buttons.camera, `input_${i}.png`));
        });
      }
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
        session();
        actionFlow();

        break;
      case STUDENT:
        url +=
          generateStudentAuthToken(
            `Student ${client.globals.run.participant.id}`,
            ROOM_ID
          ) + queryParams;

        joinClass();
        studentInput();
        actionFlow();

        break;
      default:
        throw new Error(
          `Invalid account type: ${client.globals.participant.name.toLowerCase()}`
        );
    }
  },
};
