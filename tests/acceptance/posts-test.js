import { click, find, waitUntil, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance: title', function(hooks) {
  setupApplicationTest(hooks);

  // Testem appends progress to the title...
  // and there's no way to stop this at the moment
  function title() {
    let element = document.querySelector('head title');
    return element && element.innerText.trim().replace(/^\(\d+\/\d+\)/, '');
  }

  test('the default configuration works', async function (assert) {
    assert.expect(1);
    await visit('/posts');

    assert.equal(title(), 'My App | Posts');
  });

  test('the replace attribute works', async function (assert) {
    assert.expect(1);
    await visit('/about');

    assert.equal(title(), 'About My App');
  });

  test('custom separators work', async function (assert) {
    assert.expect(1);
    await visit('/about/authors');

    assert.equal(title(), 'About My App > Authors');
  });

  test('custom separators are inherited', async function (assert) {
    assert.expect(1);
    await visit('/about/authors/profile');

    assert.equal(title(), 'About My App > Authors > Profile');
  });

  test('multiple components in a row work', async function (assert) {
    assert.expect(1);
    await visit('/posts/rails-is-omakase');

    assert.equal(title(), 'My App | Posts | Rails is Omakase');
  });

  test('the prepend declaration works', async function (assert) {
    assert.expect(1);
    await visit('/authors/tomster');

    assert.equal(title(), 'My App | Tomster < Authors');
  });

  test('replace nested in prepends work', async function (assert) {
    assert.expect(1);
    await visit('/hollywood');

    assert.equal(title(), 'Hollywood ★ Stars everywhere');
  });

  test('multitoken titles work', async function (assert) {
    assert.expect(1);
    await visit('/feeds/tomster');

    assert.equal(title(), 'Tomster (@tomster)');
  });

  test('loading substates are not shown', async function (assert) {
    assert.expect(4);
    await visit('/feeds/tomster');
    assert.equal(title(), 'Tomster (@tomster)');

    await click('#zoey');
    await waitUntil(() => {
      return find('div').innerText !== 'Loading...';
    });
    assert.equal(title(), 'Zoey (@zoey)');

    await click('#tomster');
    assert.equal(title(), 'Zoey (@zoey)');

    await waitUntil(() => {
      return find('div').innerText !== 'Loading...';
    });
    assert.equal(title(), 'Tomster (@tomster)');
  });
});
