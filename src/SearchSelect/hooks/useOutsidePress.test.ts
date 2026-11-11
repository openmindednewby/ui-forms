import { isOutside } from './useOutsidePress';

function tree() {
  const container = document.createElement('div');
  const child = document.createElement('span');
  container.appendChild(child);
  document.body.appendChild(container);
  return { container, child };
}

describe('isOutside', () => {
  it('with a press on a node inside the field, returns false', () => {
    const { container, child } = tree();

    const outside = isOutside(container, child);

    expect(outside).toBe(false);
  });

  it('with a press on the page around the field, returns true', () => {
    const { container } = tree();

    const outside = isOutside(container, document.body);

    expect(outside).toBe(true);
  });

  it('with no mounted field, returns false', () => {
    const outside = isOutside(null, document.body);

    expect(outside).toBe(false);
  });
});
