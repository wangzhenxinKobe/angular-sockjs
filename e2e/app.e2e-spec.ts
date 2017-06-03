import { AngularSockjsPage } from './app.po';

describe('angular-sockjs App', () => {
  let page: AngularSockjsPage;

  beforeEach(() => {
    page = new AngularSockjsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
