import { Selector } from 'testcafe';

/* global fixture, test */

function url(x = '') {
  return process.env.BASE_URL + x;
}

const h3 = Selector('h3');
const h4 = Selector('h4');
const button = Selector('button');

fixture('smoo')
  .page(url());

test('it just works...', async t => {
  await t
    .expect(h3.exists).notOk();

  await t
    .click(button.withText('Open modal'))
    .expect(h3.count).eql(1)
    .expect(h3.textContent)
    .contains('It works.');
});

test('it handle nested modals', async t => {
  await t
    .click(button.withText('Open modal'))
    .click(button.withText('nested'));

    await t
      .expect(h4.count).eql(1)
      .expect(h4.textContent)
      .contains('Sub modal');
});
