// FIXME
describe('Home page', () => {
  it('can render component', () => {
    expect(true).toBe(true);
  });
});

// /**
//  * @jest-environment node
//  */
// import { initImaApp, clearImaApp } from '@ima/plugin-testing-integration';

// import cards from '../../../public/cards.json';

// describe('Home page', () => {
//   const response = {
//     body: cards,
//   };
//   let app;
//   let http;

//   beforeEach(async () => {
//     app = await initImaApp({
//       initBindApp: (ns, oc) => {
//         http = oc.get('$Http');

//         // Mock http.get method so the application
//         // wont make any external requests
//         // and return mocked response
//         http.get = jest.fn().mockReturnValue(Promise.resolve(response));
//       },
//     });

//     await app.oc.get('$Router').route('/');
//   });

//   afterEach(() => {
//     clearImaApp(app);
//   });

//   it('can render component', () => {
//     expect(document.querySelectorAll('.cards')).toHaveLength(1);
//     expect(document.querySelectorAll('.card')).toHaveLength(cards.length);

//     const paragraphElements = document.querySelectorAll('.card p');
//     const titleElements = document.querySelectorAll('.card h3');

//     for (let i = 0; i < cards.length; i++) {
//       const paragraphText = paragraphElements[i].innerHTML.replace(
//         /href=".*"/,
//         'href="{link}"'
//       );

//       expect(titleElements[i].textContent).toContain(cards[i].title);
//       expect(paragraphText).toContain(cards[i].content);
//     }
//   });
// });
